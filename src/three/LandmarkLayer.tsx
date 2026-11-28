/** All 33 miniatures standing on the terrain, with leader lines where one had to move. */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { BufferGeometry, DoubleSide, Float32BufferAttribute, MathUtils, MeshStandardMaterial, type Group } from 'three';
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

interface Props {
  data: TerrainData;
  hovered?: string | null;
  selected?: string | null;
  completed?: Set<string>;
  onHover?: (id: string | null, e?: ThreeEvent<PointerEvent>) => void;
  onSelect?: (id: string) => void;
}

function Miniature({ p, data, material, hovered, selected, done, onHover, onSelect }: { p: Placement; data: TerrainData; material: MeshStandardMaterial; hovered: boolean; selected: boolean; done: boolean } & Pick<Props, 'onHover' | 'onSelect'>) {
  const ref = useRef<Group>(null);
  const y = useMemo(() => standingHeight(data, p), [data, p]);
  const city = districtById(p.id)!.type === 'kota';
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = selected ? 1.9 : hovered ? 1.45 : 1;
    g.scale.setScalar(MathUtils.damp(g.scale.x, k, 10, dt));
  });
  const interactive = !!onSelect;
  const r = p.scale * 4.5;
  return (
    <group ref={ref} position={[p.at[0], y, -p.at[1]]}>
      {/* Plinth: its rim colour distinguishes cities, and turns gold when active or fully explored. */}
      <mesh position={[0, -0.035, 0]}>
        <cylinderGeometry args={[r, r * 0.9, 0.07, 24]} />
        <meshStandardMaterial color={selected || hovered ? '#ffd45e' : done ? '#35a26a' : city ? '#e59a6f' : '#eadfbd'} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[r * 0.88, r * 0.88, 0.02, 24]} />
        <meshStandardMaterial color="#6f9447" roughness={1} />
      </mesh>
      <mesh geometry={landmarkGeometry(p.id)} material={material} scale={p.scale} position={[0, 0.015, 0]} rotation={[0, -0.45, 0]} raycast={() => null} />
      {interactive && (
        <mesh
          position={[0, r * 0.7, 0]}
          onPointerMove={(e) => { e.stopPropagation(); onHover?.(p.id, e); }}
          onPointerOut={() => onHover?.(null)}
          onClick={(e) => { e.stopPropagation(); if (e.delta <= 6) onSelect!(p.id); }}
        >
          <cylinderGeometry args={[r, r, r * 1.5, 10]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export default function LandmarkLayer({ data, hovered = null, selected = null, completed, onHover, onSelect }: Props) {
  const material = useMemo(
    () => new MeshStandardMaterial({ vertexColors: true, flatShading: true, side: DoubleSide, roughness: 0.85, emissive: '#2a1c10', emissiveIntensity: 0.35 }),
    [],
  );
  const leaders = useMemo(() => {
    const pos: number[] = [];
    for (const p of PLACEMENTS) {
      if (Math.hypot(p.at[0] - p.anchor[0], p.at[1] - p.anchor[1]) < p.scale * 3) continue;
      pos.push(p.anchor[0], data.heightAt(p.anchor[0], p.anchor[1]) + 0.06, -p.anchor[1], p.at[0], standingHeight(data, p), -p.at[1]);
    }
    return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(pos, 3));
  }, [data]);
  const dots = useMemo(() => PLACEMENTS.filter((p) => Math.hypot(p.at[0] - p.anchor[0], p.at[1] - p.anchor[1]) >= p.scale * 3), []);
  useEffect(() => () => { material.dispose(); leaders.dispose(); }, [material, leaders]);

  return (
    <group>
      <lineSegments geometry={leaders}>
        <lineBasicMaterial color="#fff3c4" />
      </lineSegments>
      {dots.map((p) => (
        <mesh key={p.id} position={[p.anchor[0], data.heightAt(p.anchor[0], p.anchor[1]) + 0.06, -p.anchor[1]]}>
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshBasicMaterial color="#ffd45e" />
        </mesh>
      ))}
      {PLACEMENTS.map((p) => (
        <Miniature key={p.id} p={p} data={data} material={material} hovered={hovered === p.id} selected={selected === p.id} done={!!completed?.has(p.id)} onHover={onHover} onSelect={onSelect} />
      ))}
    </group>
  );
}
