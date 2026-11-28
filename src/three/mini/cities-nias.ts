/** Miniature studies: the remaining cities and the Nias islands. Stylised, not measured replicas. */
import { C, type Builder, type V3 } from './builder';
import type { Model } from './mainland';

/** Timber house on posts with diagonal braces and a tall roof, used with different proportions. */
function niasHouse(b: Builder, [x, y, z]: V3, w: number, d: number, post: number, roof: number) {
  const xs = [x - w * 0.4, x - w * 0.13, x + w * 0.13, x + w * 0.4];
  b.posts(xs, [z - d * 0.38, z, z + d * 0.38], post, 0.11, C.darkWood, y);
  for (const i of [0, 2]) b.beam([xs[i], y + 0.1, z + d * 0.42], [xs[i + 1], y + post, z + d * 0.42], 0.07, C.wood).beam([xs[i + 1], y + 0.1, z + d * 0.42], [xs[i], y + post, z + d * 0.42], 0.07, C.wood);
  b.box([x, y + post + 0.08, z], [w, 0.16, d], C.wood).box([x, y + post + 0.55, z], [w * 0.94, 0.8, d * 0.94], '#5d3a22');
  for (let i = 0; i < 9; i++) b.box([x - w * 0.4 + i * w * 0.1, y + post + 0.58, z + d * 0.48], [0.07, 0.38, 0.05], C.black);
  b.roof([x, y + post + 0.95, z], w * 0.68, d * 1.15, roof, C.thatch, { flare: 0.62, gable: C.palmFibre });
}

