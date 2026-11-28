/** Interactive question kinds shared by area quizzes and learning pathways. */
import { useMemo, useState } from 'react';
import { DISTRICTS, districtById, fullName } from '../../data/atlas';
import { zoneOf } from '../../data/pathways';
import { HALF_HEIGHT, HALF_WIDTH, shapeOf, svgPath } from '../../lib/geo';

export type Ask =
  | { type: 'choice'; q: string; options: string[]; answer: number; why: string }
  | { type: 'map'; q: string; candidates: string[]; answer: string; why: string }
  | { type: 'order'; q: string; items: { label: string; when: string }[]; why: string }
  | { type: 'photo'; q: string; photos: { file: string; alt: string }[]; answer: number; why: string };

/** A small deterministic shuffle, so a question looks the same each time it is opened. */
export function shuffle<T>(list: T[], seed: string): T[] {
  let s = [...seed].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 2147483647, 7) || 1;
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const tone = (state: 'idle' | 'right' | 'wrong' | 'other') =>
  state === 'idle' ? 'border-ink/25 bg-white/50 hover:border-terracotta-500' : state === 'right' ? 'border-emerald-700 bg-emerald-100' : state === 'wrong' ? 'border-red-700 bg-red-100' : 'border-ink/10 opacity-55';
const stateOf = (done: boolean, mine: boolean, correct: boolean) => (!done ? 'idle' : correct ? 'right' : mine ? 'wrong' : 'other');

interface AnswerProps<T> {
  ask: T;
  /** Null until answered. */
  result: boolean | null;
  onAnswer: (correct: boolean) => void;
}

function Choice({ ask, result, onAnswer }: AnswerProps<Extract<Ask, { type: 'choice' }>>) {
  const [mine, setMine] = useState<number | null>(null);
  const done = result !== null;
  return (
    <div className="space-y-2">
      {ask.options.map((o, i) => (
        <button key={o} type="button" aria-disabled={done} onClick={() => { if (!done) { setMine(i); onAnswer(i === ask.answer); } }} className={`block min-h-12 w-full rounded-md border-2 px-4 py-3 text-left ${done ? 'cursor-default' : 'cursor-pointer'} ${tone(stateOf(done, mine === i, i === ask.answer))}`}>
          {o}
          {done && i === ask.answer && <strong> ✓ jawaban yang tepat</strong>}
          {done && mine === i && i !== ask.answer && <strong> ✗ pilihan Anda</strong>}
        </button>
      ))}
    </div>
  );
}

