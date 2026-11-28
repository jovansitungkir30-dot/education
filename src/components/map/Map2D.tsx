import { useEffect, useMemo, useState, useRef, type PointerEvent } from 'react';
import { DISTRICTS, districtById, fullName } from '../../data/atlas';
import { HALF_HEIGHT, HALF_WIDTH, shapeOf, svgPath } from '../../lib/geo';
import type { Map3DProps } from './Map3D';

const FULL = { x: -HALF_WIDTH - 0.5, y: -HALF_HEIGHT - 0.5, w: HALF_WIDTH * 2 + 1, h: HALF_HEIGHT * 2 + 1 };

/** Flat SVG version of the atlas: the fallback without WebGL, and an option for lighter devices. */
export default function Map2D({ selected, hovered, visited, command, onHover, onSelect }: Pick<Map3DProps, 'selected' | 'hovered' | 'visited' | 'command' | 'onHover' | 'onSelect'>) {
  const paths = useMemo(() => DISTRICTS.map((d) => ({ d, path: svgPath(d) })), []);
  const [view, setView] = useState(FULL);
  const drag = useRef<{ x: number; y: number; moved: number } | null>(null);

  useEffect(() => {
    const d = districtById(selected);
    if (!d) return setView(FULL);
    const { center, span } = shapeOf(d);
    const w = Math.max(span * 2.2, 4);
    const h = w * (FULL.h / FULL.w);
    setView({ x: center[0] - w / 2, y: -center[1] - h / 2, w, h });
  }, [selected]);

  useEffect(() => {
    if (!command) return;
    if (command.type === 'reset') return setView(FULL);
    const k = command.type === 'in' ? 0.72 : 1.38;
    setView((v) => {
      const w = Math.min(FULL.w * 1.2, Math.max(2, v.w * k));
      const h = w * (v.h / v.w);
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
    });
  }, [command]);

  const pan = (e: PointerEvent<SVGSVGElement>) => {
    const start = drag.current;
    if (!start) return;
    const box = e.currentTarget.getBoundingClientRect();
    const unit = Math.max(view.w / box.width, view.h / box.height);
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start.moved += Math.abs(dx) + Math.abs(dy);
    start.x = e.clientX;
    start.y = e.clientY;
    setView((v) => ({ ...v, x: v.x - dx * unit, y: v.y - dy * unit }));
  };

  return (
    <svg
      className="size-full touch-pan-y bg-[#17474f] select-none"
      viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
      role="group"
      aria-label="Peta 2D Sumatera Utara"
      onPointerDown={(e) => (drag.current = { x: e.clientX, y: e.clientY, moved: 0 })}
      onPointerMove={pan}
      onPointerLeave={() => { drag.current = null; onHover(null); }}
      onPointerUp={() => window.setTimeout(() => (drag.current = null))}
    >
      {paths.map(({ d, path }) => {
        const fill = selected === d.id ? '#d9b153' : hovered === d.id ? '#e2c985' : visited.has(d.id) ? '#8da35c' : d.type === 'air' ? '#2f7f95' : d.type === 'kota' ? '#b4603f' : '#4f7a4d';
        return (
          <path
            key={d.id}
            d={path}
            fill={fill}
            stroke="#efe3c2"
            strokeWidth={selected === d.id ? 2 : 0.7}
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer outline-none focus-visible:fill-gold-300"
            tabIndex={0}
            role="button"
            aria-label={fullName(d)}
            aria-pressed={selected === d.id}
            data-id={d.id}
            onPointerMove={(e) => {
              const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
              onHover(d.id, { x: e.clientX - box.left, y: e.clientY - box.top });
            }}
            onClick={() => { if ((drag.current?.moved ?? 0) <= 6) onSelect(d.id); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(d.id); } }}
          />
        );
      })}
    </svg>
  );
}
