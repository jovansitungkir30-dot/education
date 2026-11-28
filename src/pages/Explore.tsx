/** The atlas: a full-screen map, which is the main way into the 33 areas. */
import { useEffect, useState } from 'react';
import AtlasMap from '../components/map/AtlasMap';
import { ExplorerCard, Help, TopLeft, TrailCard } from '../components/exploration/MapHud';
import ExplorationProgress from '../components/region/ExplorationProgress';
import { Credit, FactBlock, Photo } from '../components/ui';
import { HOME_DISTRICT, districtById, fullName, visitedDistricts } from '../data/atlas';
import { DIORAMAS } from '../data/dioramas';
import { themeById } from '../data/pathways';
import { TOPICS, regionById, type TopicKey } from '../data/regions';
import { completedAreas } from '../data/scenes';
import { useProgress } from '../lib/progress';
import { go, href } from '../lib/router';
import { prefersReducedMotion } from '../three/device';

/** The lake is a water body rather than an area, so it has a side panel instead of its own page. */
function LakePanel() {
  const region = regionById('lake-toba')!;
  const keys = (Object.keys(TOPICS) as TopicKey[]).filter((k) => region.topics[k]?.length);
  const [topic, setTopic] = useState<TopicKey>(keys[0]);
  return (
    <article className="p-5 sm:p-8">
      <p className="eyebrow text-terracotta-700">{region.category}</p>
      <h2 className="mt-2 mb-1 text-4xl">{region.name}</h2>
      <p className="mt-3 text-lg leading-relaxed">{region.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Topik">
        {keys.map((k) => <button key={k} type="button" className="chip" aria-pressed={topic === k} onClick={() => setTopic(k)}>{TOPICS[k]}</button>)}
      </div>
      <div className="mt-6 space-y-6">{region.topics[topic]?.map((f) => <FactBlock key={f.text} item={f} />)}</div>
      <div className="mt-7 grid grid-cols-2 gap-3">
        {region.photos.map((id) => (
          <figure key={id} className="m-0">
            <Photo id={id} className="aspect-[4/3] w-full rounded-md" />
            <figcaption className="mt-1"><Credit id={id} /></figcaption>
          </figure>
        ))}
      </div>
      <a className="btn btn-terra mt-6" href={href('/wilayah', { id: 'samosir' })}>Jelajahi Samosir →</a>
    </article>
  );
}

function DiscoveryLog() {
  const { state } = useProgress();
  return (
    <div className="p-5 sm:p-8">
      <p className="eyebrow text-terracotta-700">Catatan temuan</p>
      <h2 className="mt-1 mb-3 text-3xl">Provinsi Sumatera Utara</h2>
      <p>Terdiri atas 25 kabupaten dan 8 kota, dari pesisir timur, dataran tinggi di sekitar Danau Toba, hingga Kepulauan Nias di barat.</p>
      <ExplorationProgress />
      <h3 className="mt-6 mb-2 text-xl">Empat diorama rinci</h3>
      <ul className="m-0 p-0">
        {Object.values(DIORAMAS).map((d) => {
          const n = state.visited.warisan.filter((k) => k.startsWith(d.id + ':')).length;
          return (
            <li key={d.id} className="list-none border-t border-ink/15">
              <a className="flex min-h-14 items-center justify-between gap-3 py-2 hover:text-terracotta-700" href={href('/wilayah', { id: d.id })}>
                <span><span className="block font-display text-xl leading-tight">{d.title}</span><span className="text-xs">{districtById(d.id)!.name}</span></span>
                <span className="text-sm font-extrabold whitespace-nowrap">{n === d.spots.length ? '✓ lengkap' : `${n}/${d.spots.length}`}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <a className="btn btn-terra mt-6" href={href('/wilayah')}>Daftar semua wilayah →</a>
    </div>
  );
}

const PANEL_WIDTH = 500;

export default function Explore({ params }: { params: URLSearchParams }) {
  // ?wilayah= names an administrative area. ?region= (older links) names a community or place.
  const wilayah = params.get('wilayah') ?? HOME_DISTRICT[params.get('region') ?? ''] ?? null;
  const artifact = params.get('artifact');
  const linked = artifact ? undefined : districtById(wilayah);
  const lake = linked?.type === 'air';
  const theme = themeById(params.get('tema'));
  const { state } = useProgress();
  const visited = new Set(visitedDistricts(state).map((d) => d.id));
  const [flying, setFlying] = useState<string | null>(null);
  const [log, setLog] = useState(false);

  // Older links keep working: areas lead to their page and artifacts to theirs.
  const redirect = artifact || params.get('view') === 'artifacts'
    ? href('/artefak', artifact ? { id: artifact } : undefined)
    : linked && !lake ? href('/wilayah', { id: linked.id }) : null;
  useEffect(() => {
    if (redirect) window.location.replace(redirect);
  }, [redirect]);

  // Choosing an area flies the camera to its landmark before the page changes.
  useEffect(() => {
    if (!flying) return;
    const t = window.setTimeout(() => go('/wilayah', { id: flying }), prefersReducedMotion() ? 0 : 1300);
    return () => window.clearTimeout(t);
  }, [flying]);

  const select = (id: string | null) => {
    if (id && districtById(id)!.type !== 'air') {
      setLog(false);
      setFlying(id);
    } else {
      setFlying(null);
      go('/explore', id ? { wilayah: id } : theme ? { tema: theme.id } : undefined);
    }
  };
  const open = !flying && (lake || log);
  const target = districtById(flying);

  if (redirect) return <div className="grid min-h-dvh place-items-center" role="status">Membuka halaman…</div>;

  return (
    <section id="map" className="relative h-dvh min-h-[560px] overflow-hidden">
      <h1 className="sr-only">Peta jelajah budaya Sumatera Utara</h1>
      <a className="btn btn-gold absolute top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-24 focus:translate-y-0" href={href('/wilayah')}>Lewati peta: buka daftar wilayah</a>
      <AtlasMap
        selected={flying ?? (lake ? 'danau-toba' : null)}
        visited={visited}
        completed={completedAreas(state.visited.warisan)}
        highlight={theme ? theme.areas : null}
        panel={open ? PANEL_WIDTH : 0}
        onSelect={select}
      />
      {target && (
        <div className="pointer-events-none absolute inset-0 z-40 grid animate-[fade-in_0.9s_0.4s_both] items-end bg-gradient-to-t from-forest-950/90 to-transparent p-8 text-center text-ivory">
          <p className="m-0 font-display text-3xl" role="status">Membuka {fullName(target)}…</p>
        </div>
      )}
      <TopLeft selected={flying} theme={theme?.id ?? null} onSelect={select} onTheme={(id) => go('/explore', id ? { tema: id } : undefined)} />
      <ExplorerCard onLog={() => { if (lake) select(null); setLog(!log || lake); }} />
      {!open && <TrailCard selected={null} onSelect={select} />}
      {!open && <Help />}

      {open && (
        <aside className="paper absolute z-30 flex flex-col overflow-hidden rounded-xl shadow-[0_24px_60px_#000a] max-lg:inset-x-2 max-lg:bottom-2 max-lg:max-h-[56%] lg:top-20 lg:right-16 lg:bottom-8 lg:w-[27rem]" aria-label={lake ? 'Panel Danau Toba' : 'Catatan temuan'}>
          <button type="button" className="map-btn absolute top-3 right-3 z-10" aria-label="Tutup panel" onClick={() => { setLog(false); if (lake) select(null); }}>✕</button>
          <div className="overflow-y-auto">{lake ? <LakePanel /> : <DiscoveryLog />}</div>
        </aside>
      )}
    </section>
  );
}
