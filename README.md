# RuangNusantara: North Sumatra Cultural Experience

An interactive, front-end-only learning site about the cultural heritage of North Sumatra.
Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js (React Three Fiber, Drei) and Leaflet.

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
| `#/explore` | Map with 10 destinations, 8 procedural 3D artifacts with hotspots |
| `#/cultures` | Scroll storytelling with narration, timeline |
| `#/gallery` | Walk-through gallery with themed rooms |
| `#/learn` | 8 modules with activities, quizzes, badges and a printable certificate |
| `#/about` | Content labels, limitations, references, photo credits |

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

- Sources were found by web search and reviewed as summaries and excerpts, not full texts.
- Module lesson text, quiz answers, gallery notes and some hotspot text need a check by a subject specialist
  and, ideally, by members of the communities described.
- Angkola and Pakpak are thinly covered.
- 3D models are simplified representations, and audio is synthesised. Neither is a replica or a recording.
- Map tiles load from OpenStreetMap's public tile server, which has a usage policy. Use a dedicated tile
  provider if the site will get significant traffic.

Photo authors and licences are listed in `src/data/photos.json` and on the About page.
