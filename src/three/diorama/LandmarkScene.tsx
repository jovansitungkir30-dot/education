/**
 * Full-size study of one landmark. The surroundings follow the broad geography of the area (coast,
 * island, river, highland, town, open site or lowland). They are illustrative, not a survey of the place.
 */
import { useMemo } from 'react';
import { ContactShadows } from '@react-three/drei';
import { DoubleSide } from 'three';
import { districtById } from '../../data/atlas';
import { landmarkGeometry } from '../mini';
import { Bushes, Grass, Mountain, Palm, Patch, Pines, Plinth, Rocks, Water, rng, type Keep } from './kit';

export type Setting = 'pesisir' | 'pulau' | 'sungai' | 'dataran-tinggi' | 'tepi-danau' | 'kota' | 'situs' | 'dataran';

export const SETTINGS: Record<Setting, string> = {
  pesisir: 'tepi laut', pulau: 'lingkungan pulau', sungai: 'tepi sungai', 'dataran-tinggi': 'dataran tinggi berbukit',
  'tepi-danau': 'tepi danau', kota: 'lingkungan kota', situs: 'lapangan situs terbuka', dataran: 'dataran rendah hijau',
};

const BY_AREA: Record<string, Setting> = {
  'kota-sibolga': 'pesisir', 'tapanuli-tengah': 'pesisir',
  nias: 'pulau', 'nias-utara': 'pulau', 'nias-barat': 'pulau', 'kota-gunungsitoli': 'pulau',
  asahan: 'sungai', 'kota-tanjungbalai': 'sungai',
  toba: 'tepi-danau',
  simalungun: 'dataran-tinggi', dairi: 'dataran-tinggi', 'pakpak-bharat': 'dataran-tinggi', 'humbang-hasundutan': 'dataran-tinggi',
  'tapanuli-utara': 'dataran-tinggi', 'tapanuli-selatan': 'dataran-tinggi', 'kota-padangsidimpuan': 'dataran-tinggi',
  'padang-lawas': 'situs', 'padang-lawas-utara': 'situs', 'deli-serdang': 'situs', 'labuhanbatu-selatan': 'situs',
};

export const settingFor = (id: string): Setting => BY_AREA[id] ?? (districtById(id)?.type === 'kota' ? 'kota' : 'dataran');

/** Plain building blocks suggesting a town street behind the landmark. */
function TownBackdrop({ seed }: { seed: number }) {
  const blocks = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: 11 }, (_, i) => {
      const a = Math.PI * (1.08 + (i / 10) * 0.84);
      const d = 8.4 + (i % 2) * 0.7;
      return { i, x: Math.cos(a) * d, z: Math.sin(a) * d, w: 0.9 + r() * 0.5, h: 0.7 + r() * 0.8, turn: -a - Math.PI / 2 };
    });
  }, [seed]);
  return (
    <>
      {blocks.map((b) => (
        <group key={b.i} position={[b.x, 0, b.z]} rotation={[0, b.turn, 0]}>
          <mesh position={[0, b.h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, 0.9]} />
            <meshStandardMaterial color={['#ddd3bd', '#c9bfa8', '#d8c7a6'][b.i % 3]} roughness={0.9} />
          </mesh>
          <mesh position={[0, b.h + 0.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[b.w * 0.78, 0.42, 4]} />
            <meshStandardMaterial color={['#9c5239', '#7d4a38', '#6f6a62'][b.i % 3]} roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
      {[-5.6, 5.6].flatMap((x) => [1.5, 4.5].map((z) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.04, 0.06, 1.6, 8]} /><meshStandardMaterial color="#3d4448" /></mesh>
          <mesh position={[0, 1.66, 0]}><sphereGeometry args={[0.13, 10, 8]} /><meshStandardMaterial color="#ffe6a8" emissive="#ffcf6b" emissiveIntensity={0.6} /></mesh>
        </group>
      )))}
    </>
  );
}

