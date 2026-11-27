import { useMemo, useState } from 'react';
import type { Activity as ActivityData } from '../data/modules';
import { KNOWLEDGE, type Knowledge } from '../data/types';

function Reveal({ cards }: Extract<ActivityData, { type: 'reveal' }>) {
  const [open, setOpen] = useState<number[]>([]);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((c, i) => {
        const on = open.includes(i);
        return (
          <button key={c.front} type="button" aria-expanded={on} onClick={() => setOpen(on ? open.filter((x) => x !== i) : [...open, i])} className={`min-h-36 cursor-pointer rounded-2xl border-2 p-4 text-left transition ${on ? 'border-terracotta-500 bg-cream' : 'border-ink/20 hover:border-terracotta-500'}`}>
            <span className="block font-display text-xl">{c.front}</span>
            <span className="mt-2 block text-sm leading-relaxed">{on ? c.back : 'Pilih untuk membuka'}</span>
          </button>
        );
      })}
    </div>
  );
}

function Match({ pairs }: Extract<ActivityData, { type: 'match' }>) {
  // A fixed rotation keeps the answers out of order without changing between renders.
  const options = useMemo(() => {
    const all = pairs.map((p) => p.right);
    return [...all.slice(2), ...all.slice(0, 2)].reverse();
  }, [pairs]);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const correct = pairs.filter((p) => chosen[p.left] === p.right).length;
  return (
    <div className="space-y-3">
      {pairs.map((p) => {
        const value = chosen[p.left] ?? '';
        return (
          <label key={p.left} className="grid items-center gap-2 sm:grid-cols-[1fr_2fr_6rem]">
            <span className="font-bold">{p.left}</span>
            <select className="min-h-11 rounded-lg border border-ink/30 bg-white px-3" value={value} onChange={(e) => setChosen({ ...chosen, [p.left]: e.target.value })}>
              <option value="">Pilih…</option>
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <span className="text-sm font-bold" aria-live="polite">{value && (value === p.right ? '✓ Cocok' : '✗ Coba lagi')}</span>
          </label>
        );
      })}
      <p className="text-sm" aria-live="polite">{correct} dari {pairs.length} sudah cocok.</p>
    </div>
  );
}

function Classify({ items }: Extract<ActivityData, { type: 'classify' }>) {
  const [chosen, setChosen] = useState<Record<number, Knowledge>>({});
  return (
    <ol className="m-0 space-y-4 p-0">
      {items.map((it, i) => (
        <li key={it.text} className="list-none rounded-2xl border border-ink/20 p-4">
          <p className="mt-0 font-semibold">{it.text}</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => (
              <button key={k} type="button" className="chip" aria-pressed={chosen[i] === k} onClick={() => setChosen({ ...chosen, [i]: k })}>{KNOWLEDGE[k].label}</button>
            ))}
          </div>
          <p className="mb-0 text-sm font-bold" aria-live="polite">
            {chosen[i] && (chosen[i] === it.answer ? '✓ Benar.' : `✗ Belum tepat. Coba pikirkan ini: ${KNOWLEDGE[it.answer].hint}`)}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function Activity({ data }: { data: ActivityData }) {
  return (
    <div>
      <h3 className="mt-0 mb-4 text-2xl">Coba: {data.title}</h3>
      {data.type === 'reveal' && <Reveal {...data} />}
      {data.type === 'match' && <Match {...data} />}
      {data.type === 'classify' && <Classify {...data} />}
    </div>
  );
}
