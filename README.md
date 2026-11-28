# RuangNusantara: North Sumatra Cultural Experience

An interactive, front-end-only learning site about the cultural heritage of North Sumatra.
Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js (React Three Fiber, Drei).
Map boundaries: geoBoundaries IDN ADM2 (BPS, WFP, OCHA ROAP), 2020, CC BY 3.0 IGO, simplified with mapshaper.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check and build into dist/
npm run preview   # serve the production build
```

`dist/` can be hosted on any static host. Routing uses URL hashes, so no server rewrites are needed.

## Pages

| Route | Contents |
| --- | --- |
| `#/` | 3D landscape hero, virtual journey progress, sound desk |
| `#/explore` | 3D/2D atlas of the 25 regencies and 8 cities, 9 procedural 3D artifacts with hotspots |
| `#/cultures` | Scroll storytelling with narration, timeline |
| `#/gallery` | Walk-through gallery with themed rooms |
| `#/learn` | 8 modules with activities, quizzes, badges and a printable certificate |
| `#/about` | Content labels, limitations, references, photo credits |

## Map imagery and elevation

Files in `public/terrain` are derived from:
- Sentinel-2 cloudless 2016 by EOX IT Services GmbH (https://s2maps.eu), contains modified Copernicus Sentinel data
  2016 & 2017, CC BY 4.0. Current EOX pages state CC BY 4.0; a 2017 EOX post said CC BY-SA 4.0, so confirm at
  https://s2maps.eu before commercial or large-scale use. Later EOX editions are non-commercial and are not used.
- AWS Terrain Tiles (Mapzen; SRTM courtesy of USGS). See the Tilezen Joerd attribution document.

## Atlas and dioramas

- `src/data/geo`: boundaries of the 25 regencies, 8 cities and Lake Toba.
- `src/data/atlas.ts`: which cultural content is linked to which area.
- `src/data/dioramas.ts` and `src/three/diorama`: to add a diorama, write a scene component, register it in
  `DioramaCanvas.tsx`, and add its discovery points and quiz under the area id. Scenes are loaded on demand.

## Structure

```
src/data        content: regions, stories, gallery, modules, artifacts, sources
src/three       3D scenes, procedural models, WebGL fallback
src/lib         router, progress (localStorage), synthetic audio
src/components  shared interface parts
src/pages       one file per route
```

## Editing content

Each statement is a `fact(kind, text, ...sourceIds)`. `kind` is `history`, `tradition`, `folklore`,
`interpretation` or `contemporary`. A fact with no source shows "Pending expert review".
Leave a topic out when it has not been researched; the interface lists it as a gap.

## Review needed before publishing

- Source check levels are recorded in `src/data/sources.ts` and shown in the interface. Only those marked
  "read" were opened and used. Even those have not been specialist-reviewed.
- Module lesson text, quiz answers, gallery notes and some hotspot text need a check by a subject specialist
  and, ideally, by members of the communities described.
- Angkola is thinly covered, and there is no Pakpak photo yet.
- 3D models are simplified representations, and audio is synthesised. Neither is a replica or a recording.

Photo authors and licences are listed in `src/data/photos.json` and on the About page.
