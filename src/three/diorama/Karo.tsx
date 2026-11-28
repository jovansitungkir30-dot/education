import { Box, Beam, SiwaluhJabu } from '../models';
import { Bushes, Grass, Mountain, Patch, Pines, Plinth, Rocks, inBox, type Keep } from './kit';

const keep: Keep = (x, z) => inBox(x, z, -1.2, -0.6, 6, 6.6) || inBox(x, z, 5.2, -1.6, 4.2, 4.6) || inBox(x, z, -0.4, 4.4, 8, 3.4) || inBox(x, z, 5.6, 4.8, 5, 4.4) || z < -6;

/** Planted rows as highland farmland scenery. */
function Fields() {
  return (
    <group position={[5.6, 0, 4.8]} rotation={[0, -0.45, 0]}>
      {Array.from({ length: 7 }, (_, row) => (
        <group key={row} position={[0, 0, -1.5 + row * 0.5]}>
          <Box p={[0, 0.06, 0]} s={[3.8, 0.12, 0.3]} color="#6b4a2c" />
          {Array.from({ length: 13 }, (_, i) => (
            <mesh key={i} position={[-1.75 + i * 0.29, 0.2, 0]} castShadow>
              <dodecahedronGeometry args={[0.11, 0]} />
              <meshStandardMaterial color={row % 2 ? '#8aa84a' : '#5f8d3d'} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export default function KaroDiorama() {
  return (
    <group>
      <Plinth />
      <Patch position={[-0.4, 0.012, 4.4]} size={[7.6, 3.2]} map="soil" />
      <Patch position={[2.9, 0.014, 1.4]} size={[1.4, 6.4]} map="soil" rotation={0.5} />
      <group position={[-1.2, 0, -0.9]}><SiwaluhJabu /></group>
      <group position={[5.2, 0, -1.8]} rotation={[0, -0.5, 0]} scale={0.7}><SiwaluhJabu /></group>
      <Fields />
      {/* Bamboo fence along the yard. */}
      {Array.from({ length: 17 }, (_, i) => <Beam key={i} a={[-6.2 + i * 0.45, 0, 6.3]} b={[-6.2 + i * 0.45, 0.65, 6.3]} radius={0.04} color="#b29a5e" />)}
      {[0.25, 0.5].map((y) => <Beam key={y} a={[-6.3, y, 6.3]} b={[1.1, y, 6.3]} radius={0.035} color="#a08a50" />)}
      <Mountain position={[-4.6, 0, -7.4]} radius={4.4} height={5.6} seed={4} />
      <Mountain position={[3.4, 0, -8.2]} radius={4.2} height={4.6} seed={8} />
      <Pines seed={5} keep={keep} count={38} inner={5.6} />
      <Bushes seed={17} keep={keep} count={55} />
      <Rocks seed={29} keep={keep} />
      <Grass seed={43} keep={keep} count={900} />
    </group>
  );
}
