/** All 33 miniatures standing on the terrain, with leader lines where one had to move. */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { BufferGeometry, CanvasTexture, CircleGeometry, CylinderGeometry, DoubleSide, Float32BufferAttribute, MathUtils, MeshBasicMaterial, MeshStandardMaterial, type Group } from 'three';
import { districtById } from '../data/atlas';
import { PLACEMENTS, type Placement } from '../lib/placement';
import type { TerrainData } from '../lib/terrain';
import { landmarkGeometry } from './mini';

/** Height at which a miniature stands: the highest ground under its footprint, so hills do not bury it. */
export function standingHeight(data: TerrainData, p: Placement) {
  const r = p.scale * 3;
  let h = data.heightAt(p.at[0], p.at[1]);
  for (let a = 0; a < 6; a++) h = Math.max(h, data.heightAt(p.at[0] + Math.cos(a) * r, p.at[1] + Math.sin(a) * r));
  return h + 0.05;
}

/** Soft dark disc that seats a miniature on the ground. */
function shadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const c = canvas.getContext('2d')!;
  const g = c.createRadialGradient(64, 64, 20, 64, 64, 64);
  g.addColorStop(0, 'rgba(2,14,10,0.7)');
  g.addColorStop(0.65, 'rgba(2,14,10,0.38)');
  g.addColorStop(1, 'rgba(2,14,10,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}

/** Every miniature shares these, so 33 plinths cost one set of geometry and materials. */
function useShared() {
  const shared = useMemo(() => {
    const texture = shadowTexture();
    const solid = (color: string) => new MeshStandardMaterial({ color, roughness: 0.85 });
    return {
      texture,
      rim: new CylinderGeometry(1, 0.9, 1, 28),
      disc: new CylinderGeometry(1, 1, 1, 28),
      flat: new CircleGeometry(1, 28).rotateX(-Math.PI / 2),
      hit: new CylinderGeometry(1, 1, 1.5, 10),
      model: new MeshStandardMaterial({ vertexColors: true, flatShading: true, side: DoubleSide, roughness: 0.85, emissive: '#2a1c10', emissiveIntensity: 0.35 }),
      faded: new MeshStandardMaterial({ vertexColors: true, flatShading: true, side: DoubleSide, roughness: 1, transparent: true, opacity: 0.28, depthWrite: false }),
      active: solid('#e2c47c'),
      done: solid('#35a26a'),
      city: solid('#c47a54'),
      regency: solid('#e6dcc0'),
      ground: solid('#678c43'),
      shadow: new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
      ghost: new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    };
  }, []);
  useEffect(() => () => Object.values(shared).forEach((x) => x.dispose()), [shared]);
  return shared;
}

interface Props {
  data: TerrainData;
  hovered?: string | null;
  selected?: string | null;
  completed?: Set<string>;
  /** When set, only these areas stand out. */
  highlight?: string[] | null;
  onHover?: (id: string | null, e?: ThreeEvent<PointerEvent>) => void;
  onSelect?: (id: string) => void;
}

function Miniature({ p, data, shared, hovered, selected, done, dimmed, onHover, onSelect }: { p: Placement; data: TerrainData; shared: ReturnType<typeof useShared>; hovered: boolean; selected: boolean; done: boolean; dimmed: boolean } & Pick<Props, 'onHover' | 'onSelect'>) {
  const ref = useRef<Group>(null);
  const y = useMemo(() => standingHeight(data, p), [data, p]);
  const city = districtById(p.id)!.type === 'kota';
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = selected ? 1.9 : hovered ? 1.45 : dimmed ? 0.72 : 1;
    g.scale.setScalar(MathUtils.damp(g.scale.x, k, 10, dt));
  });
  const r = p.scale * 4.5;
  return (
    <group ref={ref} position={[p.at[0], y, -p.at[1]]}>
      <mesh geometry={shared.flat} material={shared.shadow} position={[r * 0.2, -0.045, r * 0.12]} scale={r * 1.45} />
      {/* Plinth: its rim colour distinguishes cities, and turns gold when active or green when fully explored. */}
      <mesh geometry={shared.rim} material={selected || hovered ? shared.active : done ? shared.done : city ? shared.city : shared.regency} position={[0, -0.035, 0]} scale={[r, 0.07, r]} />
      <mesh geometry={shared.disc} material={shared.ground} position={[0, 0.005, 0]} scale={[r * 0.88, 0.02, r * 0.88]} />
      <mesh geometry={landmarkGeometry(p.id)} material={dimmed ? shared.faded : shared.model} scale={p.scale} position={[0, 0.015, 0]} rotation={[0, -0.45, 0]} raycast={() => null} />
      {onSelect && (
        <mesh
          geometry={shared.hit}
          material={shared.ghost}
          position={[0, r * 0.7, 0]}
          scale={r}
          onPointerMove={(e) => { e.stopPropagation(); onHover?.(p.id, e); }}
          onPointerOut={() => onHover?.(null)}
          onClick={(e) => { e.stopPropagation(); if (e.delta <= 6) onSelect(p.id); }}
        />
      )}
    </group>
  );
}

export default function LandmarkLayer({ data, hovered = null, selected = null, completed, highlight = null, onHover, onSelect }: Props) {
  const shared = useShared();
  const moved = useMemo(() => PLACEMENTS.filter((p) => Math.hypot(p.at[0] - p.anchor[0], p.at[1] - p.anchor[1]) >= p.scale * 3), []);
  const leaders = useMemo(() => {
    const pos: number[] = [];
    for (const p of moved) pos.push(p.anchor[0], data.heightAt(p.anchor[0], p.anchor[1]) + 0.06, -p.anchor[1], p.at[0], standingHeight(data, p), -p.at[1]);
    return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(pos, 3));
  }, [data, moved]);
  useEffect(() => () => leaders.dispose(), [leaders]);

  return (
    <group>
      <lineSegments geometry={leaders}>
        <lineBasicMaterial color="#fff3c4" />
      </lineSegments>
      {moved.map((p) => (
        <mesh key={p.id} position={[p.anchor[0], data.heightAt(p.anchor[0], p.anchor[1]) + 0.06, -p.anchor[1]]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshBasicMaterial color="#ffd45e" />
        </mesh>
      ))}
      {PLACEMENTS.map((p) => (
        <Miniature key={p.id} p={p} data={data} shared={shared} hovered={hovered === p.id} selected={selected === p.id} done={!!completed?.has(p.id)} dimmed={!!highlight && !highlight.includes(p.id) && selected !== p.id} onHover={onHover} onSelect={onSelect} />
      ))}
    </group>
  );
}
