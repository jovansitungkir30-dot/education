/** Full-size study of one landmark in a small landscape. Vegetation and ground are illustrative. */
import { useMemo } from 'react';
import { DoubleSide } from 'three';
import { districtById } from '../../data/atlas';
import { landmarkGeometry } from '../mini';
import { Bushes, Grass, Palm, Pines, Plinth, Rocks, rng, type Keep } from './kit';

/** Areas whose surroundings are better suggested with palms than with conifers. */
const HIGHLAND = new Set(['simalungun', 'dairi', 'pakpak-bharat', 'humbang-hasundutan', 'tapanuli-utara', 'toba', 'tapanuli-selatan', 'kota-padangsidimpuan']);

export default function LandmarkScene({ id }: { id: string }) {
  const geometry = useMemo(() => landmarkGeometry(id), [id]);
  const seed = useMemo(() => [...id].reduce((n, c) => n + c.charCodeAt(0), 7), [id]);
  // Scatter plants outside the area the model itself occupies.
  const keep: Keep = useMemo(() => (x, z) => Math.hypot(x, z * 1.1) < 6.2 || (z > 2 && Math.abs(x) < 4), []);
  const palms = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI * (0.75 + i * 0.3) + r() * 0.2;
      return { x: Math.cos(a) * (7.4 + r() * 2), z: Math.sin(a) * (7.4 + r() * 2), h: 2.8 + r() * 1.6, t: r() * 6 };
    });
  }, [seed]);

  return (
    <group>
      <Plinth />
      <mesh geometry={geometry} scale={1.28} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading side={DoubleSide} roughness={0.85} />
      </mesh>
      {HIGHLAND.has(id) ? (
        <Pines seed={seed} keep={keep} count={30} inner={6.8} />
      ) : (
        palms.map((p) => <Palm key={p.t} position={[p.x, 0, p.z]} height={p.h} turn={p.t} />)
      )}
      <Bushes seed={seed + 3} keep={keep} count={districtById(id)?.type === 'kota' ? 30 : 55} inner={6.4} />
      <Rocks seed={seed + 5} keep={keep} inner={6.2} />
      <Grass seed={seed + 9} keep={keep} count={650} />
    </group>
  );
}

/** Model coordinates are scaled by the same factor as the mesh above. */
export const LANDMARK_SCALE = 1.28;
