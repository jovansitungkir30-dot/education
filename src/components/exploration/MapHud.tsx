/** Game-style overlays on the full-screen atlas. */
import { useState, useSyncExternalStore } from 'react';
import { ADMIN, DISTRICTS, visitedDistricts } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { STOPS } from '../../data/pins';
import { badges, completedDioramas } from '../../lib/badges';
import { audioState, play, stop } from '../../lib/audio';
import { useProgress } from '../../lib/progress';
import { href } from '../../lib/router';
import { NAV } from '../Layout';

export function TopLeft({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const [menu, setMenu] = useState(false);
  const { state } = useProgress();
  const visited = new Set(visitedDistricts(state).map((d) => d.id));
  return (
    <div className="absolute top-3 left-3 z-20 flex max-w-[calc(100%-8.5rem)] flex-col items-start gap-2">
      <div className="hud flex items-center gap-1 rounded-2xl p-1.5">
        <a className="map-btn !size-9" href={href('/')} aria-label="Kembali ke beranda">‹</a>
        <span className="px-2 text-sm font-bold whitespace-nowrap max-sm:hidden">Beranda <span className="mx-1 opacity-40">|</span> Jejak Budaya</span>
        <button type="button" className="cursor-pointer rounded-xl px-3 py-2 text-sm font-extrabold hover:bg-[#bfe4ee]" aria-expanded={menu} onClick={() => setMenu(!menu)}>Menu</button>
      </div>
      {menu && (
        <nav className="hud grid min-w-44 rounded-2xl p-2" aria-label="Utama">
          {NAV.map(([to, label]) => <a key={to} className="rounded-xl px-3 py-2 text-sm font-bold hover:bg-[#bfe4ee]" href={href(to)}>{label}</a>)}
          <button type="button" className="cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-bold hover:bg-[#bfe4ee]" onClick={() => { setMenu(false); document.getElementById('artifacts')?.scrollIntoView(); }}>Artefak 3D ↓</button>
        </nav>
      )}
      <label className="hud flex items-center rounded-2xl px-2 py-1">
        <span className="sr-only">Cari wilayah</span>
        <select className="min-h-9 w-52 max-w-full cursor-pointer bg-transparent text-sm font-bold" value={selected ?? ''} onChange={(e) => onSelect(e.target.value || null)}>
          <option value="">Cari wilayah…</option>
          {(['kabupaten', 'kota', 'air'] as const).map((type) => (
            <optgroup key={type} label={type === 'air' ? 'Badan air' : `${type === 'kota' ? 'Kota' : 'Kabupaten'} (${ADMIN.filter((d) => d.type === type).length})`}>
              {DISTRICTS.filter((d) => d.type === type).map((d) => (
                <option key={d.id} value={d.id}>{d.name}{LANDMARKS[d.id] ? ` · ${LANDMARKS[d.id].name}` : ''}{visited.has(d.id) ? ' ✓' : ''}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
    </div>
  );
}

export function ExplorerCard({ onLog }: { onLog: () => void }) {
  const { state } = useProgress();
  const all = badges(state);
  const earned = all.filter((b) => b.earned).length;
  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
      <a className="hud flex items-center gap-2.5 rounded-2xl py-1.5 pr-4 pl-1.5" href={href('/learn', { view: 'progress' })}>
        <span className="grid size-9 place-items-center rounded-xl bg-[#bfe4ee] font-display text-lg max-sm:hidden" aria-hidden="true">{(state.name.trim()[0] ?? 'P').toUpperCase()}</span>
        <span className="leading-tight max-sm:pl-2">
          <span className="block max-w-32 truncate text-xs font-bold">{state.name.trim() || 'Penjelajah'}</span>
          <span className="block text-sm whitespace-nowrap"><strong>{earned}</strong> <span className="opacity-60">| {all.length} lencana</span></span>
        </span>
      </a>
      <button type="button" className="map-btn !bg-[#0d3f4f] !text-white" aria-label="Buka catatan temuan" title="Catatan temuan" onClick={onLog}>
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 4h16l-2-4V9a6 6 0 0 0-6-6Zm-2.5 16a2.5 2.5 0 0 0 5 0Z" /></svg>
      </button>
    </div>
  );
}

export function TrailCard({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const { state } = useProgress();
  const done = completedDioramas(state);
  return (
    <div className="hud absolute bottom-8 left-3 z-10 rounded-2xl p-3">
      <p className="m-0 mb-2 text-xs font-extrabold">Jejak Budaya · {done.size}/{STOPS.length}</p>
      <ol className="m-0 flex gap-1.5 p-0">
        {STOPS.map((s) => (
          <li key={s.id} className="list-none">
            <button type="button" className={`grid size-9 cursor-pointer place-items-center rounded-xl border-2 text-sm font-black ${done.has(s.id) ? 'border-emerald-600 bg-emerald-600 text-white' : selected === s.id ? 'border-[#e0a800] bg-[#fff4cf]' : 'border-[#9fd0de] bg-white hover:bg-[#bfe4ee]'}`} aria-label={`Perhentian ${s.stop}: ${s.label}${done.has(s.id) ? ', selesai' : ''}`} title={s.label} onClick={() => onSelect(s.id)}>
              {done.has(s.id) ? '✓' : s.stop}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SoundAndHelp() {
  const playing = useSyncExternalStore(audioState.subscribe, audioState.current) === 'lakeside';
  const [help, setHelp] = useState(false);
  return (
    <div className="absolute right-3 bottom-8 z-20 flex flex-col items-end gap-2">
      {help && (
        <div className="hud w-64 rounded-2xl p-4 text-sm" role="dialog" aria-label="Bantuan">
          <p className="m-0 font-extrabold">Cara menjelajah</p>
          <ul className="mt-2 mb-0 list-disc space-y-1 pl-4">
            <li>Geser untuk berpindah, tombol ＋ － untuk memperbesar.</li>
            <li>Klik miniatur atau wilayah untuk membuka halaman belajarnya.</li>
            <li>Perbesar peta untuk melihat nama setiap wilayah, atau pakai “Cari wilayah”.</li>
            <li>Suara adalah suasana sintetis, bukan rekaman Danau Toba.</li>
          </ul>
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" className="map-btn" aria-pressed={playing} aria-label={playing ? 'Matikan suara suasana' : 'Nyalakan suara suasana'} onClick={() => (playing ? stop() : play('lakeside'))}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9Z" fill="currentColor" />
            {playing ? <path d="M16 9q2 3 0 6M19 7q4 5 0 10" /> : <path d="M16 9l5 6M21 9l-5 6" />}
          </svg>
        </button>
        <button type="button" className="map-btn" aria-expanded={help} aria-label="Bantuan" onClick={() => setHelp(!help)}>?</button>
      </div>
    </div>
  );
}
