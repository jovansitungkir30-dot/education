import { lazy, Suspense, useState } from 'react';
import type { Diorama } from '../../data/dioramas';
import { useProgress } from '../../lib/progress';
import { FactBlock } from '../ui';

const DioramaCanvas = lazy(() => import('../../three/diorama/DioramaCanvas'));

export const spotKey = (sceneId: string, spotId: string) => `${sceneId}:${spotId}`;

/** The full-size model with its cultural hotspots. The 3D code is only downloaded on an area page. */
export default function RegionalLandmark3D({ scene }: { scene: Diorama }) {
  const [active, setActive] = useState<number | null>(null);
  const [spin, setSpin] = useState(true);
  const [reset, setReset] = useState(0);
  const { state, visit } = useProgress();
  const found = new Set(scene.spots.filter((s) => state.visited.warisan.includes(spotKey(scene.id, s.id))).map((s) => s.id));
  const spot = active === null ? null : scene.spots[active];

  const open = (i: number) => {
    setActive(i);
    setSpin(false);
    visit('warisan', spotKey(scene.id, scene.spots[i].id));
  };

  return (
    <div className="grid bg-forest-950 text-ivory lg:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="relative h-[62dvh] min-h-[380px] lg:h-[calc(100dvh-4.5rem)] lg:max-h-[860px]">
        <Suspense fallback={<div className="grid h-full place-items-center" role="status">Memuat model 3D…</div>}>
          <DioramaCanvas diorama={scene} active={active} found={found} spin={spin} reset={reset} onSpot={open} />
        </Suspense>
        <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-2">
          <button type="button" className="chip bg-forest-950/85 text-ivory" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
          <button type="button" className="chip bg-forest-950/85 text-ivory" onClick={() => { setActive(null); setReset((n) => n + 1); }}>Lihat semua</button>
        </div>
        <p className="pointer-events-none absolute top-3 left-3 m-0 max-w-[75%] rounded-full bg-forest-950/70 px-3 py-1.5 text-xs">Geser untuk memutar · gulir atau cubit untuk memperbesar</p>
      </div>

      <div className="paper flex flex-col p-5 sm:p-6 lg:max-h-[min(calc(100dvh-4.5rem),860px)] lg:overflow-y-auto">
        <h3 className="m-0 text-2xl">Titik budaya</h3>
        <p className="mt-1 mb-3 text-sm font-bold" role="status">{found.size} dari {scene.spots.length} sudah ditemukan</p>
        <ol className="m-0 space-y-2 p-0">
          {scene.spots.map((s, i) => (
            <li key={s.id} className={`list-none rounded-xl border-2 ${active === i ? 'border-terracotta-500 bg-cream' : 'border-ink/12'}`}>
              <button type="button" className="flex w-full cursor-pointer items-center gap-3 p-3 text-left" aria-expanded={active === i} onClick={() => open(i)}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${found.has(s.id) ? 'bg-gold-500' : 'bg-forest-900 text-gold-300'}`}>{found.has(s.id) ? '✓' : i + 1}</span>
                <span>
                  <span className="block text-[11px] font-extrabold tracking-wider text-terracotta-700 uppercase">{s.topic}</span>
                  <span className="block font-display text-lg leading-tight">{s.title}</span>
                </span>
              </button>
              {active === i && spot && <div className="px-3 pb-3"><FactBlock item={spot.info} /></div>}
            </li>
          ))}
        </ol>
        <p className="mt-4 mb-0 rounded-lg border border-dashed border-ink/35 p-3 text-xs leading-relaxed">
          <strong>Tentang model ini:</strong> {scene.caveat} Ini representasi artistik yang dibuat lewat kode, bukan replika akurat. Tanaman dan tanah di sekitarnya hanya hiasan.
        </p>
      </div>
    </div>
  );
}
