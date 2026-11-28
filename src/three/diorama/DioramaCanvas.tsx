import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MathUtils, PerspectiveCamera, Spherical, Vector3, type Group, type Mesh } from 'three';
import type { OrbitControls as OrbitImpl } from 'three-stdlib';
import type { Diorama } from '../../data/dioramas';
import { prefersReducedMotion } from '../device';
import Stage from '../Stage';
import LandmarkScene, { LANDMARK_SCALE, settingFor } from './LandmarkScene';
import Environment, { type Mood } from './Environment';

/** Each scene is its own chunk, so only the chosen one is downloaded. */
const SCENES: Record<string, ComponentType> = {
  samosir: lazy(() => import('./Samosir')),
  karo: lazy(() => import('./Karo')),
  'mandailing-natal': lazy(() => import('./Mandailing')),
  'nias-selatan': lazy(() => import('./NiasSelatan')),
};

type Dots = React.RefObject<(HTMLButtonElement | null)[]>;

/** Hand-built dioramas use scene coordinates; landmark studies use model coordinates. */
const spotPositions = (diorama: Diorama) =>
  diorama.id in SCENES ? diorama.spots.map((s) => s.position) : diorama.spots.map((s) => s.position.map((v) => v * LANDMARK_SCALE) as [number, number, number]);

/** A pulsing light that marks the part of the scene being explained. */
function Beacon({ position }: { position: [number, number, number] }) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const still = prefersReducedMotion();
  useFrame(({ clock, camera }) => {
    if (!group.current || !ring.current) return;
    const t = still ? 0.4 : (clock.elapsedTime % 1.5) / 1.5;
    ring.current.scale.setScalar(0.5 + t * 1.1);
    (ring.current.material as unknown as { opacity: number }).opacity = 1 - t;
    ring.current.lookAt(camera.position);
  });
  return (
    <group ref={group} position={position}>
      <mesh ref={ring} renderOrder={5}><ringGeometry args={[0.62, 0.74, 40]} /><meshBasicMaterial color="#ffd45e" transparent depthTest={false} /></mesh>
      <pointLight color="#ffcf66" intensity={7} distance={4.5} position={[0, 0.5, 0.7]} />
    </group>
  );
}

function Rig({ diorama, active, spin, reset, dots, lift, onReady }: { lift: boolean; diorama: Diorama; active: number | null; spin: boolean; reset: number; dots: Dots; onReady: () => void }) {
  const controls = useRef<OrbitImpl>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  const goal = useRef<{ target: Vector3; distance: number; azimuth?: number; polar?: number } | null>(null);
  const point = useRef(new Vector3());
  const home = MathUtils.clamp(39 / Math.min(aspect, 1.2) ** 0.85, 34, 64);

  const positions = spotPositions(diorama);

  useEffect(onReady, []);

  // While a caption covers the bottom of the view, the subject is framed higher.
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (lift) camera.setViewOffset(size.width, size.height, 0, size.height * 0.17, size.width, size.height);
    else camera.clearViewOffset();
  }, [lift, size, camera]);

  // Intro: start far away and settle into the overview.
  useEffect(() => {
    const dir = new Vector3(0.42, 0.56, 0.78).normalize();
    camera.position.copy(dir.multiplyScalar(prefersReducedMotion() ? home : home * 1.55));
    controls.current?.target.set(0, 1, 0);
    goal.current = { target: new Vector3(0, 1, 0), distance: home };
  }, [diorama.id, reset, aspect]);

  useEffect(() => {
    if (active === null) return;
    const [x, y, z] = positions[active];
    // Look from the side of the scene on which the part sits, never from behind the diorama.
    goal.current = { target: new Vector3(x, y, z), distance: home * 0.5, azimuth: MathUtils.clamp(Math.atan2(x, Math.max(z, 0) + 4.5), -0.95, 0.95), polar: y > 3 ? 1.22 : 1.02 };
  }, [active]);

  useFrame(({ size }, dt) => {
    const c = controls.current;
    if (!c) return;
    const g = goal.current;
    if (g) {
      const k = prefersReducedMotion() ? 1 : 1 - Math.exp(-dt * 2.8);
      const now = new Spherical().setFromVector3(camera.position.clone().sub(c.target));
      now.radius = MathUtils.lerp(now.radius, g.distance, k);
      if (g.azimuth !== undefined) {
        const turn = Math.atan2(Math.sin(g.azimuth - now.theta), Math.cos(g.azimuth - now.theta));
        now.theta += turn * k;
        now.phi = MathUtils.lerp(now.phi, g.polar!, k);
      }
      c.target.lerp(g.target, k);
      camera.position.setFromSpherical(now).add(c.target);
      c.update();
      if (c.target.distanceTo(g.target) < 0.02 && Math.abs(now.radius - g.distance) < 0.05) goal.current = null;
    }
    // Panning stays near the diorama.
    const reach = Math.hypot(c.target.x, c.target.z);
    if (reach > 8 || c.target.y < 0 || c.target.y > 6) {
      const back = c.target.clone();
      if (reach > 8) { back.x *= 8 / reach; back.z *= 8 / reach; }
      back.y = MathUtils.clamp(back.y, 0, 6);
      camera.position.add(back.clone().sub(c.target));
      c.target.copy(back);
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
  mood: Mood;
  /** True while a caption is shown over the scene. */
  lift?: boolean;
  onSpot: (i: number) => void;
}

export default function DioramaCanvas({ diorama, active, found, spin, reset, mood, lift = false, onSpot }: Props) {
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const Scene = SCENES[diorama.id];
  return (
    <>
      <Stage
        label={`Diorama 3D: ${diorama.title}. Geser untuk memutar, cubit atau gulir untuk memperbesar, geser dengan dua jari atau tombol kanan untuk berpindah.`}
        camera={{ fov: 30, position: [18, 17, 25], far: 420 }}
        fallback={<div className="grid h-full place-items-center p-8 text-center"><p className="max-w-sm">Perangkat ini tidak dapat menampilkan 3D. Semua materi tetap tersedia di daftar titik info.</p></div>}
      >
        <Environment mood={mood} seed={[...diorama.id].reduce((n, c) => n + c.charCodeAt(0), 3)} sea={['pesisir', 'pulau'].includes(settingFor(diorama.id))} />
        <Suspense fallback={null}>
          {Scene ? <Scene /> : <LandmarkScene id={diorama.id} />}
          {active !== null && <Beacon position={spotPositions(diorama)[active]} />}
          <Rig lift={lift} diorama={diorama} active={active} spin={spin} reset={reset} dots={dots} onReady={() => setReady(true)} />
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
