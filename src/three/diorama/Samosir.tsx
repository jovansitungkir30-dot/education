import { Box, Beam, RumahBolon } from '../models';
import { Bushes, Grass, Mountain, Palm, Patch, Pines, Plinth, Rocks, Water, inBox, type Keep } from './kit';

const lake = (x: number, z: number) => ((x - 0.5) / 7.2) ** 2 + ((z - 8) / 3.3) ** 2 < 1;
const keep: Keep = (x, z) => lake(x, z) || inBox(x, z, -2.4, -1.2, 5, 7) || inBox(x, z, 4.4, -2, 4.2, 6) || inBox(x, z, 0.6, 3, 11, 4) || z < -6.5;

/** A simple boat as lakeside scenery. It does not represent a particular boat tradition. */
function Boat() {
  return (
    <group position={[3.1, 0.12, 7.6]} rotation={[0, -0.35, 0]}>
      <Box p={[0, 0, 0]} s={[2, 0.18, 0.55]} color="#5a3820" />
      {[-0.3, 0.3].map((z) => <Box key={z} p={[0, 0.16, z]} s={[2.1, 0.2, 0.08]} color="#3f2718" />)}
      {[-1.15, 1.15].map((x) => <Box key={x} p={[x, 0.17, 0]} s={[0.35, 0.16, 0.35]} r={[0, 0, Math.sign(x) * 0.5]} color="#3f2718" />)}
    </group>
  );
}

export default function SamosirDiorama() {
  return (
    <group>
      <Plinth />
      <Water position={[0.5, 0.05, 7.4]} radius={4.4} scale={[1.55, 0.62]} />
      <Patch position={[0.6, 0.012, 2.9]} size={[10.5, 3.8]} map="soil" />
      <group position={[-2.4, 0, -1.2]} rotation={[0, 0.12, 0]}><RumahBolon /></group>
      <group position={[4.4, 0, -2]} rotation={[0, -0.35, 0]} scale={0.82}><RumahBolon /></group>
      {/* Walkway to the water. */}
      {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[1.1, 0.07, 4.4 + i * 0.4]} s={[1, 0.08, 0.32]} color="#7a5533" />)}
      {[4.5, 6, 7.5].flatMap((z) => [0.65, 1.55].map((x) => <Beam key={`${x}${z}`} a={[x, -0.1, z]} b={[x, 0.45, z]} radius={0.06} />))}
      <Boat />
      <Mountain position={[-6.2, 0, -7.2]} radius={3.6} height={3.4} seed={2} />
      <Mountain position={[0.4, 0, -8.6]} radius={4} height={4.2} seed={5} />
      <Mountain position={[6.4, 0, -7]} radius={3.4} height={3} seed={9} />
      <Palm position={[-6.6, 0, 3.2]} height={3.6} turn={0.6} />
      <Palm position={[-7.6, 0, 1.4]} height={2.8} turn={2.4} />
      <Palm position={[7.6, 0, 2]} height={3.2} turn={4} />
      <Pines seed={11} keep={keep} count={20} />
      <Bushes seed={23} keep={keep} />
      <Rocks seed={31} keep={keep} />
      <Grass seed={47} keep={keep} />
    </group>
  );
}
