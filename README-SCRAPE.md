# Woordfees programme + venues (ready now) and live-site scraper

This package contains:
- `assets/programme.json` and `assets/venues.json` — ready to drop into your Expo app today
- `tools/scrape-woordfees.mjs` — to refresh from woordfees.co.za anytime

## Refresh from the live site
```bash
npm i cheerio p-queue undici
node tools/scrape-woordfees.mjs
```
This overwrites `assets/*.json` with the latest from the website.
