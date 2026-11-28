/** Game-style overlays on the full-screen atlas. */
import { useState } from 'react';
import AboutExperience from '../credits/AboutExperience';
import { visitedDistricts } from '../../data/atlas';
import { THEMES, themeById } from '../../data/pathways';
import RegionSearch from '../map/RegionSearch';
import { STOPS } from '../../data/pins';
import { badges, completedDioramas } from '../../lib/badges';
import { useProgress } from '../../lib/progress';
import { href } from '../../lib/router';
import { NAV } from '../Layout';

export function TopLeft({ theme, onSelect, onTheme }: { selected: string | null; theme: string | null; onSelect: (id: string | null) => void; onTheme: (id: string) => void }) {
  const [menu, setMenu] = useState(false);
  const current = themeById(theme);
  return (
    <div className="absolute top-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] flex-col items-start gap-2 max-sm:max-w-[calc(100%-4.5rem)]">
      <div className="hud flex items-center gap-1 rounded-lg p-1.5">
        <a className="map-btn !size-9" href={href('/')} aria-label="Kembali ke beranda">‹</a>
        <span className="px-2 font-display text-base whitespace-nowrap max-sm:hidden">Atlas Budaya</span>
        <button type="button" className="min-h-9 cursor-pointer rounded-md px-3 text-sm font-extrabold hover:bg-cream" aria-expanded={menu} onClick={() => setMenu(!menu)}>Menu</button>
        <a className="flex min-h-9 items-center rounded-md px-3 text-sm font-extrabold whitespace-nowrap hover:bg-cream" href={href('/wilayah')}>Daftar wilayah</a>
      </div>
      {menu && (
        <nav className="hud grid min-w-44 rounded-lg p-2" aria-label="Utama">
          {[...NAV, ['/alat-musik', 'Alat musik'] as const, ['/artefak', 'Artefak 3D'] as const].map(([to, label]) => <a key={to} className="rounded-md px-3 py-2 text-sm font-bold hover:bg-cream" href={href(to)}>{label}</a>)}
        </nav>
      )}
      <RegionSearch onSelect={onSelect} />
      <label className="hud flex items-center rounded-lg px-2">
        <span className="sr-only">Jalur tematik</span>
        <select className="min-h-10 w-56 max-w-full cursor-pointer bg-transparent text-sm font-bold" value={theme ?? ''} onChange={(e) => onTheme(e.target.value)}>
          <option value="">Jalur: semua wilayah</option>
          {THEMES.map((t) => <option key={t.id} value={t.id}>Jalur: {t.name} ({t.areas.length})</option>)}
        </select>
      </label>
      {current && (
        <p className="hud m-0 w-72 max-w-full rounded-lg p-3 text-xs leading-snug max-sm:hidden">
          Menyorot {current.areas.length} wilayah yang sudah punya materi tema ini. Bukan batas sebaran budayanya.{' '}
          <a className="font-extrabold underline" href={href('/wilayah', { tema: current.id })}>Lihat daftarnya</a>
        </p>
      )}
    </div>
  );
}

export function ExplorerCard({ onLog }: { onLog: () => void }) {
  const { state } = useProgress();
  const all = badges(state);
  const earned = all.filter((b) => b.earned).length;
  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
      <a className="hud flex items-center gap-2.5 rounded-lg py-1.5 pr-4 pl-1.5 max-sm:hidden" href={href('/learn', { view: 'progress' })}>
        <span className="grid size-9 place-items-center rounded-md bg-forest-900 font-display text-lg text-gold-300" aria-hidden="true">{(state.name.trim()[0] ?? 'P').toUpperCase()}</span>
        <span className="leading-tight">
          <span className="block max-w-32 truncate text-xs font-bold">{state.name.trim() || 'Penjelajah'}</span>
          <span className="block text-sm whitespace-nowrap"><strong>{earned}</strong> <span className="opacity-60">| {all.length} lencana</span></span>
        </span>
      </a>
      <button type="button" className="map-btn !bg-forest-900 !text-gold-300" aria-label="Buka catatan temuan" title="Catatan temuan" onClick={onLog}>
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M12 3a6 6 0 0 0-6 6v4l-2 4h16l-2-4V9a6 6 0 0 0-6-6Zm-2.5 16a2.5 2.5 0 0 0 5 0Z" /></svg>
      </button>
    </div>
  );
}

export function TrailCard({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const { state } = useProgress();
  const done = completedDioramas(state);
  return (
    <div className="hud absolute bottom-8 left-3 z-10 rounded-lg p-3 max-sm:hidden">
      <p className="m-0 mb-2 text-xs font-extrabold">Jejak Budaya · {done.size}/{STOPS.length}</p>
      <ol className="m-0 flex gap-1.5 p-0">
        {STOPS.map((s) => (
          <li key={s.id} className="list-none">
            <button type="button" className={`grid size-9 cursor-pointer place-items-center rounded-md border-2 text-sm font-black ${done.has(s.id) ? 'border-emerald-700 bg-emerald-700 text-white' : selected === s.id ? 'border-gold-700 bg-gold-300' : 'border-ink/20 bg-ivory hover:bg-cream'}`} aria-label={`Perhentian ${s.stop}: ${s.label}${done.has(s.id) ? ', selesai' : ''}`} title={s.label} onClick={() => onSelect(s.id)}>
              {done.has(s.id) ? '✓' : s.stop}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Help() {
  const [help, setHelp] = useState(false);
  return (
    <div className="absolute right-3 bottom-8 z-20 flex flex-col items-end gap-2">
      {help && (
        <div className="hud w-64 rounded-lg p-4 text-sm" role="dialog" aria-label="Bantuan">
          <p className="m-0 font-extrabold">Cara menjelajah</p>
          <ul className="mt-2 mb-1 list-disc space-y-1 pl-4">
            <li>Geser untuk berpindah; gulir, cubit, atau tombol ＋ － untuk memperbesar.</li>
            <li>Klik miniatur atau wilayah untuk membuka halamannya. Di layar sentuh, ketuk lalu tekan “Jelajahi”.</li>
            <li>Nama yang bertumpuk disembunyikan; perbesar atau pakai pencarian.</li>
          </ul>
          <AboutExperience />
        </div>
      )}
      <button type="button" className="map-btn" aria-expanded={help} aria-label="Bantuan" onClick={() => setHelp(!help)}>?</button>
    </div>
  );
}
