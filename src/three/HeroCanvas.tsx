import { useRef, type ReactNode, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import Stage from './Stage';
import HeroScene, { type Look } from './HeroScene';

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
  return (
    <Stage
      label="Pemandangan 3D bergaya yang terinspirasi danau dataran tinggi, dengan rumah adat dan benda budaya melayang"
      camera={{ fov: 40, position: [6, 5, 13] }}
      fallback={fallback}
      onCreated={({ gl }) => { if (!gl) onReady(); }}
    >
      <HeroScene look={look} />
      <Ready onReady={onReady} />
    </Stage>
  );
}
