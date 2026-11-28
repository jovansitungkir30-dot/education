/**
 * A tiny modelling kit. A landmark is a list of coloured parts that are merged into one geometry,
 * so every miniature on the map costs a single draw call and shares one art style.
 */
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, ConeGeometry, CylinderGeometry, DodecahedronGeometry,
  Euler, Float32BufferAttribute, Matrix4, Quaternion, SphereGeometry, TorusGeometry, Vector3,
} from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export type V3 = [number, number, number];

export const C = {
  wood: '#7a4d2b', darkWood: '#4a2d1b', thatch: '#4b3a2b', palmFibre: '#2f251d', plank: '#9a6a3d',
  stone: '#9b9485', darkStone: '#6f6a5f', brick: '#a8553a', darkBrick: '#7f3d2a', earth: '#9a7350',
  grass: '#5c8a3e', leaf: '#3f7a38', darkLeaf: '#2b5c33', water: '#3794ad', foam: '#d9f1f2',
  white: '#f1ece0', cream: '#e8d9b0', yellow: '#e4b83d', gold: '#d9a93a', red: '#a83a28',
  maroon: '#6f2418', green: '#2f7f5b', black: '#1d1712', metal: '#8d99a3', chrome: '#c7ced4',
  blue: '#2f6f9e', terracotta: '#b4603f', skin: '#a9714a', orange: '#d9772f', coffee: '#4a2a17',
};

function paint(source: BufferGeometry, color: string, matrix: Matrix4) {
  const g = source.index ? source.toNonIndexed() : source;
  g.deleteAttribute('uv');
  g.applyMatrix4(matrix);
  const c = new Color(color);
  const n = g.attributes.position.count;
  const colors = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) colors.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new BufferAttribute(colors, 3));
  if (g !== source) source.dispose();
  return g;
}

/**
 * Bakes soft contact shading into the vertex colours and varies each face a little, so flat colours
 * read as material. It costs nothing at render time.
 */
function weather(g: BufferGeometry) {
  const position = g.attributes.position;
  const color = g.attributes.color;
  for (let face = 0; face < position.count; face += 3) {
    // A stable pseudo-random tone per face.
    const n = Math.sin(position.getX(face) * 91.7 + position.getY(face) * 47.3 + position.getZ(face) * 63.1) * 43758.5453;
    const tone = 0.93 + (n - Math.floor(n)) * 0.12;
    for (let i = face; i < face + 3; i++) {
      const t = Math.min(1, Math.max(0, (position.getY(i) + 0.05) / 1.5));
      const shade = (0.7 + 0.3 * t * t * (3 - 2 * t)) * tone;
      color.setXYZ(i, color.getX(i) * shade, color.getY(i) * shade, color.getZ(i) * shade);
    }
  }
}

export class Builder {
  private parts: BufferGeometry[] = [];

  add(g: BufferGeometry, color: string, p: V3 = [0, 0, 0], r: V3 = [0, 0, 0], s: V3 = [1, 1, 1]) {
    const m = new Matrix4().compose(new Vector3(...p), new Quaternion().setFromEuler(new Euler(...r)), new Vector3(...s));
    this.parts.push(paint(g, color, m));
    return this;
  }

  box(p: V3, s: V3, color: string, r?: V3) {
    return this.add(new BoxGeometry(...s), color, p, r);
  }

  cyl(p: V3, top: number, bottom: number, h: number, color: string, seg = 12, r?: V3) {
    return this.add(new CylinderGeometry(top, bottom, h, seg), color, p, r);
  }

  cone(p: V3, radius: number, h: number, color: string, seg = 10, r?: V3) {
    return this.add(new ConeGeometry(radius, h, seg), color, p, r);
  }

  ball(p: V3, radius: number, color: string, s?: V3) {
    return this.add(new SphereGeometry(radius, 14, 10), color, p, [0, 0, 0], s);
  }

  rock(p: V3, radius: number, color: string = C.stone, s: V3 = [1, 1, 1]) {
    return this.add(new DodecahedronGeometry(radius, 0), color, p, [radius * 7, radius * 13, 0], s);
  }

