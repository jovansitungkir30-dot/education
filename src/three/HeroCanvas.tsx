import { useRef, type ReactNode, type RefObject } from 'react';
import Stage from './Stage';
import HeroMapScene, { FEATURED, type Look } from './HeroMapScene';
import { districtById } from '../data/atlas';
import { hasWebGL } from './device';
import { href } from '../lib/router';

/** Split into its own chunk so the page text appears before three.js downloads. */
export default function HeroCanvas({ look, onReady, fallback }: { look: RefObject<Look>; onReady: () => void; fallback: ReactNode }) {
  const dots = useRef<(HTMLAnchorElement | null)[]>([]);
  return (
    <>
      <Stage
        label="Peta 3D Sumatera Utara dengan miniatur landmark di setiap kabupaten dan kota"
        camera={{ fov: 32, position: [0, 28, 30], far: 220 }}
        fallback={fallback}
        onCreated={({ gl }) => { if (!gl) onReady(); }}
      >
        <HeroMapScene look={look} dots={dots} onReady={onReady} />
      </Stage>
      {hasWebGL() && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {FEATURED.map((id, i) => (
            <a
              key={id}
              ref={(el) => { dots.current[i] = el; }}
              href={href('/wilayah', { id })}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ visibility: 'hidden' }}
              className="pointer-events-auto absolute top-0 left-0 flex flex-col items-center"
              aria-label={`Jelajahi ${districtById(id)!.name}`}
            >
              <span className="rounded-full border border-gold-300 bg-forest-950/90 px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap text-ivory shadow-lg hover:bg-gold-500 hover:text-forest-950 sm:text-xs">{districtById(id)!.name}</span>
              <span className="h-4 w-px bg-gold-300" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}
