import { useState } from 'react';
import type { Diorama } from '../../data/dioramas';
import { useProgress } from '../../lib/progress';

/** Short quiz for one area, with an explanation after every answer. It never locks any material. */
export default function CulturalQuiz({ scene }: { scene: Diorama }) {
  const { recordScore, state } = useProgress();
  const [picks, setPicks] = useState<(number | null)[]>(() => scene.quiz.map(() => null));
  const answered = picks.filter((p) => p !== null).length;
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
    <div className="max-w-2xl">
      <p className="mt-0 mb-5 text-sm font-bold">{answered} dari {scene.quiz.length} soal dijawab{best !== undefined && ` · nilai terbaik Anda ${best}%`}</p>
      {scene.quiz.map((item, q) => {
        const done = picks[q] !== null;
        return (
          <fieldset key={item.q} className="m-0 border-0 border-t border-ink/15 p-0 py-5">
            <legend className="float-left mb-3 w-full text-lg font-bold">{q + 1}. {item.q}</legend>
            <div className="clear-both space-y-2">
              {item.options.map((option, i) => {
                const tone = !done ? 'border-ink/25 hover:border-terracotta-500' : i === item.answer ? 'border-emerald-700 bg-emerald-100' : picks[q] === i ? 'border-red-700 bg-red-100' : 'border-ink/10 opacity-60';
                return (
                  <button key={option} type="button" aria-disabled={done} onClick={() => !done && pick(q, i)} className={`block min-h-12 w-full rounded-md border-2 px-4 py-3 text-left ${done ? 'cursor-default' : 'cursor-pointer'} ${tone}`}>
                    {option}
                    {done && i === item.answer && <strong> ✓ jawaban yang tepat</strong>}
                    {done && picks[q] === i && i !== item.answer && <strong> ✗ pilihan Anda</strong>}
                  </button>
                );
              })}
            </div>
            <div aria-live="polite">
              {done && (
                <p className={`mt-3 mb-0 border-l-4 pl-3 ${picks[q] === item.answer ? 'border-emerald-700' : 'border-red-700'}`}>
                  <strong>{picks[q] === item.answer ? 'Tepat. ' : 'Belum tepat. '}</strong>{item.why}
                </p>
              )}
            </div>
          </fieldset>
        );
      })}
      <div role="status">
        {answered === scene.quiz.length && (
          <div className="rounded-md bg-cream p-5">
            <p className="m-0 font-display text-2xl">Anda benar {right} dari {scene.quiz.length}</p>
            <p className="mt-1 mb-0 text-sm">{right === scene.quiz.length ? 'Semua tepat.' : 'Baca lagi penjelasan di tiap soal, lalu coba ulang bila mau.'}</p>
            <button type="button" className="btn btn-line mt-3" onClick={() => setPicks(scene.quiz.map(() => null))}>Ulangi kuis</button>
          </div>
        )}
      </div>
    </div>
  );
}
