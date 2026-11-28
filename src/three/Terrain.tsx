import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Color, Float32BufferAttribute, PlaneGeometry, ShaderMaterial, Vector3 } from 'three';
import { DISTRICTS } from '../data/atlas';
import { EXTENT, projectedRings, type TerrainData } from '../lib/terrain';
import { isLowPower, prefersReducedMotion } from './device';

const SEA_DEEP = '#0a4f86';

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/* Land uses the satellite image, brightened and with cloud speckle subdued. Water is painted, because
   the source mosaic has cloud and seam artefacts over open sea. */
const fragment = /* glsl */ `
  uniform sampler2D uSatellite;
  uniform sampler2D uWater;
  uniform sampler2D uDistricts;
  uniform vec3 uSun;
  uniform vec3 uDeep;
  uniform float uTime;
  uniform float uSelected;
  uniform float uHover;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPos;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  void main() {
    vec3 water = texture2D(uWater, vUv).rgb;
    vec2 info = texture2D(uDistricts, vUv).rg;
    float id = floor(info.r * 255.0 + 0.5);
    float inside = step(0.5, id);

    vec3 sat = texture2D(uSatellite, vUv).rgb;
    vec3 wide = texture2D(uSatellite, vUv, 6.0).rgb;
    // Clouds are bright and grey. Blend them toward the surrounding vegetation.
    float lum = dot(sat, vec3(0.299, 0.587, 0.114));
    float grey = 1.0 - clamp((max(sat.r, max(sat.g, sat.b)) - min(sat.r, min(sat.g, sat.b))) * 7.0, 0.0, 1.0);
    float cloud = smoothstep(0.055, 0.24, lum) * grey;
    vec3 green = mix(vec3(0.030, 0.105, 0.022), vec3(0.085, 0.215, 0.040), noise(vUv * 900.0) * 0.65 + noise(vUv * 260.0) * 0.35);
    vec3 land = mix(sat, mix(green, min(wide, vec3(0.16)), 0.25), cloud);

    land = pow(max(land, 0.0), vec3(0.80)) * 1.55;
    float l = dot(land, vec3(0.299, 0.587, 0.114));
    land = max(mix(vec3(l), land, 1.45), 0.0);
    // Warmer, fuller greens for a clear game-map reading.
    land = mix(land, land * vec3(0.92, 1.2, 0.72) + vec3(0.004, 0.018, 0.0), 0.75);
    // Fine grain gives fields and forest some texture when the camera is close.
    land *= 0.9 + 0.2 * noise(vUv * 1500.0);

    float light = clamp(dot(normalize(vNormalW), uSun), 0.0, 1.0);
    land *= 0.42 + 0.86 * light;

    // Neighbouring provinces stay visible but muted.
    float g2 = dot(land, vec3(0.299, 0.587, 0.114));
    vec3 muted = mix(mix(vec3(g2), land, 0.35), vec3(0.025, 0.095, 0.13), 0.35 + 0.5 * smoothstep(0.0, 0.85, info.g));
    land = mix(muted, land, inside);

    float selected = step(abs(id - uSelected), 0.25) * inside;
    float hovered = step(abs(id - uHover), 0.25) * inside * (1.0 - selected);
    land = mix(land, vec3(0.95, 0.62, 0.12), selected * 0.34);
    land = mix(land, vec3(1.0, 0.88, 0.45), hovered * 0.26);

    float coast = water.g;
    float ripple = noise(vPos.xz * 7.0 + vec2(uTime * 0.35, uTime * 0.22)) * 0.6 + noise(vPos.xz * 17.0 - uTime * 0.3) * 0.4;
    vec3 sea = mix(uDeep, vec3(0.010, 0.230, 0.400), noise(vPos.xz * 0.35));
    sea = mix(sea, vec3(0.030, 0.480, 0.520), pow(smoothstep(0.52, 0.99, coast), 1.5));
    sea *= 0.9 + 0.2 * ripple;
    sea += vec3(0.35, 0.55, 0.6) * smoothstep(0.78, 0.95, ripple) * 0.18;
    float foam = smoothstep(0.945, 0.985, coast + (ripple - 0.5) * 0.05);
    sea = mix(sea, vec3(0.72, 0.9, 0.92), foam);

    vec3 lake = mix(vec3(0.006, 0.120, 0.230), vec3(0.020, 0.260, 0.370), ripple);
    lake += vec3(0.3, 0.5, 0.55) * smoothstep(0.8, 0.96, ripple) * 0.14;
    lake = mix(lake, vec3(0.95, 0.75, 0.3), max(selected, hovered) * 0.3);

    vec3 color = mix(land, lake, smoothstep(0.35, 0.65, water.b));
    color = mix(color, sea, smoothstep(0.35, 0.65, water.r));

    // Fade the edge of the data into open sea.
    vec2 edge = min(vUv, 1.0 - vUv);
    color = mix(uDeep, color, smoothstep(0.0, 0.13, min(edge.x, edge.y)));

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Props {
  data: TerrainData;
  selected?: string | null;
  hovered?: string | null;
  boundaries?: boolean;
}

const indexOf = (id: string | null | undefined) => {
  const i = DISTRICTS.findIndex((d) => d.id === id);
  return i < 0 ? -1 : i + 1;
};

export default function Terrain({ data, selected = null, hovered = null, boundaries = true }: Props) {
  const geometry = useMemo(() => {
    const columns = isLowPower() ? 190 : 330;
    const width = EXTENT.east - EXTENT.west;
    const depth = EXTENT.north - EXTENT.south;
    const g = new PlaneGeometry(width, depth, columns, Math.round(columns * (depth / width))).rotateX(-Math.PI / 2);
    g.translate((EXTENT.east + EXTENT.west) / 2, 0, -(EXTENT.north + EXTENT.south) / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, data.heightAt(p.getX(i), -p.getZ(i)));
    g.computeVertexNormals();
    return g;
  }, [data]);

  const material = useMemo(
    () => new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uSatellite: { value: data.satellite },
        uWater: { value: data.water },
        uDistricts: { value: data.districts },
        uSun: { value: new Vector3(-0.5, 0.75, -0.35).normalize() },
        uDeep: { value: new Color(SEA_DEEP) },
        uTime: { value: 0 },
        uSelected: { value: -1 },
        uHover: { value: -1 },
      },
    }),
    [data],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const still = useMemo(prefersReducedMotion, []);
  const uniforms = useRef(material.uniforms);
  uniforms.current = material.uniforms;
  useFrame(({ clock }) => {
    uniforms.current.uSelected.value = indexOf(selected);
    uniforms.current.uHover.value = indexOf(hovered);
    if (!still) uniforms.current.uTime.value = clock.elapsedTime;
  });

  // Boundary lines draped over the relief.
  const lines = useMemo(() => {
    const make = (ids: (typeof DISTRICTS)[number][], lift: number) => {
      const pos: number[] = [];
      for (const d of ids) {
        for (const ring of projectedRings(d)) {
          for (let i = 0; i < ring.length - 1; i++) {
            const [ax, ay] = ring[i];
            const [bx, by] = ring[i + 1];
            const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.07));
            for (let s = 0; s < steps; s++) {
              for (const t of [s / steps, (s + 1) / steps]) {
                const x = ax + (bx - ax) * t;
                const y = ay + (by - ay) * t;
                pos.push(x, data.heightAt(x, y) + lift, -y);
              }
            }
          }
        }
      }
      return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(pos, 3));
    };
    return { all: make(DISTRICTS.filter((d) => d.type !== 'air'), 0.035), make };
  }, [data]);

  const focus = useMemo(() => {
    const d = DISTRICTS.find((x) => x.id === selected);
    return d ? lines.make([d], 0.06) : null;
  }, [selected, lines]);

  return (
    <group>
      <mesh geometry={geometry} material={material} />
      {/* Open sea beyond the data. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial color={SEA_DEEP} toneMapped={false} />
      </mesh>
      {boundaries && (
        <lineSegments geometry={lines.all}>
          <lineBasicMaterial color="#fff6d5" transparent opacity={0.42} />
        </lineSegments>
      )}
      {focus && (
        <lineSegments geometry={focus}>
          <lineBasicMaterial color="#ffd45e" />
        </lineSegments>
      )}
    </group>
  );
}
