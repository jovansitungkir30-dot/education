import { lazy, Suspense, useState } from 'react';
import { ADMIN, districtById, fullName } from '../../data/atlas';
import { hasWebGL } from '../../three/device';
import Map2D from './Map2D';
import type { MapCommand } from './Map3D';

const Map3D = lazy(() => import('./Map3D'));

interface Props {
  selected: string | null;
  visited: Set<string>;
  onSelect: (id: string | null) => void;
}

/** The atlas viewport: 3D or 2D map with hover tooltip, zoom controls and legend. */
export default function AtlasMap({ selected, visited, onSelect }: Props) {
  const [mode, setMode] = useState<'3d' | '2d'>(() => (hasWebGL() ? '3d' : '2d'));
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [command, setCommand] = useState<MapCommand>(null);

  const send = (type: NonNullable<MapCommand>['type']) => setCommand((c) => ({ type, n: (c?.n ?? 0) + 1 }));
  const hovered = districtById(hover?.id ?? null);
  const shared = {
    selected,
    visited,
    command,
    hovered: hover?.id ?? null,
    onSelect: (id: string) => onSelect(id),
    onHover: (id: string | null, p?: { x: number; y: number }) => setHover(id && p ? { id, ...p } : null),
  };
  const flat = <Map2D {...shared} />;

  return (
    <div className={`relative size-full overflow-hidden ${hover ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}>
      {mode === '3d' ? (
        <Suspense fallback={<div className="grid h-full place-items-center" role="status">Menyiapkan peta 3D…</div>}>
          <Map3D {...shared} fallback={flat} />
        </Suspense>
      ) : (
        <div className="absolute inset-0">{flat}</div>
      )}

      {hovered && hover && hover.id !== selected && (
        <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[140%] rounded-lg bg-ivory px-3 py-1.5 text-sm font-bold whitespace-nowrap text-ink shadow-xl" style={{ left: hover.x, top: hover.y }}>
          {fullName(hovered)}
        </div>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button type="button" className="chip bg-forest-950/80 text-ivory" aria-label="Perbesar peta" onClick={() => send('in')}>＋</button>
        <button type="button" className="chip bg-forest-950/80 text-ivory" aria-label="Perkecil peta" onClick={() => send('out')}>－</button>
      </div>
      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        <button type="button" className="chip bg-forest-950/80 text-ivory" onClick={() => { onSelect(null); send('reset'); }}>Seluruh provinsi</button>
        {hasWebGL() && (
          <button type="button" className="chip bg-forest-950/80 text-ivory" onClick={() => { setHover(null); setCommand(null); setMode(mode === '3d' ? '2d' : '3d'); }}>
            Tampilan {mode === '3d' ? '2D' : '3D'}
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex flex-wrap items-end justify-between gap-2 text-xs">
        <div className="rounded-xl bg-forest-950/85 px-3 py-2">
          <p className="m-0 font-bold text-gold-300">{visited.size} dari {ADMIN.length} wilayah dijelajahi</p>
          <p className="m-0 mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {[['#4f7a4d', 'Kabupaten'], ['#b4603f', 'Kota'], ['#2f7f95', 'Danau Toba'], ['#8da35c', 'Sudah dikunjungi']].map(([c, label]) => (
              <span key={label} className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm" style={{ background: c }} />{label}</span>
            ))}
          </p>
        </div>
        <a className="pointer-events-auto rounded-lg bg-forest-950/85 px-2 py-1 underline" href="https://www.geoboundaries.org" target="_blank" rel="noreferrer">
          Batas: geoBoundaries / BPS 2020, CC BY 3.0 IGO (disederhanakan)
        </a>
      </div>
    </div>
  );
}