function OnMap({ ask, result, onAnswer }: AnswerProps<Extract<Ask, { type: 'map' }>>) {
  const [mine, setMine] = useState<string | null>(null);
  const done = result !== null;
  const letters = 'ABCD';
  const paths = useMemo(() => DISTRICTS.map((d) => ({ d, path: svgPath(d) })), []);
  const choose = (id: string) => { if (!done) { setMine(id); onAnswer(id === ask.answer); } };
  return (
    <div>
      <svg viewBox={`${-HALF_WIDTH - 0.5} ${-HALF_HEIGHT - 0.5} ${HALF_WIDTH * 2 + 1} ${HALF_HEIGHT * 2 + 1}`} className="max-h-[52dvh] w-full rounded-lg bg-[#124a56]" role="img" aria-label="Peta Sumatera Utara dengan empat wilayah berhuruf A sampai D">
        {paths.map(({ d, path }) => {
          const i = ask.candidates.indexOf(d.id);
          const fill = i < 0 ? (d.type === 'air' ? '#3a93a8' : '#547a58') : done && d.id === ask.answer ? '#2f9e6b' : done && d.id === mine ? '#c0432f' : '#e2c47c';
          return <path key={d.id} d={path} fill={fill} stroke="#f3e9cd" strokeWidth={i < 0 ? 0.5 : 1.4} vectorEffect="non-scaling-stroke" className={i >= 0 && !done ? 'cursor-pointer hover:brightness-110' : ''} onClick={i >= 0 ? () => choose(d.id) : undefined} />;
        })}
        {ask.candidates.map((id, i) => {
          const [x, y] = shapeOf(districtById(id)!).center;
          return (
            <g key={id} className="pointer-events-none">
              <circle cx={x} cy={-y} r={0.55} fill="#0f231b" />
              <text x={x} y={-y} textAnchor="middle" dominantBaseline="central" fill="#f6f0e1" fontSize={0.62} fontWeight={800}>{letters[i]}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ask.candidates.map((id, i) => (
          <button key={id} type="button" aria-disabled={done} onClick={() => choose(id)} className={`min-h-12 rounded-md border-2 px-3 py-2 text-left text-sm font-extrabold ${done ? 'cursor-default' : 'cursor-pointer'} ${tone(stateOf(done, mine === id, id === ask.answer))}`}>
            {letters[i]}
            {/* The zone is offered to those who cannot see the map; the name appears after answering. */}
            <span className="sr-only">, di zona {zoneOf(id).name}</span>
            {done && <span className="block text-xs font-normal">{fullName(districtById(id)!)}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Order({ ask, result, onAnswer }: AnswerProps<Extract<Ask, { type: 'order' }>>) {
  const mixed = useMemo(() => {
    const m = shuffle(ask.items.map((_, i) => i), ask.q);
    return m.every((x, i) => x === i) ? [...m].reverse() : m;
  }, [ask]);
  const [picked, setPicked] = useState<number[]>([]);
  const done = result !== null;
  const add = (i: number) => {
    if (done || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === ask.items.length) onAnswer(next.every((x, k) => x === k));
  };
  return (
    <div>
      <p className="mt-0 text-sm">Ketuk dari yang paling awal sampai yang paling akhir.</p>
      <ul className="m-0 space-y-2 p-0">
        {mixed.map((i) => {
          const at = picked.indexOf(i);
          return (
            <li key={ask.items[i].label} className="list-none">
              <button type="button" aria-disabled={done || at >= 0} onClick={() => add(i)} className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md border-2 px-3 py-2.5 text-left ${done ? tone(at === i ? 'right' : 'wrong') : at >= 0 ? 'border-terracotta-500 bg-cream' : tone('idle')}`}>
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-900 text-sm font-extrabold text-gold-300">{at >= 0 ? at + 1 : '?'}</span>
                <span>
                  {ask.items[i].label}
                  {at >= 0 && <span className="sr-only">, urutan pilihan Anda {at + 1}</span>}
                  {done && <span className="block text-xs font-bold">{ask.items[i].when} · urutan yang tepat: {i + 1}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!done && picked.length > 0 && <button type="button" className="chip mt-2" onClick={() => setPicked([])}>Ulangi urutan</button>}
    </div>
  );
}

function Photos({ ask, result, onAnswer }: AnswerProps<Extract<Ask, { type: 'photo' }>>) {
  const [mine, setMine] = useState<number | null>(null);
  const done = result !== null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ask.photos.map((p, i) => (
        <button key={p.file} type="button" aria-disabled={done} onClick={() => { if (!done) { setMine(i); onAnswer(i === ask.answer); } }} aria-label={done ? p.alt : `Foto pilihan ${i + 1}`} className={`overflow-hidden rounded-lg border-4 p-0 text-left ${done ? 'cursor-default' : 'cursor-pointer'} ${tone(stateOf(done, mine === i, i === ask.answer))}`}>
          <img src={`./${p.file}`} alt="" className="block aspect-[4/3] w-full object-cover" />
          <span className="block p-2 text-xs">{done ? `${i === ask.answer ? '✓ ' : ''}${p.alt}` : `Foto ${i + 1}`}</span>
        </button>
      ))}
    </div>
  );
}

export function Question(props: AnswerProps<Ask>) {
  const { ask } = props;
  return (
    <div>
      <p className="mt-0 mb-4 text-xl leading-snug font-bold">{ask.q}</p>
      {ask.type === 'choice' && <Choice {...props} ask={ask} />}
      {ask.type === 'map' && <OnMap {...props} ask={ask} />}
      {ask.type === 'order' && <Order {...props} ask={ask} />}
      {ask.type === 'photo' && <Photos {...props} ask={ask} />}
      <div aria-live="polite">
        {props.result !== null && (
          <p className={`mt-4 mb-0 border-l-4 py-1 pl-3 ${props.result ? 'border-emerald-700' : 'border-red-700'}`}>
            <strong>{props.result ? 'Tepat. ' : 'Belum tepat. '}</strong>{ask.why}
          </p>
        )}
      </div>
    </div>
  );
}
