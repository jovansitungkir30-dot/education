import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import type { OrbitControls as OrbitImpl } from 'three-stdlib';
import type { Diorama } from '../../data/dioramas';
import { prefersReducedMotion } from '../device';
import Stage from '../Stage';
import LandmarkScene, { LANDMARK_SCALE } from './LandmarkScene';

/** Each scene is its own chunk, so only the chosen one is downloaded. */
const SCENES: Record<string, ComponentType> = {
  samosir: lazy(() => import('./Samosir')),
  karo: lazy(() => import('./Karo')),
  'mandailing-natal': lazy(() => import('./Mandailing')),
  'nias-selatan': lazy(() => import('./NiasSelatan')),
};

type Dots = React.RefObject<(HTMLButtonElement | null)[]>;

function Rig({ diorama, active, spin, reset, dots, onReady }: { diorama: Diorama; active: number | null; spin: boolean; reset: number; dots: Dots; onReady: () => void }) {
  const controls = useRef<OrbitImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const goal = useRef<{ target: Vector3; distance: number } | null>(null);
  const point = useRef(new Vector3());
  const home = MathUtils.clamp(39 / Math.min(aspect, 1.2) ** 0.85, 34, 64);

  // Hand-built dioramas use scene coordinates; landmark studies use model coordinates.
  const positions = diorama.id in SCENES ? diorama.spots.map((s) => s.position) : diorama.spots.map((s) => s.position.map((v) => v * LANDMARK_SCALE) as [number, number, number]);

  useEffect(onReady, []);

  // Intro: start far away and settle into the overview.
  useEffect(() => {
    const dir = new Vector3(0.42, 0.56, 0.78).normalize();
    camera.position.copy(dir.multiplyScalar(prefersReducedMotion() ? home : home * 1.55));
    controls.current?.target.set(0, 1, 0);
    goal.current = { target: new Vector3(0, 1, 0), distance: home };
  }, [diorama.id, reset, aspect]);

  useEffect(() => {
    if (active === null) return;
    goal.current = { target: new Vector3(...positions[active]), distance: home * 0.55 };
  }, [active]);

  useFrame(({ size }, dt) => {
    const c = controls.current;
    if (!c) return;
    const g = goal.current;
    if (g) {
      const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 3.4);
      const offset = camera.position.clone().sub(c.target);
      offset.setLength(MathUtils.lerp(offset.length(), g.distance, k));
      c.target.lerp(g.target, k);
      camera.position.copy(c.target).add(offset);
      c.update();
      if (c.target.distanceTo(g.target) < 0.02 && Math.abs(offset.length() - g.distance) < 0.05) goal.current = null;
    }
    positions.forEach((position, i) => {
      const el = dots.current[i];
      if (!el) return;
      point.current.set(...position).project(camera);
      const x = ((point.current.x + 1) / 2) * size.width;
      const y = ((1 - point.current.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.visibility = point.current.z < 1 && x > 0 && x < size.width && y > 0 && y < size.height ? 'visible' : 'hidden';
    });
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      autoRotate={spin && !prefersReducedMotion()}
      autoRotateSpeed={0.45}
      minDistance={11}
      maxDistance={72}
      minPolarAngle={0.25}
      maxPolarAngle={1.42}
      onStart={() => (goal.current = null)}
    />
  );
}

interface Props {
  diorama: Diorama;
  active: number | null;
  found: Set<string>;
  spin: boolean;
  reset: number;
  onSpot: (i: number) => void;
}

export default function DioramaCanvas({ diorama, active, found, spin, reset, onSpot }: Props) {
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const Scene = SCENES[diorama.id];
  return (
    <>
      <Stage
        label={`Diorama 3D: ${diorama.title}. Geser untuk memutar, cubit atau gulir untuk memperbesar.`}
        camera={{ fov: 30, position: [18, 17, 25], far: 220 }}
        fallback={<div className="grid h-full place-items-center p-8 text-center"><p className="max-w-sm">Perangkat ini tidak dapat menampilkan 3D. Semua materi tetap tersedia di daftar titik info.</p></div>}
      >
        <color attach="background" args={['#bcd3cb']} />
        <fog attach="fog" args={['#bcd3cb', 70, 150]} />
        <hemisphereLight args={['#fdf1d8', '#4d5f45', 1.25]} />
        <directionalLight position={[12, 18, 10]} intensity={2.6} color="#ffe0b0" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-far={60} />
        <directionalLight position={[-14, 8, -6]} intensity={0.75} color="#b9d8e8" />
        <Suspense fallback={null}>
          {Scene ? <Scene /> : <LandmarkScene id={diorama.id} />}
          <Rig diorama={diorama} active={active} spin={spin} reset={reset} dots={dots} onReady={() => setReady(true)} />
        </Suspense>
      </Stage>
      {!ready && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-forest-900/60 font-bold" role="status">Menyusun diorama…</div>}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {diorama.spots.map((spot, i) => (
          <button
            key={`${diorama.id}-${spot.id}`}
            ref={(el) => { dots.current[i] = el; }}
            type="button"
            onClick={() => onSpot(i)}
            aria-pressed={active === i}
            aria-label={`Titik temuan ${i + 1}: ${spot.title}`}
            style={{ visibility: 'hidden' }}
            className={`pointer-events-auto absolute top-0 left-0 grid size-10 cursor-pointer place-items-center rounded-full border-2 text-sm font-extrabold shadow-xl ${
              active === i ? 'border-ivory bg-terracotta-500 text-ivory' : found.has(spot.id) ? 'border-forest-950 bg-gold-500 text-forest-950' : 'border-gold-300 bg-forest-950/90 text-gold-300'
            }`}
          >
            {found.has(spot.id) && active !== i ? '✓' : i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
