import { Box, HomboBatu, OmoSebua } from '../models';
import { Bushes, Grass, Palm, Patch, Plinth, Rocks, inBox, type Keep } from './kit';

const keep: Keep = (x, z) => inBox(x, z, 0, 0.6, 12.6, 14) || inBox(x, z, 0, -6.4, 6, 4.4);

/** Upright and flat stones along the paved street. Placement and sizes are illustrative. */
function Stones() {
  return (
    <group>
      {[-1, 1].flatMap((side) =>
        [-2.2, 0.2, 2.6].map((z, i) => (
          <group key={`${side}${z}`} position={[side * 2.35, 0, z]}>
            {i % 2 === 0 ? (
              <>
                <Box p={[0, 0.5, 0]} s={[0.28, 1, 0.2]} color="#8f897b" />
                <Box p={[0, 1.05, 0]} s={[0.4, 0.12, 0.28]} color="#a29b8c" />
              </>
            ) : (
              <>
                {[-0.3, 0.3].map((dz) => <Box key={dz} p={[0, 0.16, dz]} s={[0.34, 0.32, 0.18]} color="#6f6a5f" />)}
                <Box p={[0, 0.4, 0]} s={[0.75, 0.18, 1]} color="#958f80" />
              </>
            )}
          </group>
        )),
      )}
    </group>
  );
}

export default function NiasSelatanDiorama() {
  return (
    <group>
      <Plinth />
      <Patch position={[0, 0.012, 0.6]} size={[6.2, 14]} map="paving" />
      {[-4.9, 4.9].map((x) => <Patch key={x} position={[x, 0.014, 0]} size={[2.8, 10.5]} map="paving" />)}
      {/* The chief's house closes the end of the street. */}
      <group position={[0, 0, -6.2]}><OmoSebua /></group>
      {/* Smaller houses line both sides. They are simplified from the same study model. */}
      {[-1, 1].flatMap((side) =>
        [-3.1, 0.1, 3.3].map((z) => (
          <group key={`${side}${z}`} position={[side * 5, 0, z]} rotation={[0, -side * (Math.PI / 2), 0]} scale={[0.82, 0.62, 0.7]}>
            <OmoSebua />
          </group>
        )),
      )}
      <Stones />
      <group position={[0.2, 0, 4.2]}><HomboBatu /></group>
      <Palm position={[-7.8, 0, -4.6]} height={4.4} turn={0.4} />
      <Palm position={[7.8, 0, -4.2]} height={3.8} turn={2.8} />
      <Palm position={[-7.6, 0, 4.8]} height={3.4} turn={4.4} />
      <Palm position={[7.4, 0, 5]} height={4.1} turn={1.7} />
      <Palm position={[-4.6, 0, -8]} height={3.2} turn={5.4} />
      <Palm position={[4.8, 0, -8]} height={3.6} turn={3.3} />
      <Bushes seed={61} keep={keep} count={75} inner={6} />
      <Rocks seed={67} keep={keep} inner={6} />
      <Grass seed={71} keep={keep} count={800} />
    </group>
  );
}
