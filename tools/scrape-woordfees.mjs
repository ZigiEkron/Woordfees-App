// tools/scrape-woordfees.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import PQueue from "p-queue";
import { fetch } from "undici";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");

const BASE = "https://woordfees.co.za";
const PROGRAMME_INDEX = `${BASE}/en/chronological-programme/`;
const VENUE_ARCHIVE = `${BASE}/en/program-venue/`;

function slugify(s) {
  return (s || "")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: { "user-agent": "WoordfeesApp/1.0 (+script)" } });
    if (r.ok) return await r.text();
    await new Promise(r => setTimeout(r, 500 * (i + 1)));
  }
  throw new Error(`GET failed: ${url}`);
}

async function scrapeVenues() {
  const venues = [];
  let next = VENUE_ARCHIVE;
  while (next) {
    const html = await get(next);
    const $ = cheerio.load(html);
    $(".post-list article").each((_, el) => {
      const $el = $(el);
      const name = $el.find("h3").text().trim();
      if (!name) return;
      const href = $el.find("a:contains('Read more'), a.more-link").attr("href");
      const detailUrl = href ? new URL(href, BASE).toString() : undefined;
      venues.push({ id: slugify(name), name, detailUrl });
    });
    const $next = $(".pagination a.next");
    next = $next.attr("href") ? new URL($next.attr("href"), BASE).toString() : null;
  }
  // Enrich coords if present
  const q = new PQueue({ concurrency: 6 });
  await Promise.all(venues.map(v => q.add(async () => {
    if (!v.detailUrl) return;
    try {
      const html = await get(v.detailUrl);
      const $ = cheerio.load(html);
      const mapLink = $("a[href*='google.com/maps'], a[href^='geo:']").attr("href") || "";
      const m1 = /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(mapLink);
      const m2 = /([-]?\d+\.\d+)[,\s]+([-]?\d+\.\d+)/.exec(mapLink);
      const mm = m1 || m2;
      if (mm) { v.lat = parseFloat(mm[1]); v.lng = parseFloat(mm[2]); }
      const addr = $("address").text().trim() || $(".single-venue__content p").first().text().trim();
      if (addr) v.address = addr;
    } catch {}
  })));
  const seen = new Set();
  return venues.filter(v => (seen.has(v.name) ? false : (seen.add(v.name), true)));
}

function parseTimeRange(s) {
  const m = /(\d{1,2}:\d{2})\s*(?:-\s*(\d{1,2}:\d{2}))?/.exec(s);
  return m ? { start: m[1], end: m[2] || null } : { start: null, end: null };
}

async function scrapeProgramme() {
  let next = PROGRAMME_INDEX;
  const rows = [];
  while (next) {
    const html = await get(next);
    const $ = cheerio.load(html);
    $(".chronological-programme__row, .programme-row, li").each((_, el) => {
      const $el = $(el);
      const timeText = $el.find(".time, .programme-time").text().trim() || $el.text();
      const { start } = parseTimeRange(timeText);
      const link = $el.find("a[href*='/program/'], a[href*='/programme/']").first();
      const title = link.text().trim() || $el.find(".title").text().trim();
      const href = link.attr("href") ? new URL(link.attr("href"), BASE).toString() : null;
      if (!title || !href || !start) return;
      const section = $el.find(".category, .programme-category").text().trim() || undefined;
      const venueName = $el.find(".venue, .programme-venue").text().trim() || undefined;
      rows.push({ href, title, section, venueName, start });
    });
    const $next = $(".pagination a.next");
    next = $next.attr("href") ? new URL($next.attr("href"), BASE).toString() : null;
  }

  const q = new PQueue({ concurrency: 8 });
  const items = [];
  await Promise.all(rows.map(stub => q.add(async () => {
    try {
      const html = await get(stub.href);
      const $ = cheerio.load(html);
      const meta = {};
      $(".single-programme__meta li, li").each((_, el) => {
        const t = $(el).text().replace(/\s+/g, " ").trim();
        if (/^Category/i.test(t)) meta.category = t.replace(/^Category\.\s*/i, "").trim();
        if (/^Language/i.test(t)) meta.language = t.replace(/^Language\.\s*/i, "").trim();
        if (/^Age restriction/i.test(t)) meta.ageRestriction = t.replace(/^Age restriction\.\s*/i, "").trim();
        if (/^Duration/i.test(t)) { const m = /(\d+)\s*Minute/i.exec(t); if (m) meta.durationMin = parseInt(m[1], 10); }
        if (/^Venue/i.test(t)) meta.venueName = t.replace(/^Venue\.\s*/i, "").trim();
      });
      const times = [];
      $(".single-programme__dates li, .dates li").each((_, el) => {
        const txt = $(el).text().replace(/\s+/g, " ").trim();
        const dm = /(\d{4}-\d{2}-\d{2})/.exec(txt);
        const hm = /(\d{1,2}:\d{2})/.exec(txt);
        if (dm || hm) times.push({ dateISO: dm ? dm[1] : "", time: hm ? hm[1] : "" });
      });
      items.push({
        id: slugify(stub.title),
        title: stub.title,
        category: meta.category || stub.section,
        language: meta.language,
        ageRestriction: meta.ageRestriction,
        durationMin: meta.durationMin,
        venueId: slugify(meta.venueName || stub.venueName || ""),
        times: times.length ? times : [{ dateISO: "", time: stub.start }],
        ticketUrl: $("a[href*='webtickets'], a[href*='quicket']").attr("href") || undefined,
        detailUrl: stub.href
      });
    } catch {
      items.push({
        id: slugify(stub.title),
        title: stub.title,
        category: stub.section,
        venueId: slugify(stub.venueName || ""),
        times: [{ dateISO: "", time: stub.start }],
        detailUrl: stub.href
      });
    }
  })));
  const byKey = new Map();
  for (const it of items) {
    const key = `${it.id}::${it.venueId}`;
    if (!byKey.has(key)) byKey.set(key, it);
    else {
      const prev = byKey.get(key);
      prev.times = [...prev.times, ...it.times];
      byKey.set(key, prev);
    }
  }
  return [...byKey.values()].sort((a, b) => a.title.localeCompare(b.title));
}

async function main() {
  await fs.mkdir(ASSETS, { recursive: true });
  const venues = await scrapeVenues();
  const programme = await scrapeProgramme();
  await fs.writeFile(path.join(ASSETS, "venues.json"), JSON.stringify(venues, null, 2), "utf-8");
  await fs.writeFile(path.join(ASSETS, "programme.json"), JSON.stringify(programme, null, 2), "utf-8");
  console.log("Done: assets/venues.json & assets/programme.json");
}

main().catch(e => { console.error(e); process.exit(1); });