/** A narrow band of water crossing the front of the plinth. */
function River() {
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => {
        const x = -8 + i * 2;
        return <Water key={i} position={[x, 0.07, 7 + Math.sin(i * 0.9) * 0.45]} radius={1.35} scale={[1.15, 0.78]} />;
      })}
    </group>
  );
}

export default function LandmarkScene({ id }: { id: string }) {
  const geometry = useMemo(() => landmarkGeometry(id), [id]);
  const seed = useMemo(() => [...id].reduce((n, c) => n + c.charCodeAt(0), 7), [id]);
  const setting = settingFor(id);
  const wet = setting === 'pesisir' || setting === 'pulau' || setting === 'sungai';
  // Scatter plants outside the area the model itself occupies, and off the water.
  const keep: Keep = useMemo(
    () => (x, z) => Math.hypot(x, z * 1.1) < 6.2 || (z > 2 && Math.abs(x) < 4) || (wet && z > 5.2) || (setting === 'tepi-danau' && z < -6),
    [wet, setting],
  );
  const palms = useMemo(() => {
    const r = rng(seed);
    const count = setting === 'pulau' || setting === 'pesisir' ? 9 : setting === 'situs' || setting === 'kota' ? 3 : 6;
    return Array.from({ length: count }, (_, i) => {
      const a = Math.PI * (0.78 + (i / Math.max(1, count - 1)) * 1.44) + r() * 0.2;
      return { x: Math.cos(a) * (7.3 + r() * 2.2), z: Math.sin(a) * (7.3 + r() * 2.2), h: 2.6 + r() * 1.8, t: r() * 6 };
    });
  }, [seed, setting]);
  const highland = setting === 'dataran-tinggi' || setting === 'tepi-danau';

  return (
    <group>
      <Plinth />
      <mesh geometry={geometry} scale={LANDMARK_SCALE} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading side={DoubleSide} roughness={0.82} />
      </mesh>
      <ContactShadows position={[0, 0.015, 0]} scale={17} resolution={512} blur={2.2} opacity={0.55} far={3} frames={1} />

      {highland ? (
        <Pines seed={seed} keep={keep} count={setting === 'tepi-danau' ? 14 : 30} inner={6.8} />
      ) : (
        palms.map((p) => <Palm key={p.t} position={[p.x, 0, p.z]} height={p.h} turn={p.t} />)
      )}
      {setting === 'dataran-tinggi' && (
        <>
          <Mountain position={[-6.2, 0, -7.2]} radius={3.4} height={4.2} seed={seed} />
          <Mountain position={[0.8, 0, -8.6]} radius={2.8} height={3.1} seed={seed + 2} />
          <Mountain position={[6.4, 0, -6.6]} radius={3} height={3.6} seed={seed + 4} />
        </>
      )}
      {setting === 'tepi-danau' && <Water position={[0, 0.08, -7.6]} radius={4.4} scale={[1.5, 0.55]} />}
      {(setting === 'pesisir' || setting === 'pulau') && (
        <>
          {/* Sand, then shallow sea along the front edge. */}
          <Patch position={[0, 0.03, 6.1]} size={[12.6, 1.5]} map="soil" />
          <Water position={[0, 0.07, 8.35]} radius={4.6} scale={[1.42, 0.46]} />
        </>
      )}
      {setting === 'sungai' && <River />}
      {setting === 'kota' && (
        <>
          <Patch position={[0, 0.025, 5.3]} size={[12, 3]} map="paving" />
          <TownBackdrop seed={seed} />
        </>
      )}
      {setting === 'situs' && <Patch position={[0, 0.02, 5.4]} size={[3, 6.4]} map="soil" />}

      <Bushes seed={seed + 3} keep={keep} count={setting === 'kota' ? 24 : setting === 'situs' ? 20 : 55} inner={6.4} />
      <Rocks seed={seed + 5} keep={keep} inner={6.2} count={setting === 'situs' ? 70 : 40} />
      <Grass seed={seed + 9} keep={keep} count={setting === 'kota' ? 260 : 650} />
    </group>
  );
}

/** Model coordinates are scaled by the same factor as the mesh above. */
export const LANDMARK_SCALE = 1.28;
