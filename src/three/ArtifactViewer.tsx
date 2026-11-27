import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Bounds, Html, OrbitControls, useBounds } from '@react-three/drei';
import type { Group } from 'three';
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

function Scene({ artifact, hotspot, onHotspot, spin, command, showHotspots }: Props) {
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
      <Bounds margin={1.15} maxDuration={0.7}>
        <group ref={model} key={artifact.id}>
          <Model />
        </group>
        <Fit target={model} trigger={`${artifact.id}-${resetKey}`} />
      </Bounds>
      {showHotspots &&
        artifact.hotspots.map((h, i) => (
          <Html key={`${artifact.id}-${i}`} position={h.position} center zIndexRange={[20, 0]}>
            <button
              type="button"
              onClick={() => onHotspot(i)}
              aria-pressed={hotspot === i}
              aria-label={`Hotspot ${i + 1}: ${h.label}`}
              className={`grid size-9 cursor-pointer place-items-center rounded-full border-2 text-sm font-extrabold shadow-lg ${
                hotspot === i ? 'border-ivory bg-gold-500 text-forest-950' : 'border-gold-300 bg-forest-950/85 text-gold-300'
              }`}
            >
              {i + 1}
            </button>
          </Html>
        ))}
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

export default function ArtifactViewer(props: Props) {
  return (
    <Stage
      label={`Interactive 3D model: ${props.artifact.name}. Drag to rotate, pinch or scroll to zoom.`}
      camera={{ position: props.artifact.camera, fov: 40 }}
      fallback={
        <div className="grid h-full place-items-center p-8 text-center">
          <p className="max-w-sm">3D rendering is not available on this device. The description and numbered notes beside this panel contain the same learning content.</p>
        </div>
      }
    >
      <Scene {...props} />
    </Stage>
  );
}
