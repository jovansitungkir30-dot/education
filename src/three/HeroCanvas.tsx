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
      label="Stylised 3D landscape inspired by a highland lake, with a traditional house and floating cultural objects"
      camera={{ fov: 40, position: [6, 5, 13] }}
      fallback={fallback}
      onCreated={({ gl }) => { if (!gl) onReady(); }}
    >
      <HeroScene look={look} />
      <Ready onReady={onReady} />
    </Stage>
  );
}
