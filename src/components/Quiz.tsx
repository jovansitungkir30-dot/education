import { useState } from 'react';
import type { Module } from '../data/modules';
import { PASS_MARK, QUIZ_POINTS, useProgress } from '../lib/progress';

export default function Quiz({ module }: { module: Module }) {
  const { recordScore, state } = useProgress();
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const total = module.quiz.length;
  const finished = answers.length === total;
  const best = state.scores[module.id];

  const restart = () => {
    setStarted(true);
    setI(0);
    setPick(null);
    setAnswers([]);
  };

  if (!started) {
    return (
      <div>
        <h3 className="mt-0 mb-2 text-2xl">Uji pemahaman</h3>
        <p>{total} pertanyaan. Raih {PASS_MARK}% atau lebih untuk mendapat lencana “{module.badge}” dan {QUIZ_POINTS} poin.{best !== undefined && ` Nilai terbaik Anda: ${best}%.`}</p>
        <button type="button" className="btn btn-terra" onClick={restart}>{best === undefined ? 'Mulai kuis' : 'Ulangi kuis'}</button>
      </div>
    );
  }

  if (finished) {
    const right = answers.filter((a, n) => a === module.quiz[n].answer).length;
    const pct = Math.round((right / total) * 100);
    const passed = pct >= PASS_MARK;
    return (
      <div role="status">
        <h3 className="mt-0 mb-2 text-3xl">Anda benar {right} dari {total} ({pct}%)</h3>
        <p className="text-lg">{passed ? `Lulus. Lencana “${module.badge}” jadi milik Anda.` : 'Belum lulus. Pelajari catatan di bawah lalu coba lagi.'}</p>
        <ol className="space-y-3 pl-5">
          {module.quiz.map((question, n) => (
            <li key={question.q}>
              <strong>{answers[n] === question.answer ? '✓' : '✗'} {question.q}</strong>
              <span className="block text-sm">Jawaban: {question.options[question.answer]}. {question.why}</span>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-terra" onClick={restart}>Coba lagi</button>
      </div>
    );
  }

  const question = module.quiz[i];
  const checked = answers.length > i;
  const check = () => {
    if (pick === null) return;
    const next = [...answers, pick];
    // Score is recorded as soon as the final answer is checked.
    if (next.length === total) {
      const right = next.filter((a, n) => a === module.quiz[n].answer).length;
      recordScore(module.id, Math.round((right / total) * 100));
    }
    setAnswers(next);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <p className="eyebrow">Pertanyaan {i + 1} dari {total}</p>
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-4 font-display text-2xl">{question.q}</legend>
        <div className="space-y-2">
          {question.options.map((o, n) => {
            const mark = checked ? (n === question.answer ? 'border-emerald-700 bg-emerald-100' : n === pick ? 'border-red-700 bg-red-100' : 'border-ink/15') : pick === n ? 'border-terracotta-500 bg-cream' : 'border-ink/20';
            return (
              <label key={o} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 ${mark}`}>
                <input type="radio" name={`q${i}`} checked={pick === n} disabled={checked} onChange={() => setPick(n)} className="size-4 accent-terracotta-500" />
                <span>{o}{checked && n === question.answer && <strong> · jawaban benar</strong>}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <p aria-live="polite" className="min-h-6">{checked && <><strong>{pick === question.answer ? 'Benar. ' : 'Belum tepat. '}</strong>{question.why}</>}</p>
      {!checked ? (
        <button type="button" className="btn btn-terra" disabled={pick === null} onClick={check}>Periksa jawaban</button>
      ) : (
        <button type="button" className="btn btn-terra" onClick={() => { setI(i + 1); setPick(null); }}>Pertanyaan berikutnya</button>
      )}
    </form>
  );
}
