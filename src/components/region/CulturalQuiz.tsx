import { useState } from 'react';
import type { Diorama } from '../../data/dioramas';
import { useProgress } from '../../lib/progress';

/** Short quiz for one area. It is optional and never locks any material. */
export default function CulturalQuiz({ scene }: { scene: Diorama }) {
  const { recordScore, state } = useProgress();
  const [picks, setPicks] = useState<(number | null)[]>(() => scene.quiz.map(() => null));
  const right = picks.filter((p, i) => p === scene.quiz[i].answer).length;
  const best = state.scores[`diorama:${scene.id}`];

  const pick = (q: number, option: number) => {
    const next = picks.map((p, i) => (i === q ? option : p));
    setPicks(next);
    if (next.every((p) => p !== null)) {
      recordScore(`diorama:${scene.id}`, Math.round((next.filter((p, i) => p === scene.quiz[i].answer).length / next.length) * 100));
    }
  };

  return (
    <div className="max-w-2xl space-y-7">
      {best !== undefined && <p className="m-0 text-sm font-bold">Nilai terbaik Anda: {best}%</p>}
      {scene.quiz.map((item, q) => (
        <fieldset key={item.q} className="m-0 border-0 p-0">
          <legend className="mb-2 text-lg font-bold">{q + 1}. {item.q}</legend>
          <div className="space-y-1.5">
            {item.options.map((option, i) => {
              const done = picks[q] !== null;
              const tone = !done ? 'border-ink/20 hover:border-terracotta-500' : i === item.answer ? 'border-emerald-700 bg-emerald-100' : picks[q] === i ? 'border-red-700 bg-red-100' : 'border-ink/10 opacity-60';
              return (
                <button key={option} type="button" disabled={done} onClick={() => pick(q, i)} className={`block w-full cursor-pointer rounded-xl border-2 px-4 py-3 text-left disabled:cursor-default ${tone}`}>
                  {option}
                  {done && i === item.answer && <strong> ✓ benar</strong>}
                  {done && picks[q] === i && i !== item.answer && <strong> ✗ pilihan Anda</strong>}
                </button>
              );
            })}
          </div>
          <p className="mt-2 mb-0 text-sm" aria-live="polite">{picks[q] !== null && item.why}</p>
        </fieldset>
      ))}
      {picks.every((p) => p !== null) && (
        <div className="rounded-2xl bg-cream p-5" role="status">
          <p className="m-0 font-display text-2xl">Anda benar {right} dari {scene.quiz.length}</p>
          <button type="button" className="btn btn-line mt-3" onClick={() => setPicks(scene.quiz.map(() => null))}>Ulangi</button>
        </div>
      )}
    </div>
  );
}
