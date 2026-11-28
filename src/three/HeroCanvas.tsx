import { useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import Stage from './Stage';
import HeroMapScene, { LANDMARKS, type Look } from './HeroMapScene';
import { districtById } from '../data/atlas';
import { hasWebGL } from './device';
import { href } from '../lib/router';

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

/** Split into its own chunk so the page text appears before three.js downloads. */
export default function HeroCanvas({ look, onReady, fallback }: { look: RefObject<Look>; onReady: () => void; fallback: ReactNode }) {
  const dots = useRef<(HTMLAnchorElement | null)[]>([]);
  return (
    <>
      <Stage
        label="Peta 3D Sumatera Utara dengan batas kabupaten dan kota, Danau Toba, serta miniatur rumah adat di empat wilayah"
        camera={{ fov: 32, position: [0, 28, 30], far: 220 }}
        fallback={fallback}
        onCreated={({ gl }) => { if (!gl) onReady(); }}
      >
        <HeroMapScene look={look} dots={dots} />
        <Ready onReady={onReady} />
      </Stage>
      {hasWebGL() && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {LANDMARKS.map((l, i) => (
            <a
              key={l.id}
              ref={(el) => { dots.current[i] = el; }}
              href={href('/explore', { wilayah: l.id, diorama: '1' })}
              onPointerDown={(e) => e.stopPropagation()}
              style={{ visibility: 'hidden' }}
              className="pointer-events-auto absolute top-0 left-0 flex flex-col items-center"
              aria-label={`Masuk ke diorama ${districtById(l.id)!.name}`}
            >
              <span className="rounded-full border border-gold-300 bg-forest-950/90 px-3 py-1.5 text-[11px] font-extrabold whitespace-nowrap text-ivory shadow-lg hover:bg-gold-500 hover:text-forest-950 sm:text-xs">{districtById(l.id)!.name}</span>
              <span className="h-4 w-px bg-gold-300" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}
