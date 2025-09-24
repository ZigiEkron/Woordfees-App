# Woordfees App — Venue Update

This patch adds the venue line and a Directions button to **every event** in both the list and detail screens.

## Files included
- `app/components/EventCard.tsx` — List card that shows Venue + buttons
- `app/components/VenueLine.tsx` — Reusable venue block for detail screen
- `app/lib/venues.ts` — Helper to load `venues.slim.json` and build a map link
- `app/(tabs)/index.tsx` — Example list screen using `programme.slim.json` and hydrating venues by slug
- `app/event/[id].tsx` — Detail screen that shows Venue + Directions + Tickets

## Data files expected in your bundle
- `app/assets/data/programme.slim.json`
- `app/assets/data/venues.slim.json`

If you use different paths or filenames, just update the `require()` calls accordingly.

## Install notes
No native dependencies added; works in Expo Go. If you use expo-router, ensure your folder layout matches.
