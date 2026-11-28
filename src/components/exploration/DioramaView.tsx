import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { DIORAMAS, type Diorama } from '../../data/dioramas';
import { districtById, fullName } from '../../data/atlas';
import { useProgress } from '../../lib/progress';
import { go } from '../../lib/router';
import { FactBlock } from '../ui';

const DioramaCanvas = lazy(() => import('../../three/diorama/DioramaCanvas'));

export const spotKey = (dioramaId: string, spotId: string) => `${dioramaId}:${spotId}`;

function MiniQuiz({ diorama }: { diorama: Diorama }) {
  const { recordScore, state } = useProgress();
  const [picks, setPicks] = useState<(number | null)[]>(() => diorama.quiz.map(() => null));
  const answered = picks.filter((p) => p !== null).length;
  const right = picks.filter((p, i) => p === diorama.quiz[i].answer).length;
  const best = state.scores[`diorama:${diorama.id}`];

  const pick = (q: number, option: number) => {
    const next = picks.map((p, i) => (i === q ? option : p));
    setPicks(next);
    if (next.every((p) => p !== null)) {
      recordScore(`diorama:${diorama.id}`, Math.round((next.filter((p, i) => p === diorama.quiz[i].answer).length / next.length) * 100));
    }
  };

  return (
    <div className="space-y-5">
      {best !== undefined && <p className="m-0 text-sm font-bold">Nilai terbaik Anda: {best}%</p>}
      {diorama.quiz.map((item, q) => (
        <fieldset key={item.q} className="m-0 border-0 p-0">
          <legend className="mb-2 font-bold">{q + 1}. {item.q}</legend>
          <div className="space-y-1.5">
            {item.options.map((option, i) => {
              const done = picks[q] !== null;
              const tone = !done ? 'border-ink/20 hover:border-terracotta-500' : i === item.answer ? 'border-emerald-700 bg-emerald-100' : picks[q] === i ? 'border-red-700 bg-red-100' : 'border-ink/10 opacity-60';
              return (
                <button key={option} type="button" disabled={done} onClick={() => pick(q, i)} className={`block w-full cursor-pointer rounded-xl border-2 px-3 py-2.5 text-left text-sm disabled:cursor-default ${tone}`}>
                  {option}
                  {done && i === item.answer && <strong> ✓ benar</strong>}
                  {done && picks[q] === i && i !== item.answer && <strong> ✗ pilihan Anda</strong>}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 mb-0 text-sm" aria-live="polite">{picks[q] !== null && item.why}</p>
        </fieldset>
      ))}
      {answered === diorama.quiz.length && (
        <div className="rounded-xl bg-cream p-4" role="status">
          <p className="m-0 font-display text-2xl">Anda benar {right} dari {diorama.quiz.length}</p>
          <button type="button" className="btn btn-line mt-2" onClick={() => setPicks(diorama.quiz.map(() => null))}>Ulangi</button>
        </div>
      )}
    </div>
  );
}

/** Full-screen exploration of one diorama. A native dialog keeps focus inside and closes with Escape. */
export default function DioramaView({ id }: { id: string }) {
  const diorama = DIORAMAS[id];
  const district = districtById(id)!;
  const ref = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [tab, setTab] = useState<'temuan' | 'kuis'>('temuan');
  const [spin, setSpin] = useState(true);
  const [reset, setReset] = useState(0);
  const { state, visit } = useProgress();
  const found = new Set(diorama.spots.filter((s) => state.visited.warisan.includes(spotKey(id, s.id))).map((s) => s.id));
  const close = () => go('/explore', { wilayah: id });

  useEffect(() => {
    const dialog = ref.current!;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const open = (i: number) => {
    setActive(i);
    setSpin(false);
    setTab('temuan');
    visit('warisan', spotKey(id, diorama.spots[i].id));
    window.requestAnimationFrame(() => document.getElementById(`spot-${diorama.spots[i].id}`)?.scrollIntoView({ block: 'nearest' }));
  };

  return (
    <dialog ref={ref} onCancel={(e) => { e.preventDefault(); close(); }} aria-labelledby="diorama-title" className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-forest-950 p-0 text-ivory">
      <div className="grid h-full grid-rows-[52dvh_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_27rem] lg:grid-rows-1">
        <div className="relative">
          <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan diorama…</div>}>
            <DioramaCanvas diorama={diorama} active={active} found={found} spin={spin} reset={reset} onSpot={open} />
          </Suspense>
          <div className="absolute top-3 left-3">
            <button type="button" className="btn btn-gold shadow-xl" onClick={close} autoFocus>← Kembali ke peta</button>
          </div>
          <div className="absolute right-3 bottom-3 flex gap-2">
            <button type="button" className="chip bg-forest-950/85 text-ivory" aria-pressed={spin} onClick={() => setSpin(!spin)}>Putar otomatis</button>
            <button type="button" className="chip bg-forest-950/85 text-ivory" onClick={() => { setActive(null); setReset((n) => n + 1); }}>Lihat semua</button>
          </div>
        </div>

        <div className="paper flex min-h-0 flex-col">
          <div className="border-b border-ink/15 p-5">
            <p className="eyebrow text-terracotta-700">{fullName(district)}</p>
            <h2 id="diorama-title" className="mt-1 mb-1 text-3xl">{diorama.title}</h2>
            <p className="m-0 text-sm">{diorama.summary}</p>
            <div className="mt-3 flex items-center gap-2" role="group" aria-label="Bagian panel">
              <button type="button" className="chip" aria-pressed={tab === 'temuan'} onClick={() => setTab('temuan')}>Temuan {found.size}/{diorama.spots.length}</button>
              <button type="button" className="chip" aria-pressed={tab === 'kuis'} onClick={() => setTab('kuis')}>Mini kuis</button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {tab === 'kuis' ? (
              <MiniQuiz diorama={diorama} />
            ) : (
              <>
                {found.size === diorama.spots.length && (
                  <p className="mt-0 rounded-xl border-2 border-gold-700 bg-cream p-3 text-sm font-bold">Semua temuan di wilayah ini sudah dibuka. Coba mini kuisnya.</p>
                )}
                <ol className="m-0 space-y-2 p-0">
                  {diorama.spots.map((spot, i) => (
                    <li key={spot.id} id={`spot-${spot.id}`} className={`list-none rounded-xl border-2 ${active === i ? 'border-terracotta-500 bg-cream' : 'border-ink/12'}`}>
                      <button type="button" className="flex w-full cursor-pointer items-center gap-3 p-3 text-left" aria-expanded={active === i} onClick={() => open(i)}>
                        <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${found.has(spot.id) ? 'bg-gold-500' : 'bg-forest-900 text-gold-300'}`}>{found.has(spot.id) ? '✓' : i + 1}</span>
                        <span>
                          <span className="block text-[11px] font-extrabold tracking-wider text-terracotta-700 uppercase">{spot.topic}</span>
                          <span className="block font-display text-lg leading-tight">{spot.title}</span>
                        </span>
                      </button>
                      {active === i && <div className="px-3 pb-3"><FactBlock item={spot.info} /></div>}
                    </li>
                  ))}
                </ol>
                <p className="mt-4 mb-0 rounded-lg border border-dashed border-ink/35 p-3 text-xs leading-relaxed"><strong>Tentang model ini:</strong> {diorama.caveat} Model dibuat lewat kode dan bukan replika akurat.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
