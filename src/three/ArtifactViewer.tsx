import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Bounds, OrbitControls, useBounds } from '@react-three/drei';
import { Vector3, type Group } from 'three';
import type { OrbitControls as OrbitImpl } from 'three-stdlib';
import type { Artifact } from '../data/artifacts';
import { MODELS } from './models';
import { prefersReducedMotion } from './device';
import Stage from './Stage';

export type ViewCommand = { type: 'left' | 'right' | 'in' | 'out' | 'reset'; n: number } | null;

interface Props {
  artifact: Artifact;
  hotspot: number | null;
  onHotspot: (i: number) => void;
  spin: boolean;
  command: ViewCommand;
  showHotspots: boolean;
}

/** Frames the model whenever it changes or the view is reset. */
function Fit({ target, trigger }: { target: React.RefObject<Group | null>; trigger: string }) {
  const bounds = useBounds();
  useEffect(() => {
    if (target.current) bounds.refresh(target.current).clip().fit();
  }, [bounds, target, trigger]);
  return null;
}

/** Moves the HTML hotspot buttons to follow their 3D positions on screen. */
function Project({ points, dots }: { points: Artifact['hotspots']; dots: React.RefObject<(HTMLButtonElement | null)[]> }) {
  const v = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    points.forEach((h, i) => {
      const el = dots.current[i];
      if (!el) return;
      v.current.set(...h.position).project(camera);
      const x = ((v.current.x + 1) / 2) * size.width;
      const y = ((1 - v.current.y) / 2) * size.height;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      el.style.visibility = v.current.z < 1 && x >= 0 && x <= size.width && y >= 0 && y <= size.height ? 'visible' : 'hidden';
    });
  });
  return null;
}

type SceneProps = Pick<Props, 'artifact' | 'spin' | 'command'> & { dots: React.RefObject<(HTMLButtonElement | null)[]> };

function Scene({ artifact, spin, command, dots }: SceneProps) {
  const controls = useRef<OrbitImpl>(null);
  const model = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  const Model = MODELS[artifact.id];
  const resetKey = command?.type === 'reset' ? command.n : 0;

  useEffect(() => {
    camera.position.set(...artifact.camera);
  }, [artifact, camera, resetKey]);

  // Button controls give keyboard users the same rotate and zoom actions as dragging.
  useEffect(() => {
    const c = controls.current;
    if (!c || !command || command.type === 'reset') return;
    const offset = camera.position.clone().sub(c.target);
    if (command.type === 'left' || command.type === 'right') {
      offset.applyAxisAngle(camera.up, command.type === 'left' ? -Math.PI / 8 : Math.PI / 8);
    } else {
      offset.multiplyScalar(command.type === 'in' ? 0.82 : 1.22);
    }
    camera.position.copy(c.target).add(offset);
    c.update();
  }, [command, camera]);

  return (
    <>
      <color attach="background" args={['#122a21']} />
      <hemisphereLight args={['#fff1d6', '#20352b', 1.5]} />
      <directionalLight position={[6, 10, 7]} intensity={2.4} color="#ffdfb0" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-7, 4, -5]} intensity={0.8} color="#8fc3be" />
      <Bounds margin={1.3} maxDuration={0.7}>
        <group ref={model} key={artifact.id}>
          <Model />
        </group>
        <Fit target={model} trigger={`${artifact.id}-${resetKey}`} />
      </Bounds>
      <Project points={artifact.hotspots} dots={dots} />
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        autoRotate={spin && !prefersReducedMotion()}
        autoRotateSpeed={1}
        minDistance={2.5}
        maxDistance={24}
        maxPolarAngle={Math.PI * 0.56}
      />
    </>
  );
}

export default function ArtifactViewer({ artifact, hotspot, onHotspot, spin, command, showHotspots }: Props) {
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <>
      <Stage
        label={`Model 3D interaktif: ${artifact.name}. Geser untuk memutar, cubit atau gulir untuk memperbesar.`}
        camera={{ position: artifact.camera, fov: 40 }}
        fallback={
          <div className="grid h-full place-items-center p-8 text-center">
            <p className="max-w-sm">Perangkat ini tidak dapat menampilkan 3D. Deskripsi dan catatan bernomor di dekat panel ini memuat materi yang sama.</p>
          </div>
        }
      >
        <Scene artifact={artifact} spin={spin} command={command} dots={dots} />
      </Stage>
      {showHotspots && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {artifact.hotspots.map((h, i) => (
            <button
              key={`${artifact.id}-${i}`}
              ref={(el) => { dots.current[i] = el; }}
              type="button"
              onClick={() => onHotspot(i)}
              aria-pressed={hotspot === i}
              aria-label={`Titik info ${i + 1}: ${h.label}`}
              style={{ visibility: 'hidden' }}
              className={`pointer-events-auto absolute top-0 left-0 grid size-9 cursor-pointer place-items-center rounded-full border-2 text-sm font-extrabold shadow-lg ${
                hotspot === i ? 'border-ivory bg-gold-500 text-forest-950' : 'border-gold-300 bg-forest-950/85 text-gold-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
