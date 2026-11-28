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
    // Binjai station: pale walls, blue-grey shutters, a gabled hall and a platform canopy beside the track.
    const wall = '#d9dbd6';
    const trim = '#5f7f8f';
    const roofing = '#6c6f72';
    b.box([0, 0.12, -0.6], [6.2, 0.24, 2.9], C.stone);
    b.box([0, 1.05, -1], [5.4, 1.65, 1.6], wall).roof([0, 1.88, -1], 0.98, 5.6, 0.7, roofing, { turn: Math.PI / 2, gable: wall });
    // The taller entrance bay with its own gable.
    b.box([0, 1.5, -0.55], [1.7, 2.55, 1.5], wall).roof([0, 2.78, -0.5], 1.02, 1.75, 0.8, roofing, { gable: wall });
    b.arch([0, 1.95, 0.22], 0.62, 0.35, trim).arch([0, 0.28, 0.22], 0.7, 0.85, C.darkWood).box([0, 1.62, 0.24], [1.8, 0.1, 0.08], trim);
    for (const x of [-2.25, -1.6, -1.12, 1.12, 1.6, 2.25]) b.arch([x, 0.45, -0.18], 0.34, 0.75, trim);
    // Platform canopy on slender columns.
    for (let i = 0; i < 7; i++) b.cyl([-2.7 + i * 0.9, 0.85, 0.72], 0.045, 0.06, 1.22, trim, 8).beam([-2.7 + i * 0.9, 1.15, 0.72], [-2.45 + i * 0.9, 1.45, 0.72], 0.03, trim);
    b.box([0, 1.5, 0.45], [5.9, 0.1, 0.95], roofing, [0.14, 0, 0]);
    for (let i = 0; i < 20; i++) b.box([-2.85 + i * 0.3, 1.38, 0.92], [0.16, 0.14, 0.05], C.white);
    // Track with sleepers and one carriage.
    for (let i = 0; i < 21; i++) b.box([-3.6 + i * 0.36, 0.05, 1.9], [0.14, 0.07, 1], C.darkWood);
    for (const z of [1.62, 2.18]) b.box([0, 0.13, z], [7.5, 0.07, 0.07], C.metal);
    b.box([1.5, 0.78, 1.9], [2.5, 0.85, 0.82], C.white).box([1.5, 0.55, 1.9], [2.54, 0.22, 0.86], C.red).box([1.5, 1.25, 1.9], [2.4, 0.12, 0.7], C.metal);
    for (let i = 0; i < 5; i++) b.box([0.62 + i * 0.44, 0.95, 2.33], [0.28, 0.3, 0.03], '#2d4352');
    for (const x of [0.6, 1.0, 2.0, 2.4]) for (const z of [1.62, 2.18]) b.cyl([x, 0.26, z], 0.16, 0.16, 0.08, C.black, 12, [Math.PI / 2, 0, 0]);
    // Old water tower.
    b.posts([2.95, 3.55], [-1.65, -1.05], 2.1, 0.07, C.metal);
    b.cyl([3.25, 2.5, -1.35], 0.55, 0.55, 0.8, '#8a6a55', 14).cone([3.25, 3.08, -1.35], 0.62, 0.36, C.darkStone, 14);
    b.beam([2.95, 0.3, -1.05], [3.55, 1.9, -1.05], 0.03, C.metal).beam([3.55, 0.3, -1.05], [2.95, 1.9, -1.05], 0.03, C.metal);
    // The red-and-white heritage marker seen at the entrance.
    b.box([-2.7, 0.55, 0.15], [0.9, 0.6, 0.14], C.maroon).box([-2.7, 0.57, 0.23], [0.72, 0.38, 0.02], C.cream);
    b.figure([-1.2, 0.24, 0.45], C.blue).figure([-0.75, 0.24, 0.55], C.maroon);
    b.tree([-3.55, 0, -1.1], 1.25).palm([-3.7, 0, 0.7], 2);
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
    // Tangga Seratus: a stair climbing a green hill above the harbour town.
    const hill = ['#47703a', '#3e6433', '#547f40'];
    // Hill built from receding terraces, so the stair has a surface to climb.
    for (let i = 0; i < 6; i++) b.cyl([0, 0.3 + i * 0.55, -1.25 - i * 0.12], 2.75 - i * 0.34, 3.05 - i * 0.34, 0.6, hill[i % 3], 14);
    for (let i = 0; i < 24; i++) {
      const a = i * 2.39;
      const level = i % 5;
      const r = 2.5 - level * 0.34;
      const x = Math.cos(a) * r;
      if (Math.abs(x + 0.3) < 0.75 && Math.sin(a) > 0) continue;
      b.rock([x, 0.65 + level * 0.55, -1.25 + Math.sin(a) * r * 0.9], 0.3 + (i % 3) * 0.07, i % 2 ? C.darkLeaf : C.leaf, [1, 0.85, 1]);
    }
    // The stair: two flights with a landing and handrails.
    const steps = 22;
    const at = (t: number): [number, number, number] => [-0.45 + Math.sin(t * Math.PI) * -0.35 + t * 0.35, 0.12 + t * 3.28, 2.05 - t * 3.15];
    for (let i = 0; i < steps; i++) {
      const [x, y, z] = at(i / (steps - 1));
      b.box([x, y, z], [0.95, 0.16, 0.3], i % 2 ? '#cfc9b8' : '#bdb6a3');
      if (i % 3 === 0) for (const side of [-0.52, 0.52]) b.cyl([x + side, y + 0.25, z], 0.03, 0.03, 0.46, C.yellow, 6);
    }
    for (const side of [-0.52, 0.52]) {
      for (let i = 0; i < steps - 3; i += 3) {
        const a = at(i / (steps - 1));
        const c = at((i + 3) / (steps - 1));
        b.beam([a[0] + side, a[1] + 0.48, a[2]], [c[0] + side, c[1] + 0.48, c[2]], 0.035, C.yellow);
      }
    }
    // Summit: the 1929 water-company building and the siren mast.
    b.box([0, 3.55, -1.85], [2.7, 0.16, 1.6], C.stone);
    b.box([0.85, 4.05, -1.95], [1.25, 0.85, 0.9], C.cream).hip([0.85, 4.48, -1.95], 1.5, 1.15, 0.45, C.terracotta, [0.5, 0.1]);
    for (const x of [0.5, 0.85, 1.2]) b.arch([x, 3.75, -1.48], 0.2, 0.34, C.green);
    b.cyl([-0.95, 4.3, -1.95], 0.05, 0.07, 1.35, C.metal, 8).cone([-0.8, 4.98, -1.95], 0.18, 0.34, C.chrome, 12, [0, 0, -Math.PI / 2]).cone([-1.1, 4.98, -1.95], 0.18, 0.34, C.chrome, 12, [0, 0, Math.PI / 2]);
    // Observation cave mouth in the flank.
    b.box([2.05, 1.2, -0.05], [0.95, 0.85, 0.4], C.darkStone, [0, 0.55, 0]).arch([2.17, 0.82, 0.16], 0.46, 0.35, C.black, 0.55);
    // Town roofs, the shore and two boats below.
    for (let i = 0; i < 7; i++) {
      const x = -3.1 + (i % 4) * 0.5 + (i > 3 ? 0.2 : 0);
      const z = 1.1 + (i > 3 ? 0.6 : 0);
      b.box([x, 0.24, z], [0.38, 0.42, 0.4], i % 2 ? C.white : C.cream).hip([x, 0.45, z], 0.5, 0.52, 0.25, i % 3 ? C.terracotta : C.maroon, [0.05, 0.2]);
    }
    b.pool([1.9, 0, 2.55], 2.05, 0.95);
    for (const [x, z, k] of [[1.3, 2.6, 1], [3, 2.45, 0.75]] as const) {
      b.box([x, 0.22 * k, z], [1.05 * k, 0.24 * k, 0.4 * k], C.blue).box([x - 0.15 * k, 0.44 * k, z], [0.4 * k, 0.24 * k, 0.28 * k], C.white);
      b.beam([x + 0.25 * k, 0.3 * k, z], [x + 0.25 * k, 1.05 * k, z], 0.025, C.darkWood).box([x + 0.4 * k, 0.95 * k, z], [0.28 * k, 0.17 * k, 0.02], C.red);
    }
    b.figure([-0.55, 1.05, 1.2], C.red).palm([3.4, 0, 0.6], 2).palm([-3.6, 0, -0.4], 2.3);
  },
};
