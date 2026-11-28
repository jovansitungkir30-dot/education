import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AtlasMap from '../components/map/AtlasMap';
import { ExplorerCard, SoundAndHelp, TopLeft, TrailCard } from '../components/exploration/MapHud';
import { completedDioramas } from '../lib/badges';
import DioramaView from '../components/exploration/DioramaView';
import { DIORAMAS, SPOT_COUNT } from '../data/dioramas';
import { CONTENT_LINKS, HOME_DISTRICT, districtById, fullName, visitedDistricts, type District } from '../data/atlas';
import { Credit, FactBlock, Photo, ReviewNote, SectionHead } from '../components/ui';
import { TOPICS, regionById, type Region, type TopicKey } from '../data/regions';
import { ARTIFACTS } from '../data/artifacts';
import { MODULES } from '../data/modules';
import { go, href } from '../lib/router';
import { useProgress } from '../lib/progress';
import type { ViewCommand } from '../three/ArtifactViewer';

const ArtifactViewer = lazy(() => import('../three/ArtifactViewer'));

function RegionPanel({ region }: { region: Region }) {
  const [topic, setTopic] = useState<TopicKey>('identity');
  const keys = Object.keys(TOPICS) as TopicKey[];
  const available = keys.filter((k) => region.topics[k]?.length);
  const gaps = keys.filter((k) => !region.topics[k]?.length);
  const active = available.includes(topic) ? topic : available[0];
  const artifacts = ARTIFACTS.filter((a) => a.regionId === region.id);

  return (
    <article className="p-5 sm:p-8" aria-live="polite">
      <p className="eyebrow text-terracotta-700">{region.category}</p>
      <h2 className="mt-2 mb-1 text-4xl sm:text-5xl">{region.name}</h2>
      <p className="text-xs opacity-65">
        Titik acuan: {region.anchor} ({region.coords[0].toFixed(2)}° LU, {region.coords[1].toFixed(2)}° BT). Hanya titik acuan, bukan batas wilayah.
      </p>
      <p className="mt-4 text-lg leading-relaxed">{region.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Topik">
        {available.map((k) => (
          <button key={k} type="button" className="chip" aria-pressed={active === k} onClick={() => setTopic(k)}>
            {TOPICS[k]}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-6">
        {region.topics[active]?.map((f) => <FactBlock key={f.text} item={f} />)}
      </div>
      {gaps.length > 0 && (
        <p className="mt-6 rounded-xl border border-dashed border-ink/35 p-4 text-sm">
          <strong>Belum diriset di sini:</strong> {gaps.map((g) => TOPICS[g].toLowerCase()).join(', ')}. Bagian ini dibiarkan kosong, tidak diisi dengan tebakan atau dipinjam dari komunitas tetangga.
        </p>
      )}

      <h3 className="mt-9 mb-3 text-2xl">Galeri foto</h3>
      {region.photos.length ? (
        <div className="grid grid-cols-2 gap-3">
          {region.photos.map((id) => (
            <figure key={id} className="m-0">
              <Photo id={id} className="aspect-[4/3] w-full rounded-xl" />
              <figcaption className="mt-1"><Credit id={id} /></figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <p className="text-sm opacity-75">Belum ada foto berlisensi sesuai dan terverifikasi yang dipilih untuk {region.name}.</p>
      )}

      <h3 className="mt-9 mb-3 text-2xl">Lanjut belajar</h3>
      <div className="flex flex-wrap gap-2">
        {region.modules.map((id) => {
          const m = MODULES.find((x) => x.id === id)!;
          return <a key={id} className="btn btn-terra" href={href('/learn', { module: id })}>{m.title}</a>;
        })}
        {artifacts.map((a) => (
          <a key={a.id} className="btn btn-line" href={href('/explore', { region: region.id, artifact: a.id })}>3D: {a.name}</a>
        ))}
      </div>
    </article>
  );
}

function Artifacts({ requested }: { requested: string | null }) {
  const [id, setId] = useState(() => ARTIFACTS.find((a) => a.id === requested)?.id ?? ARTIFACTS[0].id);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const [spin, setSpin] = useState(true);
  const [dots, setDots] = useState(true);
  const [command, setCommand] = useState<ViewCommand>(null);
  const [engaged, setEngaged] = useState(false);
  const { visit, state } = useProgress();
  const artifact = ARTIFACTS.find((a) => a.id === id)!;
  const section = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300px' });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const found = ARTIFACTS.find((a) => a.id === requested);
    if (found) {
      setId(found.id);
      setHotspot(null);
      setCommand(null);
      setEngaged(true);
    }
  }, [requested]);

  // Only count an artifact once the visitor has interacted with this section.
  useEffect(() => {
    if (engaged) visit('artifact', id);
  }, [engaged, id, visit]);

  const send = (type: NonNullable<ViewCommand>['type']) => {
    setEngaged(true);
    setSpin(false);
    setCommand((c) => ({ type, n: (c?.n ?? 0) + 1 }));
  };
  const pick = (i: number) => {
    setEngaged(true);
    setSpin(false);
    setHotspot(i);
  };

  return (
    <section ref={section} id="artifacts" className="scroll-mt-18 py-20">
      <div className="wrap">
        <SectionHead eyebrow="Jelajahi artefak budaya" title="Putar dan amati dari dekat">
          Ini model prosedural untuk belajar. Bentuk dan proporsinya disederhanakan dan bukan replika sejarah yang akurat.
        </SectionHead>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-3" role="group" aria-label="Pilih artefak">
          {ARTIFACTS.map((a) => (
            <button key={a.id} type="button" className="chip" aria-pressed={a.id === id} onClick={() => { setId(a.id); setHotspot(null); setCommand(null); setSpin(true); setEngaged(true); }}>
              {state.visited.artifact.includes(a.id) && <span aria-label="Sudah dijelajahi">✓ </span>}
              {a.name}
            </button>
          ))}
        </div>

        <div className="mt-4 grid items-start rounded-3xl border border-gold-500/25 bg-ivory lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col overflow-hidden rounded-t-3xl bg-forest-900 lg:sticky lg:top-22 lg:h-[calc(100dvh-7rem)] lg:rounded-3xl">
            <div className="relative h-[55dvh] min-h-[360px] lg:h-auto lg:flex-1" onPointerDown={() => setEngaged(true)}>
              <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan model 3D…</div>}>
                {near && <ArtifactViewer artifact={artifact} hotspot={hotspot} onHotspot={pick} spin={spin} command={command} showHotspots={dots} />}
              </Suspense>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-ivory/10 p-3">
              <button type="button" className="chip" aria-label="Putar ke kiri" onClick={() => send('left')}>⟲</button>
              <button type="button" className="chip" aria-label="Putar ke kanan" onClick={() => send('right')}>⟳</button>
              <button type="button" className="chip" aria-label="Perbesar" onClick={() => send('in')}>＋</button>
              <button type="button" className="chip" aria-label="Perkecil" onClick={() => send('out')}>－</button>
              <button type="button" className="chip" onClick={() => send('reset')}>Atur ulang</button>
              <button type="button" className="chip" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
              <button type="button" className="chip" aria-pressed={dots} onClick={() => setDots(!dots)}>Titik info</button>
            </div>
          </div>

          <div className="p-6 text-ink sm:p-8">
            <p className="eyebrow text-terracotta-700">{artifact.origin}</p>
            <h3 className="mt-2 mb-3 text-3xl">{artifact.name}</h3>
            <p className="leading-relaxed">{artifact.description}</p>

            <h4 className="mt-6 mb-2 text-xl">Titik info</h4>
            <ReviewNote className="mb-3" />
            <ol className="m-0 space-y-2 p-0">
              {artifact.hotspots.map((h, i) => (
                <li key={h.label} className="list-none">
                  <button type="button" className={`w-full cursor-pointer rounded-xl border p-3 text-left ${hotspot === i ? 'border-terracotta-500 bg-cream' : 'border-ink/15'}`} aria-expanded={hotspot === i} onClick={() => pick(i)}>
                    <span className="font-bold">{i + 1}. {h.label}</span>
                    <AnimatePresence initial={false}>
                      {hotspot === i && (
                        <motion.span className="block overflow-hidden text-sm leading-relaxed" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <span className="block pt-2">{h.text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ol>

            <h4 className="mt-6 mb-2 text-xl">Konteks sejarah</h4>
            <FactBlock item={artifact.history} />
            <h4 className="mt-6 mb-2 text-xl">Makna budaya</h4>
            <FactBlock item={artifact.significance} />
            <h4 className="mt-6 mb-2 text-xl">Bahan dan pengerjaan</h4>
            {artifact.materials ? <FactBlock item={artifact.materials} /> : <p className="text-sm opacity-75">Belum ada keterangan terverifikasi tentang bahan objek ini, sehingga tidak ada klaim yang dibuat.</p>}
            <a className="btn btn-terra mt-6" href={href('/explore', { region: artifact.regionId })} onClick={() => document.getElementById('map')?.scrollIntoView()}>
              Lihat {regionById(artifact.regionId)?.name} di peta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const PANEL_WIDTH = 500;

/** Panel for one administrative area. Cultural content is shown only where it has been researched. */
function DistrictPanel({ district }: { district: District }) {
  const links = CONTENT_LINKS[district.id] ?? [];
  const [chosen, setChosen] = useState(links[0] ?? null);
  const content = regionById(chosen);

  return (
    <div>
      <div className="border-b border-ink/15 p-5 sm:px-8">
        <p className="eyebrow text-terracotta-700">{district.type === 'air' ? 'Badan air' : district.type}</p>
        <h2 className="mt-1 mb-2 text-3xl sm:text-4xl">{fullName(district)}</h2>
        <p className="m-0 text-sm opacity-75">Wilayah administrasi bukan batas budaya. Satu wilayah dihuni beragam komunitas, dan satu komunitas bisa tersebar di banyak wilayah.</p>
        {links.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Konten terkait">
            {links.map((id) => (
              <button key={id} type="button" className="chip" aria-pressed={chosen === id} onClick={() => setChosen(id)}>{regionById(id)!.name}</button>
            ))}
          </div>
        )}
      </div>
      {DIORAMAS[district.id] && (
        <a className="group block border-b border-ink/15 bg-forest-900 p-5 text-ivory sm:px-8" href={href('/explore', { wilayah: district.id, diorama: '1' })}>
          <span className="eyebrow text-gold-300">Diorama 3D tersedia</span>
          <span className="mt-1 block font-display text-2xl">{DIORAMAS[district.id].title}</span>
          <span className="mt-1 block text-sm opacity-80">{DIORAMAS[district.id].summary} {DIORAMAS[district.id].spots.length} titik temuan dan mini kuis.</span>
          <span className="btn btn-gold mt-3 group-hover:bg-gold-300">Masuk ke diorama →</span>
        </a>
      )}
      {content ? (
        <RegionPanel key={content.id} region={content} />
      ) : (
        <div className="p-5 sm:p-8">
          <h3 className="mt-0 text-2xl">Konten budaya belum diriset</h3>
          <p>Batas {fullName(district)} sudah ada di peta, tetapi kami belum punya materi budaya dengan sumber yang cukup untuk wilayah ini. Bagian ini sengaja tidak diisi tebakan.</p>
          <a className="btn btn-terra" href={href('/explore', { wilayah: 'karo' })}>Jelajahi wilayah yang sudah berisi</a>
        </div>
      )}
    </div>
  );
}

function ProvinceIntro() {
  const { state } = useProgress();
  return (
    <div className="p-5 sm:p-8">
      <p className="eyebrow text-terracotta-700">Catatan temuan</p>
      <h2 className="mt-1 mb-3 text-3xl sm:text-4xl">Provinsi Sumatera Utara</h2>
      <p>Terdiri atas 25 kabupaten dan 8 kota, dari pesisir timur, dataran tinggi di sekitar Danau Toba, hingga Kepulauan Nias di barat.</p>
      <p>Klik wilayah pada peta, atau pilih dari daftar, untuk mulai menjelajah.</p>
      <h3 className="mt-6 mb-1 text-xl">Catatan temuan</h3>
      <p className="mt-0 text-sm font-bold">Anda sudah membuka {state.visited.warisan.length} dari {SPOT_COUNT} temuan warisan budaya.</p>
      <ul className="m-0 grid gap-2 p-0">
        {Object.values(DIORAMAS).map((d) => {
          const n = state.visited.warisan.filter((k) => k.startsWith(d.id + ':')).length;
          const done = n === d.spots.length;
          return (
            <li key={d.id} className="list-none">
              <a className={`flex items-center justify-between gap-3 rounded-2xl border-2 p-3 ${done ? 'border-gold-700 bg-cream' : 'border-ink/15 hover:border-terracotta-500'}`} href={href('/explore', { wilayah: d.id, diorama: '1' })}>
                <span>
                  <span className="block font-display text-xl leading-tight">{d.title}</span>
                  <span className="text-xs">{districtById(d.id)!.name} · diorama 3D</span>
                </span>
                <span className="text-sm font-extrabold whitespace-nowrap">{done ? '✓ lengkap' : `${n}/${d.spots.length}`}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <h3 className="mt-6 mb-3 text-xl">Wilayah lain</h3>
      <div className="flex flex-wrap gap-2">
        {['simalungun', 'toba', 'pakpak-bharat', 'kota-medan'].map((id) => (
          <a key={id} className="btn btn-line" href={href('/explore', { wilayah: id })}>{districtById(id)!.name}</a>
        ))}
      </div>
    </div>
  );
}

export default function Explore({ params }: { params: URLSearchParams }) {
  // ?wilayah= names an administrative area. ?region= (older links) names a community or place.
  const wilayah = params.get('wilayah') ?? HOME_DISTRICT[params.get('region') ?? ''] ?? null;
  const district = districtById(wilayah) ?? null;
  const artifactParam = params.get('artifact');
  const { visit, state } = useProgress();
  const visited = new Set(visitedDistricts(state).map((d) => d.id));

  useEffect(() => {
    if (district && district.type !== 'air' && !artifactParam) visit('region', district.id);
  }, [district, artifactParam, visit]);

  const wantsArtifacts = !!artifactParam || params.get('view') === 'artifacts';
  useEffect(() => {
    if (!wantsArtifacts) return;
    const t = window.setTimeout(() => document.getElementById('artifacts')?.scrollIntoView(), 150);
    return () => window.clearTimeout(t);
  }, [wantsArtifacts, artifactParam]);

  const select = (id: string | null) => go('/explore', id ? { wilayah: id } : undefined);

  const inDiorama = !!district && !!DIORAMAS[district.id] && params.get('diorama') === '1';
  const [log, setLog] = useState(false);
  const open = !!district || log;

  return (
    <>
      {inDiorama && <DioramaView key={district.id} id={district.id} />}
      <section id="map" className="relative h-dvh min-h-[600px] overflow-hidden">
        <h1 className="sr-only">Peta jelajah budaya Sumatera Utara</h1>
        {/* Only one heavy 3D view at a time: the map unmounts while a diorama is open. */}
        {!inDiorama && <AtlasMap selected={district?.id ?? null} visited={visited} completed={completedDioramas(state)} panel={open ? PANEL_WIDTH : 0} onSelect={select} />}
        {!open && (
          <p className="hud pointer-events-none absolute top-3 left-1/2 z-10 m-0 -translate-x-1/2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap max-xl:top-auto max-xl:bottom-24 max-md:hidden">
            Geser peta untuk menjelajahi Sumatera Utara
          </p>
        )}
        <TopLeft selected={district?.id ?? null} onSelect={select} />
        <ExplorerCard onLog={() => { if (district) select(null); setLog(!log || !!district); }} />
        {!open && <TrailCard selected={null} onSelect={select} />}
        {!open && <SoundAndHelp />}

        {open && (
          <aside className="paper absolute z-30 flex flex-col overflow-hidden rounded-3xl shadow-[0_24px_60px_#000a] max-lg:inset-x-2 max-lg:bottom-2 max-lg:max-h-[56%] lg:top-20 lg:right-16 lg:bottom-8 lg:w-[27rem]" aria-label={district ? 'Panel wilayah' : 'Catatan temuan'} aria-live="polite">
            <button type="button" className="map-btn absolute top-3 right-3 z-10" aria-label="Tutup panel" onClick={() => { setLog(false); if (district) select(null); }}>✕</button>
            <div className="overflow-y-auto">
              {district ? <DistrictPanel key={district.id} district={district} /> : <ProvinceIntro />}
            </div>
          </aside>
        )}
      </section>
      <div className="weave" aria-hidden="true" />
      {!inDiorama && <Artifacts requested={artifactParam} />}
    </>
  );
}
