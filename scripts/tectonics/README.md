# כדור הארץ בתנועה: the plate tectonics atlas

An interactive Hebrew (RTL) atlas of plate tectonics for middle school, used on the class
projector and by students at home. It lives at `/earth-sciences/tectonics`.

**This project is the only home of the atlas.** It used to live in
`Map Projects/Tectonics_Web` and was moved here on 2026-11-20. Edit it here only.

## Files
| File | What it is |
|------|------------|
| `public/tectonics/index.html` | The atlas page: 3D globe (globe.gl 2.32.0 from jsDelivr) + side panel with 4 tabs. Layout, styles and behaviour. |
| `public/tectonics/content.js` | **All Hebrew text**: boundary types, plate names, tours + video links, quiz, Israel chapter. Edit here to change wording. |
| `public/tectonics/data/*.js`, `data/earth.jpg` | Prepared data the page loads. Generated, don't edit by hand. |
| `scripts/tectonics/build_data.py` | Turns `scripts/tectonics/raw/` into `public/tectonics/data/*.js`. Run from the project root: `python3 scripts/tectonics/build_data.py` |
| `scripts/tectonics/raw/` | Original downloads (not served). |
| `app/earth-sciences/tectonics/page.tsx` | The site page: ActivityBar + full-height iframe of `/tectonics/index.html` (fullscreen allowed for projector mode). |

Visibility: content-registry item `earth.tectonics` (hidden from students until enabled in /admin).
The hub card is in the "משאבים ועזרים" section of `app/earth-sciences/page.tsx`.

Preview: run the site's dev server and open `/earth-sciences/tectonics`
(or `/tectonics/index.html` for the atlas alone).

## The 4 tabs
1. **לחקור**: legend-style layer toggles: boundaries (3 types), motion dashes, plate names,
   M7+ earthquakes, volcanoes. Click a boundary/plate/quake/volcano for an info card with an animated diagram.
2. **סיורים**: 4 tours, 14 stops, teacher-paced (Next/Back, presentation clicker, arrow keys).
   Each stop has a "did you know" fact and a short YouTube clip that plays **inside the atlas**
   (overlay player, `youtube-nocookie.com`, with a "ביוטיוב ↗" fallback link).
   - Video fields in `content.js`: `{ id, start, end, title, channel, note }`. `start`/`end` are seconds, so
     only the WOW moment plays. `note` is an optional Hebrew line, e.g. where the footage was filmed.
   - While a clip is open, Esc and the clicker's next/back keys close it (they don't move the tour).
   - Clips must be **WOW moments**: real footage first (drone, diving, eruptions), animation only where nothing
     can be filmed, no narration needed. The teacher approves every video and segment.
   - The site page's iframe needs `allow="fullscreen; autoplay; encrypted-media; picture-in-picture"` for this.
3. **אתגר**: Round 1: 8 mystery spots, guess the boundary type (keys 1/2/3). Round 2: only quakes + volcanoes,
   then "reveal" the boundaries (shows the computed 86% of M7+ quakes within 250 km of a boundary).
4. **ישראל**: 6 places along the Dead Sea fault, 5 historic earthquakes, "in your lifetime" calculator (0.5 cm/yr, GPS).

**PROJECTOR** button (top of panel): bigger text, thicker lines, full screen.

## Data sources
- Boundaries + plates: Bird (2002) PB2002 via github.com/fraxen/tectonicplates (`PB2002_boundaries.json`, `PB2002_plates.json`)
- **Boundary type + relative speed**: `original/PB2002_steps.csv` from the same repo. Step classes mapped as
  OSR/CRB → pulling apart, SUB/OCB/CCB → colliding, OTF/CTF → sliding
- Earthquakes: USGS catalog, M7+ since 1900 (snapshot)
- Volcanoes: Smithsonian GVP Holocene volcanoes (snapshot)
- Earth image: NASA Blue Marble (via three-globe example image), saved as `public/tectonics/data/earth.jpg`

## Design and content rules
- "High-end human designer" look, "survey atlas" style: Karantina (headings), IBM Plex Sans Hebrew (text),
  IBM Plex Mono (numbers). No emoji, no generic AI styling.
- Deliberately dark so it works on a projector. It has its own color tokens in `index.html`;
  the site's light/dark toggle and design tokens don't apply inside the atlas.
- Middle school Hebrew: simple and correct.
- Every YouTube video is approved by the teacher before it goes in.

## Gotchas
- **Why old maps' colors were off:** `PB2002_boundaries.json` only marks "subduction". The step file is needed for real types.
- **Plates covering a pole** (Antarctica, North America) have outlines that wrap the globe; `build_data.py` closes them through the pole.
- **RTL:** the globe container must be `dir="ltr"`, otherwise floating labels drift right under the panel.
- **Dead Sea fault colors:** PB2002 marks a few stretches (e.g. north of the Kinneret) as "colliding" (slight squeeze), explained in the Israel chapter.
  The model's speed there (~1 cm/yr) differs from GPS (~0.5 cm/yr); the calculator uses GPS.
- Video candidates are checked (exists, embeddable) through YouTube's oEmbed endpoint, but not watched:
  the teacher picks the clip and segment.
- An older copy was published as a claude.ai artifact (https://claude.ai/artifact/UhC2cmPrqb6xZK6iYKExhe). It does not update from this project.
