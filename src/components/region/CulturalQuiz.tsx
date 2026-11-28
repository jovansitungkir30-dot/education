import { useEffect, useMemo, useRef, useState } from 'react';
import { ADMIN, districtById } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { zoneOf } from '../../data/pathways';
import { useProgress } from '../../lib/progress';
import { buildQuiz } from '../../lib/quizBuilder';
import { href } from '../../lib/router';
import { Question } from '../learn/questions';

const ABOUT_TOPIC = { Letak: 'letaknya di peta', Landmark: 'landmark dan maknanya', Sejarah: 'urutan sejarahnya', Kuliner: 'sajiannya', Foto: 'mengenali dari foto' } as const;

/**
 * An optional knowledge check for one area: introduced first, then one question at a time with an
 * explanation, ending with what to revisit and where to go next. It never locks any material.
 */
export default function CulturalQuiz({ areaId, onJump }: { areaId: string; onJump: (section: string) => void }) {
  const items = useMemo(() => buildQuiz(areaId), [areaId]);
  const [stage, setStage] = useState<'intro' | 'play' | 'result'>('intro');
  const [at, setAt] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>(() => items.map(() => null));
  const [round, setRound] = useState(0);
  const { recordScore, state } = useProgress();
  const best = state.scores[`diorama:${areaId}`];
  const box = useRef<HTMLDivElement>(null);
  const name = districtById(areaId)!.name;
  const topics = [...new Set(items.map((i) => i.topic))];
  const right = results.filter(Boolean).length;

  // Keep the quiz in view and move focus when the question or stage changes.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    box.current?.focus({ preventScroll: true });
    box.current?.scrollIntoView({ block: 'nearest' });
  }, [stage, at]);

  const start = () => {
    moved.current = true;
    setResults(items.map(() => null));
    setAt(0);
    setRound((r) => r + 1);
    setStage('play');
  };
  const finish = () => {
    recordScore(`diorama:${areaId}`, Math.round((right / items.length) * 100));
    setStage('result');
  };

  const index = ADMIN.findIndex((d) => d.id === areaId);
  const sameZone = ADMIN.filter((d) => zoneOf(d.id).id === zoneOf(areaId).id && d.id !== areaId);
  const next = sameZone.find((d) => !state.visited.region.includes(d.id)) ?? ADMIN[(index + 1) % ADMIN.length];
  const missed = items.filter((_, i) => results[i] === false);

  return (
    <div ref={box} tabIndex={-1} className="max-w-3xl scroll-mt-28 outline-none">
      {stage === 'intro' && (
        <div className="rounded-xl bg-forest-900 p-6 text-ivory sm:p-8">
          <p className="eyebrow m-0 text-gold-300">Cek pemahaman · bukan ujian</p>
          <h3 className="mt-2 mb-3 text-3xl">Seberapa kenal Anda dengan {name} sekarang?</h3>
          <p className="mt-0 max-w-[58ch] leading-relaxed">Kuis ini menguatkan yang baru Anda jelajahi: {topics.map((t) => ABOUT_TOPIC[t]).join(', ')}. Setiap jawaban disertai penjelasan, jadi salah pun tetap belajar.</p>
          <p className="max-w-[58ch] text-sm opacity-80">{items.length} soal, tanpa batas waktu. Di akhir Anda melihat bagian mana yang layak dibaca lagi. Tidak ada materi yang dikunci.</p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-gold" onClick={start}>Mulai {items.length} soal</button>
            {best !== undefined && <span className="text-sm font-bold">Nilai terbaik Anda: {best}%</span>}
          </div>
        </div>
      )}

      {stage === 'play' && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <ol className="m-0 flex flex-1 gap-1.5 p-0" aria-hidden="true">
              {results.map((r, i) => <li key={i} className={`h-2 flex-1 list-none rounded-full ${r === null ? (i === at ? 'bg-terracotta-500' : 'bg-ink/15') : r ? 'bg-emerald-600' : 'bg-red-600'}`} />)}
            </ol>
            <span className="text-sm font-extrabold whitespace-nowrap">Soal {at + 1} dari {items.length} · {items[at].topic}</span>
          </div>
          <div key={`${round}-${at}`} className="animate-[rise_0.35s_ease-out]">
            <Question ask={items[at].ask} result={results[at]} onAnswer={(ok) => setResults((r) => r.map((x, i) => (i === at ? ok : x)))} />
          </div>
          {results[at] !== null && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn-terra" onClick={() => (at === items.length - 1 ? finish() : setAt(at + 1))}>{at === items.length - 1 ? 'Lihat hasil' : 'Soal berikutnya →'}</button>
              <button type="button" className="btn btn-line" onClick={() => onJump(items[at].section)}>Baca bagian terkait</button>
            </div>
          )}
        </div>
      )}

      {stage === 'result' && (
        <div role="status" className="rounded-xl border-2 border-gold-700 bg-cream p-6 sm:p-8">
          <p className="m-0 font-display text-4xl">Anda benar {right} dari {items.length}</p>
          <p className="mt-2 text-lg">{right === items.length ? `Mantap. Anda sudah mengenal ${name} dengan baik.` : right >= items.length * 0.6 ? 'Dasarnya sudah kuat. Tinggal beberapa bagian untuk dikuatkan.' : 'Ini awal yang baik. Baca lagi bagian di bawah, lalu coba ulang.'}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mt-2 mb-2 text-xl">Yang sudah Anda pahami</h4>
              <ul className="m-0 list-disc pl-5 text-sm">
                {items.filter((_, i) => results[i]).map((x, i) => <li key={i}>{x.ask.q}</li>)}
                {!right && <li>Belum ada, dan tidak apa-apa.</li>}
              </ul>
            </div>
            <div>
              <h4 className="mt-2 mb-2 text-xl">Layak dijelajahi lagi</h4>
              {missed.length ? (
                <div className="flex flex-wrap gap-2">
                  {[...new Map(missed.map((x) => [x.section, x])).values()].map((x) => <button key={x.section} type="button" className="chip bg-ivory" onClick={() => onJump(x.section)}>{x.topic}: {ABOUT_TOPIC[x.topic]}</button>)}
                </div>
              ) : <p className="m-0 text-sm">Semua topik terjawab tepat.</p>}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/20 pt-4">
            <a className="btn btn-terra" href={href('/wilayah', { id: next.id })}>Lanjut ke {next.name}: {LANDMARKS[next.id].name} →</a>
            <a className="btn btn-line" href={href('/learn')}>Ikuti jalur belajar</a>
            <button type="button" className="btn btn-line" onClick={start}>Ulangi kuis</button>
          </div>
        </div>
      )}
    </div>
  );
}
