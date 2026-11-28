/** Sky, distant land or sea, drifting clouds and birds around a diorama. Illustrative, not a view of a real place. */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BackSide, BufferGeometry, Color, Float32BufferAttribute, RingGeometry, ShaderMaterial, type Group } from 'three';
import { prefersReducedMotion } from '../device';
import { rng } from './kit';

import { MOODS, type Mood } from './moods';

export type { Mood };

function Sky({ top, horizon }: { top: string; horizon: string }) {
  const material = useMemo(
    () => new ShaderMaterial({
      side: BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new Color() }, horizon: { value: new Color() } },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 horizon; varying vec3 vP; void main(){ float h = clamp(normalize(vP).y * 2.2, 0.0, 1.0); gl_FragColor = vec4(mix(horizon, top, pow(h, 0.8)), 1.0); \n#include <colorspace_fragment>\n }',
    }),
    [],
  );
  material.uniforms.top.value.set(top);
  material.uniforms.horizon.value.set(horizon);
  useEffect(() => () => material.dispose(), [material]);
  return <mesh material={material} renderOrder={-1}><sphereGeometry args={[150, 32, 16]} /></mesh>;
}

/** Land that rises into distant hills, or stays flat as water toward the front for coastal settings. */
function Horizon({ seed, sea }: { seed: number; sea: boolean }) {
  const geometry = useMemo(() => {
    // Reaches under the plinth, so no sky shows beneath the diorama.
    const g = new RingGeometry(0.1, 120, 120, 40).rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const r = rng(seed);
    const phase = [r() * 9, r() * 9, r() * 9];
    const colors: number[] = [];
    const near = new Color('#557a3f');
    const far = new Color('#7d9a86');
    const water = new Color('#2f7487');
    const c = new Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const d = Math.hypot(x, z);
      const a = Math.atan2(z, x);
      // Water fills the front for coasts and islands.
      const wet = sea && z > Math.abs(x) * 0.25 && d > 12.5;
      const rise = Math.max(0, Math.min(1, (d - 26) / 38));
      const ridge = 5 + Math.sin(a * 3 + phase[0]) * 3 + Math.sin(a * 7 + phase[1]) * 1.8 + Math.sin(a * 13 + phase[2]) * 0.8;
      p.setY(i, wet ? -2.5 : -2.46 + rise * rise * Math.max(0.5, ridge) * 1.7 + Math.sin(x * 0.35) * Math.cos(z * 0.31) * Math.max(0, Math.min(1, (d - 13) / 8)) * 0.45);
      if (wet) c.copy(water);
      else c.copy(near).lerp(far, rise);
      c.multiplyScalar(0.92 + r() * 0.14);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [seed, sea]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={1} flatShading />
    </mesh>
  );
}

function Clouds({ seed, tint }: { seed: number; tint: string }) {
  const group = useRef<Group>(null);
  const still = useMemo(prefersReducedMotion, []);
  const clouds = useMemo(() => {
    const r = rng(seed + 31);
    return Array.from({ length: 9 }, (_, i) => ({ i, a: (i / 9) * Math.PI * 2 + r(), d: 34 + r() * 22, y: 11 + r() * 9, s: 1.3 + r() * 1.7 }));
  }, [seed]);
  useFrame((_, dt) => {
    if (!still && group.current) group.current.rotation.y += dt * 0.012;
  });
  return (
    <group ref={group}>
      {clouds.map((c) => (
        <group key={c.i} position={[Math.cos(c.a) * c.d, c.y, Math.sin(c.a) * c.d]} scale={c.s}>
          {[[0, 0, 0, 1.3], [1.2, -0.15, 0.3, 0.95], [-1.15, -0.2, -0.2, 0.85], [0.35, 0.45, -0.2, 0.8]].map(([x, y, z, k], n) => (
            <mesh key={n} position={[x, y, z]} scale={[k * 1.25, k * 0.62, k]}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color={tint} flatShading roughness={1} transparent opacity={0.82} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Birds({ seed }: { seed: number }) {
  const flock = useRef<Group>(null);
  const still = useMemo(prefersReducedMotion, []);
  const wing = useMemo(() => {
    const g = new BufferGeometry().setAttribute('position', new Float32BufferAttribute([0, 0, 0.09, 0.42, 0.06, -0.06, 0, 0, -0.07], 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => wing.dispose(), [wing]);
  useFrame(({ clock }) => {
    const g = flock.current;
    if (!g || still) return;
    const t = clock.elapsedTime;
    g.rotation.y = t * 0.11 + seed;
    g.children.forEach((bird, i) => {
      const flap = Math.sin(t * 7 + i * 1.7) * 0.55;
      bird.children[0].rotation.z = flap;
      bird.children[1].rotation.z = -flap;
    });
  });
  return (
    <group ref={flock}>
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[13 + (i % 3) * 0.9, 8.5 + (i % 2) * 0.5 + i * 0.12, i * 0.75 - 2]}>
          <group><mesh geometry={wing}><meshBasicMaterial color="#26302c" side={2} /></mesh></group>
          <group><mesh geometry={wing} scale={[-1, 1, 1]}><meshBasicMaterial color="#26302c" side={2} /></mesh></group>
        </group>
      ))}
    </group>
  );
}

export default function Environment({ mood, seed, sea }: { mood: Mood; seed: number; sea: boolean }) {
  const m = MOODS[mood];
  return (
    <>
      <color attach="background" args={[m.horizon]} />
      <fog attach="fog" args={[m.horizon, 52, 135]} />
      <hemisphereLight args={[m.sky, m.ground, m.fill]} />
      <directionalLight position={m.sunAt} intensity={m.sunPower} color={m.sun} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-camera-left={-13} shadow-camera-right={13} shadow-camera-top={13} shadow-camera-bottom={-13} shadow-camera-far={70} />
      <directionalLight position={[-14, 8, -6]} intensity={0.6} color="#b9d8e8" />
      <Sky top={m.top} horizon={m.horizon} />
      <Horizon seed={seed} sea={sea} />
      <Clouds seed={seed} tint={mood === 'senja' ? '#f4c3a4' : '#ffffff'} />
      <Birds seed={seed} />
    </>
  );
}