export const citiesAndNias: Record<string, Model> = {
  'nias-selatan'(b) {
    b.box([0, 0.04, 0.4], [3.2, 0.08, 6.2], C.stone);
    for (let i = 0; i < 40; i++) b.box([-1.35 + (i % 5) * 0.66, 0.09, -2.2 + Math.floor(i / 5) * 0.72], [0.6, 0.03, 0.64], i % 2 ? '#8b8475' : '#a39c8c');
    niasHouse(b, [0, 0, -2], 2.5, 2.2, 1.35, 2.5);
    for (const side of [-1, 1]) niasHouse(b, [side * 2.6, 0, 0.1], 1.4, 1.7, 0.8, 1.2);
    // Stone-jumping structure with a take-off stone.
    for (let r = 0; r < 6; r++) b.box([0, 0.2 + r * 0.27, 1.9], [1.4 - r * 0.11, 0.24, 0.6 - r * 0.03], r % 2 ? C.stone : C.darkStone);
    b.box([0, 1.82, 1.9], [0.9, 0.12, 0.42], C.cream).box([0, 0.14, 2.8], [0.45, 0.25, 0.4], C.darkStone);
    b.palm([-3.4, 0, 2.4], 2.8).palm([3.2, 0, 2.2], 2.5);
  },
  'nias-utara'(b) {
    // Omo hada: an everyday house on posts resting on stones. Its exact northern plan is not modelled.
    niasHouse(b, [0, 0, -0.4], 3.3, 2.6, 1.15, 1.75);
    b.stairs(1.9, 0.4, 1.2, 0.65, C.plank, 7);
    for (let i = 0; i < 9; i++) b.rock([-2.2 + i * 0.5, 0.1, 2.1], 0.18, i % 2 ? C.stone : C.darkStone);
    b.figure([-1.2, 0, 2.6], C.red);
    b.palm([-3.2, 0, -0.6], 3).palm([-2.7, 0, 1.4], 2.2).palm([3.4, 0, -1.3], 2.7).tree([3, 0, 1.8], 1.1).pool([-1.5, 0, -3], 2, 0.6);
  },
  nias(b) {
    // Tari Moyo (eagle dance): dancers with wide, wing-like arm movements on a stone stage.
    b.cyl([0, 0.1, 0], 3.2, 3.35, 0.2, C.stone, 32).cyl([0, 0.22, 0], 2.7, 2.7, 0.04, '#8b8475', 32).torus([0, 0.25, 0], 1.9, 0.04, C.cream, [Math.PI / 2, 0, 0]);
    const dancer = (x: number, z: number, s: number) => {
      b.cyl([x, 0.25 + 0.55 * s, z], 0.2 * s, 0.42 * s, 1.1 * s, C.red, 12).torus([x, 0.25 + 0.35 * s, z], 0.36 * s, 0.05 * s, C.gold, [Math.PI / 2, 0, 0]);
      b.cyl([x, 0.25 + 1.35 * s, z], 0.24 * s, 0.2 * s, 0.55 * s, C.black, 12).ball([x, 0.25 + 1.85 * s, z], 0.2 * s, C.skin);
      for (let i = 0; i < 7; i++) b.cone([x + (i - 3) * 0.08 * s, 0.25 + (2.17 - Math.abs(i - 3) * 0.05) * s, z], 0.045 * s, 0.34 * s, C.gold, 5);
      for (const side of [-1, 1]) {
        const hand: V3 = [x + side * 1.15 * s, 0.25 + 1.75 * s, z];
        b.beam([x + side * 0.2 * s, 0.25 + 1.5 * s, z], hand, 0.07 * s, C.black);
        for (let i = 0; i < 6; i++) {
          const t = 0.25 + i * 0.15;
          b.box([x + side * (0.2 + t * 0.95) * s, 0.25 + (1.43 + t * 0.2) * s, z], [0.14 * s, (0.5 - i * 0.04) * s, 0.05], i % 2 ? C.yellow : C.red, [0, 0, side * 0.35]);
        }
      }
    };
    dancer(0, 0.5, 1.3);
    dancer(-1.9, -0.8, 0.85);
    dancer(1.9, -0.8, 0.85);
    for (const x of [-0.7, 0.7]) b.cyl([x, 0.55, -2.3], 0.35, 0.28, 0.65, C.wood, 12).cyl([x, 0.9, -2.3], 0.36, 0.36, 0.05, C.cream, 12);
    b.palm([-3.6, 0, 1], 2.4).palm([3.4, 0, 0.8], 2.4);
  },
  'nias-barat'(b) {
    // Baladano Laina megaliths: seven stone monuments of upright and table forms.
    b.cyl([0, 0.07, 0], 3.5, 3.6, 0.14, C.earth, 28);
    for (const [x, z, h] of [[-2, -1, 2], [-0.4, -1.5, 2.7], [1.5, -1.1, 1.6]] as const) {
      b.box([x, 0.14 + h / 2, z], [0.55, h, 0.3], C.stone).box([x, 0.2 + h, z], [0.75, 0.2, 0.42], C.darkStone).rock([x, 0.4 + h, z], 0.22, C.stone);
      b.torus([x, 0.14 + h * 0.72, z + 0.17], 0.14, 0.035, C.darkStone);
    }
    for (const [x, z, s] of [[-1.6, 0.9, 1], [0.4, 0.6, 1.25], [2.1, 0.5, 0.85]] as const) {
      for (const dx of [-0.35, 0.35]) b.cyl([x + dx * s, 0.14 + 0.25 * s, z], 0.18 * s, 0.2 * s, 0.5 * s, C.darkStone, 9);
      b.cyl([x, 0.72 * s, z], 0.75 * s, 0.66 * s, 0.2 * s, C.stone, 18);
    }
    b.box([0.3, 0.45, 2.2], [1.7, 0.18, 0.7], C.stone).box([-0.35, 0.25, 2.2], [0.2, 0.28, 0.6], C.darkStone).box([0.95, 0.25, 2.2], [0.2, 0.28, 0.6], C.darkStone);
    b.tree([-3, 0, 0.6], 1.3).palm([-2.8, 0, -2.3], 2.7).palm([2.9, 0, -2], 3).tree([3, 0, 1.6], 1);
  },
  'kota-gunungsitoli'(b) {
    // Museum Pusaka Nias: several pavilions around a central hall.
    b.box([0, 0.05, 0], [6.8, 0.1, 5.4], '#8b8475');
    const pavilion = (x: number, z: number, w: number, d: number, rise: number) => {
      b.box([x, 0.65, z], [w, 1.1, d], C.cream);
      for (let i = 0; i < 4; i++) b.box([x - w * 0.36 + i * w * 0.24, 0.62, z + d / 2 + 0.02], [w * 0.12, 0.62, 0.05], C.darkWood);
      b.roof([x, 1.2, z], w * 0.66, d * 1.2, rise, C.thatch, { flare: 0.68, gable: C.wood });
    };
    pavilion(0, -0.5, 2.5, 2, 1.7);
    for (const x of [-2.4, 2.4]) for (const z of [-1.5, 1.1]) pavilion(x, z, 1.4, 1.25, 0.85);
    // A display plinth with an upright stone and a seat-like stone.
    b.box([0, 0.25, 1.9], [1.5, 0.3, 0.9], C.darkStone).box([-0.4, 0.85, 1.9], [0.28, 0.9, 0.2], C.stone).box([0.35, 0.58, 1.9], [0.55, 0.35, 0.5], C.stone);
    b.palm([-3.7, 0, 2.4], 2.3).palm([3.4, 0, 2.5], 2.1).tree([0, 0, -3.1], 1.2);
  },
  'kota-binjai'(b) {
    // Rambutan Binjai: hairy red fruit on a tree and in a basket.
    const fruit = (x: number, y: number, z: number, r: number, color: string) => {
      b.ball([x, y, z], r, color, [1, 1.18, 1]);
      for (let i = 0; i < 22; i++) {
        const a = i * 2.4;
        const h = 1 - (i / 21) * 2;
        const q = Math.sqrt(1 - h * h);
        const dir: V3 = [Math.cos(a) * q, h, Math.sin(a) * q];
        b.beam([x + dir[0] * r * 0.9, y + dir[1] * r, z + dir[2] * r * 0.9], [x + dir[0] * r * 1.6, y + dir[1] * r * 1.7, z + dir[2] * r * 1.6], r * 0.07, i % 3 ? '#d4552f' : '#a9c25a');
      }
    };
    b.cyl([-1.3, 0.9, -0.9], 0.22, 0.34, 1.8, C.darkWood, 9).beam([-1.3, 1.5, -0.9], [-0.3, 2.3, -0.7], 0.11).beam([-1.3, 1.4, -0.9], [-2.3, 2.2, -0.8], 0.11);
    for (const [x, y, z, r] of [[-1.3, 2.7, -1.1, 1.2], [-0.3, 2.6, -0.8, 0.8], [-2.4, 2.5, -0.9, 0.85]] as const) b.rock([x, y, z], r, C.darkLeaf);
    for (const [x, y, z] of [[-0.6, 2, 0.1], [-1, 1.75, 0.1], [-2.1, 2, 0], [-0.15, 2.35, 0.05], [-1.6, 3.1, 0]] as const) fruit(x, y, z, 0.2, C.red);
    b.cyl([1.5, 0.45, 0.9], 1.15, 0.8, 0.9, '#b58a4e', 18);
    for (const y of [0.3, 0.6, 0.88]) b.torus([1.5, y, 0.9], 0.84 + y * 0.34, 0.05, '#8d6a38', [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 11; i++) fruit(1.5 + Math.cos(i * 2.1) * (i % 3) * 0.34, 1.02 + (i < 3 ? 0.33 : 0), 0.9 + Math.sin(i * 2.1) * (i % 3) * 0.34, 0.24, i % 4 ? C.red : C.orange);
    fruit(-0.4, 0.3, 2.1, 0.28, C.red);
    b.tree([3.1, 0, -1.4], 1.2).tree([-3.2, 0, 1.4], 0.9);
  },
  'kota-tebing-tinggi'(b) {
    // Lemang: glutinous rice cooked in bamboo tubes beside a long fire.
    for (const x of [-2.2, 2.2]) b.beam([x, 0, -0.5], [x, 1.35, -0.5], 0.11);
    b.beam([-2.4, 1.3, -0.5], [2.4, 1.3, -0.5], 0.09);
    for (let i = 0; i < 12; i++) {
      const x = -1.95 + i * 0.355;
      b.beam([x, 0.1, 0.35], [x, 2.15, -0.68], 0.15, i % 3 === 0 ? '#a6a04e' : '#8a9a45');
      b.ball([x, 2.17, -0.69], 0.15, C.cream, [1, 0.55, 1]);
      b.torus([x, 1.05, -0.14], 0.155, 0.025, '#5f6d2c', [1.1, 0, 0]);
    }
    for (let i = 0; i < 9; i++) {
      const x = -2 + i * 0.5;
      b.beam([x, 0.1, 0.75], [x + 0.35, 0.16, 1.15], 0.1, C.darkWood).cone([x + 0.15, 0.4, 0.9], 0.18, 0.55 + (i % 3) * 0.18, i % 2 ? C.orange : C.yellow, 7);
    }
    b.box([1.7, 0.45, 2.2], [1.9, 0.14, 1], C.plank).posts([0.95, 2.45], [1.85, 2.55], 0.4, 0.07);
    b.cyl([1.7, 0.55, 2.2], 0.7, 0.7, 0.06, '#3f7a38', 18);
    for (let i = 0; i < 5; i++) b.cyl([1.25 + i * 0.22, 0.68, 2.2], 0.17, 0.17, 0.12, C.cream, 12, [0, 0, Math.PI / 2]);
    b.figure([-1.6, 0, 2.1], C.blue).palm([-3.4, 0, -1.2], 2.4).tree([3.3, 0, -1], 1.3);
  },
  'kota-pematangsiantar'(b) {
    // BSA motorcycle with a passenger sidecar (becak Siantar).
    b.box([0, 0.04, 0], [6.4, 0.08, 3.8], '#6f6a5f');
    for (const x of [-2.4, -0.8, 0.8, 2.4]) b.box([x, 0.09, -1.4], [0.9, 0.02, 0.12], C.white);
    const wheel = (x: number, z: number, r: number) => {
      b.torus([x, r + 0.1, z], r, 0.14, C.black).cyl([x, r + 0.1, z], 0.12, 0.12, 0.22, C.chrome, 10, [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 6; i++) b.beam([x - Math.cos((i * Math.PI) / 6) * r, r + 0.1 - Math.sin((i * Math.PI) / 6) * r, z], [x + Math.cos((i * Math.PI) / 6) * r, r + 0.1 + Math.sin((i * Math.PI) / 6) * r, z], 0.02, C.chrome);
    };
    wheel(-1.5, 0.7, 0.66);
    wheel(1.55, 0.7, 0.66);
    wheel(0.15, -0.95, 0.55);
    b.box([-0.05, 0.86, 0.7], [0.85, 0.7, 0.42], C.metal).cyl([0.15, 1.02, 0.7], 0.27, 0.27, 0.5, C.chrome, 12, [Math.PI / 2, 0, 0]);
    b.beam([-1.5, 0.76, 0.7], [-0.5, 1.45, 0.7], 0.09, C.black).beam([-0.5, 1.45, 0.7], [0.95, 1.5, 0.7], 0.1, C.black).beam([1.55, 0.76, 0.7], [1.15, 1.95, 0.7], 0.08, C.chrome);
    b.ball([0.45, 1.65, 0.7], 0.36, C.maroon, [1.6, 0.75, 0.9]).box([-0.65, 1.62, 0.7], [0.85, 0.2, 0.42], C.black);
    b.beam([1.12, 2.02, 0.2], [1.12, 2.02, 1.2], 0.05, C.chrome).ball([1.45, 1.75, 0.7], 0.22, C.chrome).beam([-1.9, 0.62, 0.98], [-0.1, 0.55, 0.98], 0.09, C.chrome);
    b.box([-1.5, 1.45, 0.7], [0.85, 0.12, 0.45], C.maroon, [0, 0, -0.12]).box([1.55, 1.45, 0.7], [0.8, 0.1, 0.42], C.maroon, [0, 0, -0.15]);
    // Sidecar body and canopy.
    b.box([0.15, 0.75, -0.55], [2.2, 0.35, 1], C.maroon).box([1.15, 1.15, -0.55], [0.3, 0.75, 1], C.maroon).box([-0.85, 1.25, -0.55], [0.24, 1, 1], C.black).box([-0.4, 1.02, -0.55], [0.75, 0.22, 0.9], C.black);
    for (const x of [-0.85, 0.9]) for (const z of [-1, -0.12]) b.beam([x, 1.2, z], [x, 2.55, z], 0.04, C.chrome);
    b.box([0.02, 2.62, -0.56], [2.1, 0.13, 1.15], C.cream).box([0.02, 2.52, 0.03], [2.1, 0.18, 0.04], C.red);
    b.figure([-2.7, 0, -0.4], C.blue).tree([-3.5, 0, -1.9], 1).tree([3.4, 0, -1.7], 1.2);
  },
  'kota-padangsidimpuan'(b) {
    // Salak: scaly-skinned fruit and its spiny palm fronds, for the "City of Salak".
    const fruit = (x: number, y: number, z: number, s: number, tilt = 0) => {
      b.ball([x, y, z], 0.5 * s, '#7a3f22', [0.85, 1.15, 0.85]);
      b.cone([x, y + 0.62 * s, z], 0.17 * s, 0.35 * s, '#5d2f18', 8);
      for (let i = 0; i < 34; i++) {
        const h = 0.9 - (i / 33) * 1.8;
        const q = Math.sqrt(1 - h * h);
        const a = i * 2.4 + tilt;
        b.rock([x + Math.cos(a) * q * 0.43 * s, y + h * 0.56 * s, z + Math.sin(a) * q * 0.43 * s], 0.1 * s, i % 3 ? '#8a4a28' : '#a2602f', [1, 0.75, 0.6]);
      }
    };
    b.cyl([0.3, 0.28, 0.9], 1.7, 1.35, 0.5, '#b58a4e', 20).torus([0.3, 0.54, 0.9], 1.7, 0.08, '#8d6a38', [Math.PI / 2, 0, 0]);
    for (const [x, y, z, s] of [[-0.6, 0.85, 0.8, 1], [0.35, 0.9, 1.35, 1.05], [1.25, 0.85, 0.7, 0.95], [0.25, 0.85, 0.15, 0.95], [0.3, 1.65, 0.8, 1.15]] as const) fruit(x, y, z, s, x);
    fruit(2.7, 0.55, 2, 0.95, 2);
    for (const [px, pz] of [[-2.4, -1.2], [2, -1.8]] as const) {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        const tip: V3 = [px + Math.cos(a) * 1.4, 1.9 + (i % 2) * 0.5, pz + Math.sin(a) * 1.4];
        b.beam([px, 0.1, pz], tip, 0.06, '#6d7a33');
        for (let k = 3; k < 9; k++) b.cone([px + (tip[0] - px) * (k / 9), 0.1 + (tip[1] - 0.1) * (k / 9) + 0.12, pz + (tip[2] - pz) * (k / 9)], 0.11, 0.55, k % 2 ? C.leaf : C.darkLeaf, 4, [Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9]);
      }
    }
    b.cone([-0.2, 0.9, -3], 2.2, 1.8, C.darkLeaf, 10);
  },
  'kota-sibolga'(b) {
    // A coastal fishing boat beside a jetty: Sibolga is known as a city of fish.
    b.pool([0.2, 0, 0.5], 3.7, 2.7);
    const hull = (x: number, z: number, s: number, color: string) => {
      b.box([x, 0.42 * s, z], [2.6 * s, 0.55 * s, 1.05 * s], color);
      for (const side of [-1, 1]) b.cone([x + side * 1.65 * s, 0.42 * s, z], 0.54 * s, 0.75 * s, color, 4, [0, 0, -side * Math.PI / 2]);
      b.box([x, 0.73 * s, z], [2.75 * s, 0.1, 1.15 * s], C.white).box([x - 0.55 * s, 1.15 * s, z], [0.9 * s, 0.75 * s, 0.75 * s], C.white).box([x - 0.55 * s, 1.58 * s, z], [1.05 * s, 0.1, 0.9 * s], C.red);
      for (let i = 0; i < 3; i++) b.box([x - (0.85 - i * 0.3) * s, 1.2 * s, z + 0.39 * s], [0.18 * s, 0.28 * s, 0.04], C.blue);
      b.beam([x + 0.5 * s, 0.75 * s, z], [x + 0.5 * s, 2.7 * s, z], 0.055 * s).beam([x + 0.5 * s, 2.4 * s, z], [x + 1.6 * s, 1.3 * s, z], 0.03 * s).beam([x + 0.5 * s, 2.55 * s, z], [x - 0.5 * s, 1.65 * s, z], 0.02 * s);
      b.box([x + 0.75 * s, 2.55 * s, z], [0.45 * s, 0.26 * s, 0.03], C.red);
    };
    hull(0, 0.6, 1.2, C.blue);
    hull(1.7, -1.2, 0.65, C.green);
    for (let i = 0; i < 8; i++) b.box([-2.8 + i * 0.34, 0.42, -1.5], [0.3, 0.1, 1.2], C.plank);
    b.posts([-2.8, -1.65, -0.5], [-2, -1], 0.4, 0.08);
    for (let i = 0; i < 3; i++) b.cyl([-2.6 + i * 0.5, 0.66, -1.5], 0.2, 0.17, 0.32, '#b58a4e', 10).ball([-2.6 + i * 0.5, 0.85, -1.5], 0.16, C.chrome, [1, 0.45, 0.7]);
    b.figure([-1.1, 0.46, -1.4], C.red).palm([-3.5, 0, -0.4], 2.3).palm([3.4, 0, -1.9], 2).cone([-1.5, 1, -3.4], 2, 2, C.darkLeaf, 9).cone([1.2, 0.8, -3.5], 1.8, 1.6, '#4f6a47', 9);
  },
};
