import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MOODS, type Mood } from '../../three/diorama/moods';
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
  const [tour, setTour] = useState(false);
  const [mood, setMood] = useState<Mood>('pagi');
  const [full, setFull] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const { state, visit } = useProgress();
  const found = new Set(scene.spots.filter((s) => state.visited.warisan.includes(spotKey(scene.id, s.id))).map((s) => s.id));

  const open = (i: number) => {
    setActive(i);
    setSpin(false);
    visit('warisan', spotKey(scene.id, scene.spots[i].id));
  };

  const spot = active === null ? null : scene.spots[active];

  // The guided tour visits each part in turn, with time to read, and stops after the last one.
  useEffect(() => {
    if (!tour || active === null) return;
    const t = window.setTimeout(() => {
      if (active === scene.spots.length - 1) setTour(false);
      else open(active + 1);
    }, 6000 + scene.spots[active].info.text.length * 35);
    return () => window.clearTimeout(t);
  }, [tour, active]);
  const toggleTour = () => {
    if (tour) return setTour(false);
    open(active === null || active === scene.spots.length - 1 ? 0 : active);
    setTour(true);
  };

  useEffect(() => {
    const change = () => setFull(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : stage.current?.requestFullscreen())?.catch(() => {});
  // Local terms mentioned by the opened hotspot are explained right beside it.
  const text = spot ? `${spot.title} ${spot.info.text}`.toLocaleLowerCase('id') : '';
  const terms = spot ? (GLOSSARY[scene.id] ?? []).filter((t) => text.includes(t.term.split(' (')[0].toLocaleLowerCase('id'))) : [];
  const next = active === null ? 0 : (active + 1) % scene.spots.length;

  return (
    <div className="grid bg-forest-950 text-ivory xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div ref={stage} className="relative h-[66dvh] min-h-[380px] bg-forest-950 xl:h-[min(calc(100dvh_-_7rem),760px)]">
        <Suspense fallback={<div className="grid h-full place-items-center" role="status">Memuat lingkungan 3D…</div>}>
          <DioramaCanvas diorama={scene} active={active} found={found} spin={spin} reset={reset} mood={mood} lift={active !== null && (tour || full)} onSpot={(i) => { setTour(false); open(i); }} />
        </Suspense>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          <div className="flex gap-1 rounded-full bg-forest-950/80 p-1" role="group" aria-label="Suasana cahaya">
            {(Object.keys(MOODS) as Mood[]).map((m) => <button key={m} type="button" className={`min-h-9 cursor-pointer rounded-full px-3 text-xs font-extrabold ${mood === m ? 'bg-gold-500 text-forest-950' : 'text-ivory'}`} aria-pressed={mood === m} onClick={() => setMood(m)}>{MOODS[m].label}</button>)}
          </div>
          {typeof document !== 'undefined' && document.fullscreenEnabled && <button type="button" className="chip bg-forest-950/80 text-ivory" aria-pressed={full} onClick={toggleFull}>{full ? 'Keluar layar penuh' : 'Layar penuh'}</button>}
        </div>
        {spot && (tour || full) && (
          <div className="absolute inset-x-2 bottom-16 mx-auto max-w-xl rounded-xl bg-forest-950/90 p-4 text-ivory shadow-2xl" role="status">
            <p className="m-0 text-xs font-extrabold tracking-wider text-gold-300 uppercase">{active! + 1} / {scene.spots.length} · {spot.topic}</p>
            <p className="m-0 font-display text-2xl leading-tight">{spot.title}</p>
            <p className="mt-1 mb-0 text-sm leading-relaxed">{spot.info.text}</p>
          </div>
        )}
        <div className="absolute inset-x-2 bottom-2 flex flex-wrap justify-center gap-2">
          <button type="button" className="chip border-gold-500 bg-gold-500 font-extrabold text-forest-950" aria-pressed={tour} onClick={toggleTour}>{tour ? '❚❚ Jeda tur' : '▶ Tur terpandu'}</button>
          {(tour || full) && <button type="button" className="chip bg-forest-950/85 text-ivory" onClick={() => open(active === null ? 0 : (active + 1) % scene.spots.length)}>Titik berikutnya →</button>}
          <button type="button" className="chip bg-forest-950/85 text-ivory" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
          <button type="button" className="chip bg-forest-950/85 text-ivory" onClick={() => { setTour(false); setActive(null); setReset((n) => n + 1); }}>Lihat semua</button>
        </div>
      </div>

      <div className="paper flex flex-col border-ink/15 p-5 max-xl:border-t xl:max-h-[min(74dvh,720px)] xl:overflow-y-auto xl:border-l">
        <h3 className="m-0 text-2xl">Titik budaya</h3>
        <p className="mt-1 mb-3 text-sm font-bold" role="status">{found.size} dari {scene.spots.length} sudah ditemukan</p>
        <ol className="m-0 p-0">
          {scene.spots.map((s, i) => (
            <li key={s.id} className={`list-none border-t border-ink/15 ${active === i ? 'bg-cream' : ''}`}>
              <button type="button" className="flex min-h-14 w-full cursor-pointer items-center gap-3 px-2 py-2.5 text-left" aria-expanded={active === i} onClick={() => { setTour(false); open(i); }}>
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
