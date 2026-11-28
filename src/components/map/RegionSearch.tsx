import { useId, useState } from 'react';
import { DISTRICTS, fullName } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { searchAreas } from '../../lib/search';

const LAKE = DISTRICTS.find((d) => d.type === 'air')!;

/** Combobox over areas, landmarks and local terms. Works with keyboard, touch and screen readers. */
export default function RegionSearch({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(0);
  const uid = useId();
  const found = searchAreas(query);
  const typed = query.trim().toLocaleLowerCase('id');
  const results = !typed || !fullName(LAKE).toLocaleLowerCase('id').includes(typed)
    ? found
    : typed.startsWith('danau') ? [LAKE, ...found] : [...found, LAKE];
  const active = Math.min(at, results.length - 1);

  const choose = (id: string) => {
    setOpen(false);
    setQuery('');
    onSelect(id);
  };
  const move = (to: number) => {
    const next = (to + results.length) % results.length;
    setAt(next);
    document.getElementById(`${uid}-${next}`)?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className="relative w-72 max-w-full" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <div className="hud flex items-center gap-2 rounded-lg px-3">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          role="combobox"
          aria-label="Cari wilayah, landmark, atau istilah"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results.length ? `${uid}-${active}` : undefined}
          autoComplete="off"
          placeholder="Cari wilayah atau landmark"
          className="min-h-11 w-full min-w-0 bg-transparent text-base font-semibold outline-none placeholder:font-normal placeholder:text-ink/60 sm:text-sm"
          value={query}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setAt(0); setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            if (!results.length) return;
            if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) setOpen(true); else move(active + 1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); move(active - 1); }
            if (e.key === 'Enter' && open) { e.preventDefault(); choose(results[active].id); }
          }}
        />
      </div>
      <p className="sr-only" role="status">{open ? `${results.length} hasil` : ''}</p>
      <ul id={`${uid}-list`} role="listbox" aria-label="Hasil pencarian" hidden={!open || !results.length} className="paper absolute inset-x-0 top-full z-30 mt-1 max-h-[min(50dvh,24rem)] overflow-y-auto rounded-lg p-1 shadow-2xl">
        {results.map((d, i) => (
          <li
            key={d.id}
            id={`${uid}-${i}`}
            role="option"
            aria-selected={i === active}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => choose(d.id)}
            onPointerMove={() => setAt(i)}
            className={`list-none cursor-pointer rounded-md px-3 py-2 ${i === active ? 'bg-cream' : ''}`}
          >
            <span className="block text-sm font-extrabold">{fullName(d)}</span>
            <span className="block text-xs">{LANDMARKS[d.id]?.name ?? 'Badan air'}</span>
          </li>
        ))}
      </ul>
      {open && !results.length && <p className="paper absolute inset-x-0 top-full z-30 m-0 mt-1 rounded-lg p-3 text-sm shadow-2xl">Tidak ada yang cocok. Coba nama wilayah atau jenis landmark.</p>}
    </div>
  );
}
