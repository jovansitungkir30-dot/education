import { lazy, Suspense, useState } from 'react';
import type { Diorama } from '../../data/dioramas';
import { GLOSSARY } from '../../data/glossary';
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

  const open = (i: number) => {
    setActive(i);
    setSpin(false);
    visit('warisan', spotKey(scene.id, scene.spots[i].id));
  };

  const spot = active === null ? null : scene.spots[active];
  // Local terms mentioned by the opened hotspot are explained right beside it.
  const text = spot ? `${spot.title} ${spot.info.text}`.toLocaleLowerCase('id') : '';
  const terms = spot ? (GLOSSARY[scene.id] ?? []).filter((t) => text.includes(t.term.split(' (')[0].toLocaleLowerCase('id'))) : [];
  const next = active === null ? 0 : (active + 1) % scene.spots.length;

  return (
    <div className="grid bg-forest-950 text-ivory xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="relative h-[58dvh] min-h-[360px] xl:h-[min(74dvh,720px)]">
        <Suspense fallback={<div className="grid h-full place-items-center" role="status">Memuat model 3D…</div>}>
          <DioramaCanvas diorama={scene} active={active} found={found} spin={spin} reset={reset} onSpot={open} />
        </Suspense>
        <div className="absolute right-3 bottom-3 flex flex-wrap justify-end gap-2">
          <button type="button" className="chip bg-forest-950/85 text-ivory" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
          <button type="button" className="chip bg-forest-950/85 text-ivory" onClick={() => { setActive(null); setReset((n) => n + 1); }}>Lihat semua</button>
        </div>
        <p className="pointer-events-none absolute top-3 left-3 m-0 max-w-[75%] rounded-md bg-forest-950/75 px-3 py-1.5 text-xs">Geser untuk memutar · gulir atau cubit untuk memperbesar</p>
      </div>

      <div className="paper flex flex-col border-ink/15 p-5 max-xl:border-t xl:max-h-[min(74dvh,720px)] xl:overflow-y-auto xl:border-l">
        <h3 className="m-0 text-2xl">Titik budaya</h3>
        <p className="mt-1 mb-3 text-sm font-bold" role="status">{found.size} dari {scene.spots.length} sudah ditemukan</p>
        <ol className="m-0 p-0">
          {scene.spots.map((s, i) => (
            <li key={s.id} className={`list-none border-t border-ink/15 ${active === i ? 'bg-cream' : ''}`}>
              <button type="button" className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-2 py-2.5 text-left" aria-expanded={active === i} onClick={() => open(i)}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${found.has(s.id) ? 'bg-gold-500' : 'bg-forest-900 text-gold-300'}`}>{found.has(s.id) ? '✓' : i + 1}</span>
                <span>
                  <span className="block text-[11px] font-extrabold tracking-wider text-terracotta-700 uppercase">{s.topic}</span>
                  <span className="block font-display text-lg leading-tight">{s.title}</span>
                </span>
              </button>
              {active === i && (
                <div className="px-2 pb-3">
                  <FactBlock item={s.info} />
                  {terms.length > 0 && (
                    <dl className="m-0 mt-3 border-l-2 border-gold-700 pl-3 text-sm">
                      {terms.map((t) => <div key={t.term}><dt className="font-extrabold">{t.term}</dt><dd className="m-0 mb-1">{t.meaning}</dd></div>)}
                    </dl>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-terra mt-3" onClick={() => open(next)}>{active === null ? 'Mulai dari titik pertama' : 'Titik berikutnya →'}</button>
        <p className="mt-4 mb-0 border border-dashed border-ink/35 p-3 text-xs leading-relaxed">
          <strong>Tentang model ini:</strong> {scene.caveat} Ini representasi artistik yang dibuat lewat kode, bukan replika akurat. Tanaman, tanah, dan latar di sekitarnya hanya hiasan.
        </p>
      </div>
    </div>
  );
}
