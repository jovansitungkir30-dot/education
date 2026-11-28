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
| `#/explore` | Full-screen 3D/2D atlas with one landmark miniature per area, search, thematic pathways |
| `#/wilayah` | Searchable index of all areas: the route that needs neither map nor 3D, with learning progress |
| `#/wilayah?id=...` | Learning page of one area: overview, 3D landmark with hotspots, researched topics, local terms, photos, quiz, references |
| `#/artefak` | 9 procedural 3D artifacts with hotspots |
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

## Areas and landmarks

| File | What to edit there |
| --- | --- |
| `src/data/landmarks.ts` | One entry per area: landmark, category, why it was chosen, strength of evidence, facts, hotspots, quiz |
| `src/data/landmark-sources.ts` | References used by those entries |
| `src/data/landmark-photos.json` | Per area, a list of photos: file, caption, relation, place, verification, author, licence, source page |
| `src/data/audio.json` | Pronunciation recordings per language, with speaker and licence |
| `src/data/media.ts` | Photo relation labels and which languages appear on which area page |
| `src/data/glossary.ts` | Local terms per area, each with references |
| `src/data/pathways.ts` | Geographic zones and thematic pathways |
| `src/three/diorama/LandmarkScene.tsx` | Which geographic setting surrounds each area's model |
| `src/data/atlas.ts` | Which community content is linked to which area |
| `src/data/geo` | Boundaries of the 25 regencies, 8 cities and Lake Toba |
| `src/three/mini` | One procedural model per area, merged into a single mesh and used on the map and on the area page |
| `src/lib/placement.ts` | Moves neighbouring miniatures apart; leader lines point back to the true position |

Samosir, Karo, Mandailing Natal and Nias Selatan use hand-built dioramas instead (`src/data/dioramas.ts`,
`src/three/diorama`). To add one, write a scene component, register it in `DioramaCanvas.tsx`, and add its
discovery points and quiz under the area id.

Photo `relation` must say what the picture really shows: `objek`, `wilayah`, `arsip`, `ilustrasi` or `komunitas`.

A topic with no researched material is not shown as a section; the overview lists it as a gap. Do not fill it with material from a neighbouring area.

## Hosting

`npm run build` writes a static site to `dist/`. Asset paths are relative, so it works from a domain root or a
sub-folder. There is no deployment pipeline in this repository.

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
- Angkola is thinly covered. Many references have still only been seen as search summaries. Several university PDFs
  could not be text-extracted, so what rests on them stays marked that way.
- No openly licensed recording of traditional music or dance was found. The recordings are single spoken words, and
  no translations are given.
- Entries marked `evidence: 'terbatas'` in `landmarks.ts` have a weaker basis for the choice and should be reviewed first.
- Traditions, music and food are not yet researched for many areas. Some areas have no verified, openly licensed photo.
- 3D models are simplified representations, and audio is synthesised. Neither is a replica or a recording.

Photo authors and licences are listed in `src/data/photos.json`, `src/data/landmark-photos.json` and on the About page.
