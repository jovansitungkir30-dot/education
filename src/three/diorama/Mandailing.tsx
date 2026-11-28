/**
 * Illustrative composition based on a published description: the ruler's raised house, an open hall without
 * walls across a wide yard, and a triangular ornament on the front roof. Forms are not measured replicas.
 */
import { Box, GordangRow, Posts, Roof, Stairs } from '../models';
import { Bushes, Grass, Mountain, Palm, Patch, Pines, Plinth, Rocks, inBox, type Keep } from './kit';

const keep: Keep = (x, z) => inBox(x, z, -0.4, -3.4, 8, 5.4) || inBox(x, z, 5.4, 2.6, 5, 5.4) || inBox(x, z, -0.6, 1.4, 9, 6) || z < -7;

/** Triangle of small diamonds, standing for the bindu ornament. The pattern itself is abstract. */
function Bindu({ y, z }: { y: number; z: number }) {
  return (
    <group position={[0, y, z]}>
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 - row }, (_, i) => (
          <mesh key={`${row}-${i}`} position={[(i - (4 - row) / 2) * 0.27, row * 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.13, 0.13, 0.05]} />
            <meshStandardMaterial color={(row + i) % 2 ? '#efe6d2' : '#b23c25'} />
          </mesh>
        )),
      )}
    </group>
  );
}

function BagasGodang() {
  return (
    <group>
      <Posts xs={[-3, -2, -1, 0, 1, 2, 3]} zs={[-1.2, 0, 1.2]} height={1.25} radius={0.11} />
      <Box p={[0, 1.33, 0]} s={[6.5, 0.18, 2.9]} />
      <Box p={[0, 2.02, -0.1]} s={[6.2, 1.2, 2.5]} color="#5d3a22" />
      {[-2.4, -1.5, 1.5, 2.4].map((x) => <Box key={x} p={[x, 2.1, 1.17]} s={[0.42, 0.55, 0.05]} color="#1b110a" />)}
      <Box p={[0, 1.95, 1.17]} s={[0.7, 1, 0.05]} color="#150d08" />
      {Array.from({ length: 25 }, (_, i) => <Box key={i} p={[-3.12 + i * 0.26, 1.62, 1.4]} s={[0.07, 0.4, 0.07]} color="#8a6239" />)}
      <Box p={[0, 1.85, 1.4]} s={[6.4, 0.08, 0.1]} color="#8a6239" />
      {/* Main roof, ridge running along the width of the house. */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Roof gable="thatch" eaveY={2.62} ridgeY={3.85} halfWidth={1.85} eaveHalf={3.55} ridgeHalf={3.85} sweep={0.55} />
      </group>
      {/* Front gable over the stairs, carrying the triangular ornament. */}
      <group position={[0, 0, 1.15]}>
        <Roof gable="thatch" eaveY={2.7} ridgeY={4.25} halfWidth={1.15} eaveHalf={0.85} ridgeHalf={1.05} sweep={0.15} />
        <Bindu y={3} z={0.88} />
      </group>
      <Stairs z={1.5} top={1.33} width={1.3} />
    </group>
  );
}

/** Open public hall: posts and roof, no walls. The drum set inside shows scale and context. */
function SopoGodang() {
  return (
    <group>
      <Posts xs={[-1.9, -0.65, 0.65, 1.9]} zs={[-1.15, 1.15]} height={2.45} radius={0.12} />
      <Box p={[0, 0.5, 0]} s={[4.3, 0.16, 2.8]} />
      <Box p={[0, 2.5, 0]} s={[4.3, 0.14, 2.8]} color="#4a2d1a" />
      <group rotation={[0, Math.PI / 2, 0]}>
        <Roof gable="thatch" eaveY={2.62} ridgeY={3.8} halfWidth={1.75} eaveHalf={2.45} ridgeHalf={2.75} sweep={0.45} />
      </group>
      <group position={[0, 0.6, -0.25]} scale={0.62}><GordangRow /></group>
    </group>
  );
}

export default function MandailingDiorama() {
  return (
    <group>
      <Plinth />
      {/* The wide yard between the two buildings. */}
      <Patch position={[-0.6, 0.012, 1.4]} size={[9.4, 6.2]} map="soil" />
      <group position={[-0.4, 0, -3.4]}><BagasGodang /></group>
      <group position={[5.4, 0, 2.6]} rotation={[0, -1.05, 0]} scale={0.88}><SopoGodang /></group>
      <Mountain position={[-5.8, 0, -7.4]} radius={3.6} height={3.6} seed={3} />
      <Mountain position={[4.6, 0, -8]} radius={3.8} height={3.2} seed={12} />
      <Palm position={[-6.4, 0, -1.6]} height={4} turn={1.2} />
      <Palm position={[-7.2, 0, 2.4]} height={3.1} turn={3.5} />
      <Palm position={[6.8, 0, -2.2]} height={3.7} turn={5} />
      <Palm position={[-3.8, 0, 6.8]} height={2.6} turn={2} />
      <Pines seed={13} keep={keep} count={16} />
      <Bushes seed={19} keep={keep} count={65} />
      <Rocks seed={37} keep={keep} />
      <Grass seed={53} keep={keep} />
    </group>
  );
}