  /** A dome with a small finial, as used on several mosques in these studies. */
  dome(p: V3, radius: number, color: string, finial: string = C.gold) {
    this.add(new SphereGeometry(radius, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), color, p, [0, 0, 0], [1, 1.15, 1]);
    this.ball([p[0], p[1] + radius * 1.17, p[2]], radius * 0.12, finial);
    return this.cyl([p[0], p[1] + radius * 1.4, p[2]], 0.015, 0.03, radius * 0.45, finial, 6);
  }

  torus(p: V3, radius: number, tube: number, color: string, r?: V3, arc = Math.PI * 2) {
    return this.add(new TorusGeometry(radius, tube, 8, 24, arc), color, p, r);
  }

  /** A timber between two points. */
  beam(a: V3, b: V3, radius: number, color: string = C.darkWood) {
    const from = new Vector3(...a);
    const dir = new Vector3(...b).sub(from);
    const length = dir.length();
    const g = new CylinderGeometry(radius, radius, length, 7);
    const m = new Matrix4().compose(
      from.clone().addScaledVector(dir, 0.5),
      new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()),
      new Vector3(1, 1, 1),
    );
    this.parts.push(paint(g, color, m));
    return this;
  }

  private surface(triangles: number[], color: string, p: V3, turn: number) {
    const g = new BufferGeometry().setAttribute('position', new Float32BufferAttribute(triangles, 3));
    g.computeVertexNormals();
    return this.add(g, color, p, [0, turn, 0]);
  }

  /** Hipped or pyramidal roof. `top` is the size of the flat top (0 for a point or a ridge). */
  hip(p: V3, w: number, d: number, h: number, color: string, top: [number, number] = [0, 0]) {
    const [tw, td] = [top[0] / 2, top[1] / 2];
    const base: V3[] = [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
    const cap: V3[] = [[-tw, h, -td], [tw, h, -td], [tw, h, td], [-tw, h, td]];
    const t: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      t.push(...base[i], ...cap[j], ...base[j], ...base[i], ...cap[i], ...cap[j]);
    }
    t.push(...cap[0], ...cap[3], ...cap[2], ...cap[0], ...cap[2], ...cap[1]);
    return this.surface(t, color, p, 0);
  }

  /**
   * Gabled roof with the ridge along z (turn it for x). `sweep` raises the ridge ends,
   * giving a saddle curve.
   */
  roof(p: V3, halfWidth: number, length: number, rise: number, color: string, { sweep = 0, flare = 1.12, gable = C.maroon as string, turn = 0 } = {}) {
    const SEG = sweep ? 14 : 1;
    const half = length / 2;
    const ridge = (t: number): V3 => [0, rise + sweep * t * t, t * half * flare];
    const eave = (t: number, side: number): V3 => [side * halfWidth, sweep * 0.25 * t * t, t * half];
    const slopes: number[] = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * 2 - 1;
        const b = ((i + 1) / SEG) * 2 - 1;
        slopes.push(...eave(a, side), ...eave(b, side), ...ridge(b), ...eave(a, side), ...ridge(b), ...ridge(a));
      }
    }
    this.surface(slopes, color, p, turn);
    const ends: number[] = [];
    for (const e of [-1, 1]) {
      const inset = (v: V3): V3 => [v[0] * 0.94, v[1] - 0.03, v[2] * 0.97];
      ends.push(...inset(eave(e, -1)), ...inset(eave(e, 1)), ...inset(ridge(e)));
    }
    this.surface(ends, gable, p, turn);
    const ridgeColor = C.black;
    const rot = (v: V3): V3 => [v[0] * Math.cos(turn) + v[2] * Math.sin(turn) + p[0], v[1] + p[1], -v[0] * Math.sin(turn) + v[2] * Math.cos(turn) + p[2]];
    for (let i = 0; i < SEG; i++) this.beam(rot(ridge((i / SEG) * 2 - 1)), rot(ridge(((i + 1) / SEG) * 2 - 1)), 0.055, ridgeColor);
    return this;
  }

  /** Rows of posts on small stone bases. */
  posts(xs: number[], zs: number[], height: number, radius = 0.1, color: string = C.darkWood, y = 0) {
    for (const x of xs) {
      for (const z of zs) {
        this.cyl([x, y + 0.06, z], radius * 1.6, radius * 1.9, 0.12, C.stone, 8);
        this.beam([x, y + 0.1, z], [x, y + height, z], radius, color);
      }
    }
    return this;
  }

  stairs(x: number, z: number, top: number, width = 0.8, color: string = C.plank, steps = 6) {
    for (let i = 0; i < steps; i++) this.box([x, (top * (i + 0.5)) / steps, z + (steps - 1 - i) * 0.17], [width, 0.08, 0.2], color);
    return this;
  }

  /** An arched opening drawn on a wall that faces +z (turn rotates it around y). */
  arch(p: V3, w: number, h: number, color: string = C.black, turn = 0) {
    this.box([p[0], p[1] + h / 2, p[2]], [w, h, 0.05], color, [0, turn, 0]);
    return this.add(new CylinderGeometry(w / 2, w / 2, 0.05, 16, 1, false, Math.PI / 2, Math.PI), color, [p[0], p[1] + h, p[2]], [Math.PI / 2, turn, 0]);
  }

  tree(p: V3, size = 1, color: string = C.leaf) {
    this.cyl([p[0], p[1] + 0.35 * size, p[2]], 0.06 * size, 0.1 * size, 0.7 * size, C.darkWood, 6);
    this.rock([p[0], p[1] + 0.85 * size, p[2]], 0.38 * size, color);
    this.rock([p[0] + 0.24 * size, p[1] + 0.7 * size, p[2] + 0.1 * size], 0.26 * size, C.darkLeaf);
    return this.rock([p[0] - 0.22 * size, p[1] + 0.72 * size, p[2] - 0.08 * size], 0.25 * size, color);
  }

  pine(p: V3, size = 1) {
    this.cyl([p[0], p[1] + 0.25 * size, p[2]], 0.05 * size, 0.08 * size, 0.5 * size, C.darkWood, 6);
    for (let i = 0; i < 3; i++) this.cone([p[0], p[1] + (0.65 + i * 0.35) * size, p[2]], (0.45 - i * 0.11) * size, 0.6 * size, i % 2 ? C.leaf : C.darkLeaf, 8);
    return this;
  }

  palm(p: V3, height = 2.2) {
    for (let i = 0; i < 6; i++) this.cyl([p[0] + (i / 6) ** 2 * 0.3, p[1] + (height / 6) * (i + 0.5), p[2]], 0.07, 0.085, height / 6 + 0.03, i % 2 ? C.wood : C.darkWood, 7);
    const top: V3 = [p[0] + 0.3, p[1] + height, p[2]];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const mid: V3 = [top[0] + Math.cos(a) * 0.5, top[1] + 0.14, top[2] + Math.sin(a) * 0.5];
      this.add(new ConeGeometry(0.16, 0.75, 4), i % 2 ? C.leaf : C.grass, mid, [Math.sin(a) * 1.7, 0, -Math.cos(a) * 1.7], [1, 1, 0.25]);
    }
    return this;
  }

  /** A simplified standing or dancing figure, deliberately without facial detail. */
  figure(p: V3, cloth: string = C.maroon, armsOut = false) {
    this.cyl([p[0], p[1] + 0.36, p[2]], 0.14, 0.24, 0.72, cloth, 10);
    this.cyl([p[0], p[1] + 0.9, p[2]], 0.17, 0.14, 0.4, C.gold, 10);
    this.ball([p[0], p[1] + 1.27, p[2]], 0.15, C.skin);
    for (const side of [-1, 1]) {
      const hand: V3 = armsOut ? [p[0] + side * 0.75, p[1] + 1.12, p[2]] : [p[0] + side * 0.28, p[1] + 0.68, p[2]];
      this.beam([p[0] + side * 0.14, p[1] + 1.02, p[2]], hand, 0.05, cloth);
    }
    return this;
  }

  pool(p: V3, rx: number, rz: number) {
    this.add(new CylinderGeometry(1, 1, 0.05, 36), C.foam, [p[0], p[1] + 0.005, p[2]], [0, 0, 0], [rx * 1.07, 1, rz * 1.07]);
    return this.add(new CylinderGeometry(1, 1, 0.07, 36), C.water, [p[0], p[1] + 0.015, p[2]], [0, 0, 0], [rx, 1, rz]);
  }

  build() {
    const merged = mergeGeometries(this.parts, false);
    this.parts.forEach((g) => g.dispose());
    this.parts = [];
    if (!merged) throw new Error('landmark parts could not be merged');
    weather(merged);
    merged.computeBoundingSphere();
    return merged;
  }
}
