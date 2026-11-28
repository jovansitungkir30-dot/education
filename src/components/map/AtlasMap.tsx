import { lazy, Suspense, useState } from 'react';
import { districtById, fullName } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { TERRAIN_CREDIT } from '../../lib/terrain';
import { hasWebGL } from '../../three/device';
import Map2D from './Map2D';
import type { MapCommand } from './Map3D';

const Map3D = lazy(() => import('./Map3D'));

interface Props {
  selected: string | null;
  visited: Set<string>;
  completed: Set<string>;
  panel: number;
  onSelect: (id: string | null) => void;
}

/** The atlas viewport: terrain or flat map, with tooltip and view controls. */
export default function AtlasMap({ selected, visited, completed, panel, onSelect }: Props) {
  const [mode, setMode] = useState<'3d' | '2d'>(() => (hasWebGL() ? '3d' : '2d'));
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [command, setCommand] = useState<MapCommand>(null);
  const [boundaries, setBoundaries] = useState(true);
  const [credit, setCredit] = useState(false);

  const send = (type: NonNullable<MapCommand>['type']) => setCommand((c) => ({ type, n: (c?.n ?? 0) + 1 }));
  const hovered = districtById(hover?.id ?? null);
  const shared = {
    selected,
    visited,
    completed,
    boundaries,
    panel,
    command,
    hovered: hover?.id ?? null,
    onSelect: (id: string) => onSelect(id),
    onHover: (id: string | null, p?: { x: number; y: number }) => setHover(id && p ? { id, ...p } : null),
  };
  const flat = <Map2D {...shared} />;

  return (
    <div className={`relative size-full overflow-hidden bg-[#0a4f86] ${hover ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}>
      {mode === '3d' ? (
        <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan peta 3D…</div>}>
          <Map3D {...shared} fallback={flat} />
        </Suspense>
      ) : (
        <div className="absolute inset-0">{flat}</div>
      )}

      {hovered && hover && hover.id !== selected && (
        <div role="tooltip" className="hud pointer-events-none absolute z-20 w-60 -translate-x-1/2 -translate-y-[115%] rounded-2xl px-4 py-3 shadow-2xl" style={{ left: Math.max(128, hover.x), top: Math.max(150, hover.y) }}>
          <p className="m-0 text-sm font-extrabold">{fullName(hovered)}</p>
          {LANDMARKS[hovered.id] ? (
            <>
              <p className="m-0 mt-0.5 font-display text-base leading-tight text-terracotta-700">{LANDMARKS[hovered.id].name}</p>
              <p className="m-0 mt-1 text-xs leading-snug">{LANDMARKS[hovered.id].preview}</p>
              <p className="m-0 mt-1.5 text-[11px] font-extrabold">Klik untuk menjelajah →</p>
            </>
          ) : (
            <p className="m-0 mt-0.5 text-xs">Badan air. Klik untuk membaca cerita bentang alamnya.</p>
          )}
        </div>
      )}

      <div className="map-tools absolute top-1/2 right-3 z-10 flex -translate-y-1/2 flex-col gap-2 max-lg:top-auto max-lg:bottom-24 max-lg:translate-y-0">
        <button type="button" className="map-btn" aria-label="Perbesar peta" onClick={() => send('in')}>＋</button>
        <button type="button" className="map-btn" aria-label="Perkecil peta" onClick={() => send('out')}>－</button>
        <button type="button" className="map-btn" aria-label="Seluruh provinsi" title="Seluruh provinsi" onClick={() => { onSelect(null); send('reset'); }}>⌂</button>
        <button type="button" className="map-btn text-xs" aria-pressed={boundaries} aria-label="Tampilkan batas wilayah" title="Batas wilayah" onClick={() => setBoundaries(!boundaries)}>Batas</button>
        {hasWebGL() && (
          <button type="button" className="map-btn text-xs" aria-label={`Tampilan ${mode === '3d' ? '2D' : '3D'}`} onClick={() => { setHover(null); setCommand(null); setMode(mode === '3d' ? '2d' : '3d'); }}>
            {mode === '3d' ? '2D' : '3D'}
          </button>
        )}
      </div>

      <div className="absolute bottom-1.5 left-1/2 z-10 w-max max-w-[min(94%,46rem)] -translate-x-1/2 text-center text-[10px] leading-snug">
        {credit && <p className="m-0 mb-1 rounded-lg bg-black/75 px-3 py-2 text-white">{TERRAIN_CREDIT}. Relief diperbesar sekitar 11 kali. Jalur putus-putus adalah rute jelajah, bukan jalan.</p>}
        <button type="button" className="cursor-pointer rounded-full bg-black/45 px-2.5 py-0.5 text-white/90" aria-expanded={credit} onClick={() => setCredit(!credit)}>
          © EOX · Copernicus · Mapzen · geoBoundaries
        </button>
      </div>
    </div>
  );
}
