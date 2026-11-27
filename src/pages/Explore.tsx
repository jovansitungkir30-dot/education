import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AtlasMap from '../components/map/AtlasMap';
import { ADMIN, CONTENT_LINKS, DISTRICTS, HOME_DISTRICT, districtById, fullName, visitedDistricts, type District } from '../data/atlas';
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
    <section id="artifacts" className="scroll-mt-18 py-20">
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
                <ArtifactViewer artifact={artifact} hotspot={hotspot} onHotspot={pick} spin={spin} command={command} showHotspots={dots} />
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
  return (
    <div className="p-5 sm:p-8">
      <p className="eyebrow text-terracotta-700">Pengantar</p>
      <h2 className="mt-1 mb-3 text-3xl sm:text-4xl">Provinsi Sumatera Utara</h2>
      <p>Terdiri atas 25 kabupaten dan 8 kota, dari pesisir timur, dataran tinggi di sekitar Danau Toba, hingga Kepulauan Nias di barat.</p>
      <p>Klik wilayah pada peta, atau pilih dari daftar, untuk mulai menjelajah.</p>
      <h3 className="mt-6 mb-3 text-xl">Mulai dari sini</h3>
      <div className="flex flex-wrap gap-2">
        {['samosir', 'karo', 'mandailing-natal', 'nias-selatan', 'simalungun', 'kota-medan'].map((id) => (
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

  return (
    <>
      <section id="map" className="scroll-mt-18 pt-20 pb-10">
        <div className="mx-auto w-full max-w-[100rem] px-3 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3 py-4">
            <div>
              <p className="eyebrow text-terracotta-400">Atlas budaya interaktif</p>
              <h1 className="mt-1 mb-0 text-3xl sm:text-4xl">Berkeliling Sumatera Utara</h1>
            </div>
            <label className="flex flex-col gap-1 text-xs font-bold">
              Cari wilayah
              <select className="min-h-11 min-w-64 rounded-full border border-gold-500/50 bg-forest-900 px-4 text-sm" value={district?.id ?? ''} onChange={(e) => select(e.target.value || null)}>
                <option value="">Seluruh provinsi</option>
                {(['kabupaten', 'kota', 'air'] as const).map((type) => (
                  <optgroup key={type} label={type === 'kabupaten' ? `Kabupaten (${ADMIN.filter((d) => d.type === type).length})` : type === 'kota' ? `Kota (${ADMIN.filter((d) => d.type === type).length})` : 'Badan air'}>
                    {DISTRICTS.filter((d) => d.type === type).map((d) => (
                      <option key={d.id} value={d.id}>{d.name}{visited.has(d.id) ? ' ✓' : ''}{CONTENT_LINKS[d.id] ? ' •' : ''}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className="font-normal opacity-70">• berisi materi budaya · ✓ sudah dikunjungi</span>
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <div className="h-[62dvh] min-h-[430px] overflow-hidden rounded-3xl border border-gold-500/30 lg:h-[calc(100dvh-12rem)]">
              <AtlasMap selected={district?.id ?? null} visited={visited} onSelect={select} />
            </div>
            <div className="paper overflow-y-auto rounded-3xl lg:h-[calc(100dvh-12rem)] lg:min-h-[430px]" aria-live="polite">
              {district ? <DistrictPanel key={district.id} district={district} /> : <ProvinceIntro />}
            </div>
          </div>
        </div>
      </section>
      <div className="weave" aria-hidden="true" />
      <Artifacts requested={artifactParam} />
    </>
  );
}
