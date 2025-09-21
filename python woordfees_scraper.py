# save as woordfees_scraper_plus.py
import asyncio, json, re, csv, urllib.parse
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

PROGRAM_URL = "https://woordfees.co.za/chronological-program/"

OUT_PROGRAMME_JSON = Path("programme.json")
OUT_VENUES_JSON    = Path("venues.json")
OUT_PROGRAMME_CSV  = Path("programme.csv")
OUT_VENUES_CSV     = Path("venues.csv")

# ------------------ helpers ------------------

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^\w\- ]+", "", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-")

def parse_duration_minutes(txt: Optional[str]) -> Optional[int]:
    if not txt: return None
    m = re.search(r"(\d+)\s*(min|minute)", txt.lower())
    return int(m.group(1)) if m else None

def parse_price_text(txt: Optional[str]) -> str:
    if not txt: return ""
    return " ".join(txt.split())

def normalize_price(price_text: str) -> Tuple[Optional[str], Optional[float], Optional[float]]:
    """
    Returns (currency, price_min, price_max). Handles:
      - "R150", "R150 – R250", "R 80 - R120", "Gratis", "Free", "TBC"
    Leaves None when we can't confidently parse.
    """
    if not price_text:
        return None, None, None

    t = price_text.strip()
    # Free/gratis
    if re.search(r"(?i)\b(gratis|free|geen koste)\b", t):
        return "ZAR", 0.0, 0.0

    # Currency detection
    currency = "ZAR" if "R" in t or "ZAR" in t else None

    # Numbers (allow thousand sep, decimals)
    nums = re.findall(r"(\d+(?:[.,]\d{1,2})?)", t.replace(" ", ""))
    vals = []
    for n in nums:
        v = float(n.replace(",", "."))
        vals.append(v)

    if not vals:
        return currency, None, None

    if len(vals) == 1:
        return currency, vals[0], vals[0]

    # Range or multi-tier pricing: use min/max
    return currency, min(vals), max(vals)

def parse_date_from_detail(date_txt: Optional[str]) -> Optional[str]:
    if not date_txt: return None
    months = {
        "januarie":"01","februarie":"02","maart":"03","april":"04","mei":"05","junie":"06",
        "july":"07","julie":"07","augustus":"08","september":"09","oktober":"10","november":"11","desember":"12",
        "january":"01","february":"02","march":"03","april":"04","may":"05","june":"06",
        "july":"07","august":"08","september":"09","october":"10","november":"11","december":"12"
    }
    parts = date_txt.strip().split()
    if len(parts) >= 2:
        day = re.sub(r"\D", "", parts[0])
        month = months.get(parts[1].lower())
        if day and month:
            # Woordfees year: adjust here if needed
            return f"2025-{month}-{int(day):02d}"
    return None

def extract_coords_from_maps_url(url: Optional[str]) -> Tuple[Optional[float], Optional[float]]:
    """
    Attempts to parse lat/lng from common Google Maps URL shapes:
      - .../@-33.9301,18.8602,15z
      - ...?q=-33.9301,18.8602
      - ...?ll=-33.9301,18.8602
    Shortlinks (maps.app.goo.gl/...) usually need a live resolve; we can’t deref here,
    so we’ll leave coords as None when not embedded.
    """
    if not url: return None, None
    try:
        parsed = urllib.parse.urlparse(url)
        q = urllib.parse.parse_qs(parsed.query)

        # 1) @lat,lng in path
        m = re.search(r"/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)", parsed.path)
        if m:
            return float(m.group(1)), float(m.group(2))

        # 2) q=lat,lng
        for key in ("q","ll"):
            if key in q and q[key]:
                cand = q[key][0]
                m = re.match(r"\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)", cand)
                if m:
                    return float(m.group(1)), float(m.group(2))
    except Exception:
        pass
    return None, None

async def safe_text(locator) -> str:
    try:
        t = await locator.text_content()
        return (t or "").strip()
    except:
        return ""

async def get_following_text(box, label_afr: str, label_eng: Optional[str] = None) -> str:
    """
    Grab text that appears within or just after a label like "Kategorie" / "Category".
    We keep this heuristic robust because templates can vary a bit per event.
    """
    candidates = [label_afr]
    if label_eng: candidates.append(label_eng)
    for lab in candidates:
        el = box.locator(f"text={lab}").first
        if await el.count():
            # read the parent block as a fallback
            parent = el.locator("xpath=..")
            txt = await safe_text(parent)
            if txt:
                txt = re.sub(rf"(?i){label_afr}\s*:", "", txt)
                if label_eng:
                    txt = re.sub(rf"(?i){label_eng}\s*:", "", txt)
                return " ".join(txt.split())
    return ""

# ------------------ extraction ------------------

async def extract_event_detail(page, url: str, language_hint: str) -> Dict[str, Any]:
    await page.goto(url, wait_until="domcontentloaded")
    # small settle for late text nodes
    await page.wait_for_timeout(300)

    title = (await page.locator("h1").first.text_content() or "").strip()
    main = page.locator("main")

    category = await get_following_text(main, "Kategorie", "Category")
    duration_txt = await get_following_text(main, "Tydsduur", "Duration")
    duration_minutes = parse_duration_minutes(duration_txt)

    dt_block = await get_following_text(main, "Datum en Tyd", "Date and Time")
    date_match = re.search(r"([0-9]{1,2}\s+\w+)", dt_block)
    time_match = re.search(r"(\d{1,2}:\d{2})", dt_block)
    date_iso = parse_date_from_detail(date_match.group(1)) if date_match else None
    time_txt = time_match.group(1) if time_match else None

    venue_block = await get_following_text(main, "Venue", "Venue")
    venue_name, venue_map_url = None, None
    # prefer explicit maps link
    maps_link = main.locator("a[href*='maps.google'], a[href*='maps.app.goo.gl'], a[href*='goo.gl/maps']").first
    if await maps_link.count():
        venue_name = (await safe_text(maps_link)) or None
        venue_map_url = await maps_link.get_attribute("href")
    else:
        # fallback to first line of the venue text
        if venue_block:
            venue_name = venue_block.splitlines()[0].strip()

    price_text = parse_price_text(await get_following_text(main, "Prys", "Price"))
    price_currency, price_min, price_max = normalize_price(price_text)

    # description
    description = ""
    try:
        desc_label = main.locator("text=Beskrywing, text=Description").first
        if await desc_label.count():
            parent = desc_label.locator("xpath=..")
            description = (await safe_text(parent))
            description = re.sub(r"(?i)^(Beskrywing|Description)\s*:", "", description).strip()
    except:
        pass

    # tickets link
    tickets_url = None
    for sel in ["a:has-text('Koop kaartjies')", "a:has-text('Buy tickets')"]:
        el = page.locator(sel).first
        if await el.count():
            tickets_url = await el.get_attribute("href")
            break

    lat, lng = extract_coords_from_maps_url(venue_map_url)

    event_id = slugify(title) or slugify(url.rstrip("/").split("/")[-1])

    return {
        "id": event_id,
        "title": title or None,
        "category": category or None,
        "date": date_iso,
        "time": time_txt,
        "duration_minutes": duration_minutes,
        "venue_name": venue_name,
        "venue_map_url": venue_map_url,
        "venue_lat": lat,
        "venue_lng": lng,
        "price_text": price_text or None,
        "price_currency": price_curre
