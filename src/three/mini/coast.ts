/** Miniature studies: the east coast and its Malay-era buildings. Stylised, not measured replicas. */
import { C, type Builder } from './builder';
import type { Model } from './mainland';

/** A row of arched openings across a front wall. */
const arcade = (b: Builder, y: number, z: number, from: number, step: number, n: number, w: number, h: number, color: string = C.darkWood) => {
  for (let i = 0; i < n; i++) b.arch([from + i * step, y, z], w, h, color);
};

const minaret = (b: Builder, x: number, z: number, h: number, wall: string, cap: string) => {
  b.cyl([x, h / 2, z], 0.2, 0.28, h, wall, 8).torus([x, h * 0.72, z], 0.27, 0.05, cap, [Math.PI / 2, 0, 0]).cyl([x, h + 0.18, z], 0.17, 0.2, 0.36, wall, 8);
  b.dome([x, h + 0.36, z], 0.24, cap);
};

export const coast: Record<string, Model> = {
  'kota-medan'(b) {
    // Istana Maimun: long yellow facade, central porch and pointed roofs.
    b.box([0, 0.12, 0], [7.4, 0.24, 2.9], C.cream);
    b.box([0, 1.1, -0.3], [6.8, 1.75, 1.8], C.yellow);
    arcade(b, 0.3, 0.64, -3, 0.5, 13, 0.3, 0.55);
    arcade(b, 1.28, 0.64, -3, 0.5, 13, 0.24, 0.32, C.green);
    b.box([0, 2.02, -0.3], [7, 0.12, 2], C.green);
    for (const x of [-2.4, 2.4]) b.hip([x, 2.08, -0.3], 1.9, 1.9, 0.8, C.black, [0.5, 0.5]).dome([x, 2.86, -0.3], 0.28, C.black);
    b.hip([-1, 2.08, -0.3], 1.1, 1.7, 0.45, C.black, [0.3, 0.8]).hip([1, 2.08, -0.3], 1.1, 1.7, 0.45, C.black, [0.3, 0.8]);
    b.box([0, 1.35, 0.85], [2.1, 2.2, 1], C.yellow);
    arcade(b, 0.3, 1.36, -0.65, 0.65, 3, 0.42, 0.75);
    arcade(b, 1.55, 1.36, -0.65, 0.65, 3, 0.36, 0.45, C.green);
    b.box([0, 2.52, 0.85], [2.3, 0.14, 1.2], C.green).box([0, 2.85, 0.85], [1.3, 0.55, 0.8], C.yellow).dome([0, 3.12, 0.85], 0.55, C.black);
    b.stairs(0, 1.45, 0.3, 1.5, C.cream, 4);
    b.palm([-3.9, 0, 1.6], 2).palm([3.6, 0, 1.6], 2);
    for (let i = 0; i < 10; i++) b.box([-0.0, 0.03, 2.3 + i * 0.2], [1, 0.05, 0.18], C.stone);
  },
  langkat(b) {
    // Masjid Azizi: yellow-and-green mosque with a large central dome.
    b.box([0, 0.12, 0], [6, 0.24, 5], C.cream).box([0, 1.15, 0], [3.9, 1.85, 3.2], C.yellow);
    arcade(b, 0.35, 1.62, -1.5, 0.6, 6, 0.36, 0.75);
    for (const x of [-1.96, 1.96]) for (let i = 0; i < 4; i++) b.arch([x, 0.4, -1.1 + i * 0.72], 0.34, 0.7, C.green, Math.PI / 2);
    b.box([0, 2.14, 0], [4.15, 0.16, 3.45], C.green).cyl([0, 2.6, 0], 1.15, 1.2, 0.8, C.cream, 8).dome([0, 3, 0], 1.18, C.black);
    for (const x of [-1.55, 1.55]) for (const z of [-1.2, 1.2]) b.cyl([x, 2.45, z], 0.35, 0.38, 0.48, C.yellow, 10).dome([x, 2.69, z], 0.38, C.black);
    b.box([0, 0.9, 2.05], [1.6, 1.35, 0.8], C.cream).arch([0, 0.3, 2.47], 0.65, 0.65, C.green).box([0, 1.65, 2.05], [1.75, 0.14, 0.95], C.green).dome([0, 1.72, 2.05], 0.42, C.black);
    minaret(b, 2.75, 1.6, 3.4, C.yellow, C.black);
    b.palm([-3, 0, 1.8], 2.2).tree([-3, 0, -1.6], 1.2);
  },
  'serdang-bedagai'(b) {
    // Sulaimaniyah mosque in Perbaungan: low wide hall with a verandah and tiered roof.
    b.box([0, 0.14, 0], [5.6, 0.28, 4.2], C.stone).box([0, 1, -0.2], [3.9, 1.45, 2.9], C.yellow);
    for (let i = 0; i < 8; i++) b.cyl([-2.35 + i * 0.67, 0.95, 1.75], 0.09, 0.09, 1.35, C.cream, 8);
    b.box([0, 1.7, 1.5], [5.1, 0.14, 0.85], C.green);
    arcade(b, 0.32, 1.28, -1.35, 0.9, 4, 0.42, 0.65, C.green);
    b.hip([0, 1.78, -0.2], 5, 4, 0.75, C.green, [2.5, 1.9]).box([0, 2.72, -0.2], [2.2, 0.4, 1.7], C.yellow);
    b.hip([0, 2.92, -0.2], 2.8, 2.3, 0.7, C.green, [0.9, 0.7]).dome([0, 3.62, -0.2], 0.5, C.gold);
    for (const x of [-2.55, 2.55]) b.box([x, 1.2, 1.9], [0.42, 1.9, 0.42], C.white).dome([x, 2.15, 1.9], 0.24, C.gold);
    b.stairs(0, 2.15, 0.28, 1.4, C.cream, 3);
    b.palm([-3.5, 0, -0.5], 2.5).palm([3.2, 0, -0.9], 2.2).tree([3.3, 0, 1.6], 0.9);
  },
  'kota-tanjungbalai'(b) {
    // Masjid Raya Sultan Ahmadsyah: long white Malay mosque with a separate tower.
    b.box([0, 0.12, 0], [6.4, 0.24, 3.8], C.stone).box([-0.4, 0.98, 0], [4.8, 1.5, 2.5], C.white);
    arcade(b, 0.32, 1.27, -2.4, 0.57, 8, 0.32, 0.65, C.green);
    b.box([-0.4, 1.8, 0], [5.15, 0.16, 2.85], C.yellow).hip([-0.4, 1.88, 0], 5.1, 2.85, 0.85, C.maroon, [3, 0.6]);
    b.box([-0.4, 2.85, 0], [1.5, 0.45, 1.1], C.white).hip([-0.4, 3.08, 0], 2, 1.55, 0.65, C.maroon, [0.4, 0.2]).dome([-0.4, 3.72, 0], 0.22, C.gold);
    for (let i = 0; i < 24; i++) for (const z of [-1.44, 1.44]) b.cone([-2.9 + i * 0.217, 1.64, z], 0.075, 0.22, C.yellow, 4, [Math.PI, 0, 0]);
    b.box([-0.4, 0.95, 1.5], [1.25, 1.45, 0.55], C.white).arch([-0.4, 0.3, 1.79], 0.55, 0.75, C.green).box([-0.4, 1.74, 1.5], [1.45, 0.14, 0.72], C.yellow).dome([-0.4, 1.8, 1.55], 0.45, C.green);
    b.box([-3, 0.9, 0], [0.7, 1.3, 1.6], C.yellow).hip([-3, 1.55, 0], 0.95, 1.85, 0.5, C.maroon, [0.1, 0.7]);
    minaret(b, 2.75, 0.5, 2.7, C.white, C.green);
    b.pool([0.5, 0, 2.9], 1.9, 0.6).palm([-3.5, 0, 1.6], 2).tree([3.4, 0, -1.4], 1.1);
  },
  labuhanbatu(b) {
    // Rantauprapat grand mosque, following open photographs: yellow walls, green piers, a dark dome and one minaret.
    const yellow = '#e3c23f';
    const green = '#2f6b45';
    const slate = '#3d4448';
    b.box([0, 0.12, 0], [6.2, 0.24, 4.6], C.cream).box([0.6, 1.05, -0.3], [3.9, 1.65, 2.9], yellow);
    for (let i = 0; i < 6; i++) b.box([-1.3 + i * 0.76, 1.15, 1.2], [0.16, 1.9, 0.16], green).cone([-1.3 + i * 0.76, 2.22, 1.2], 0.11, 0.26, yellow, 4);
    for (let i = 0; i < 5; i++) b.arch([-0.92 + i * 0.76, 0.3, 1.17], i === 2 ? 0.5 : 0.4, i === 2 ? 0.95 : 0.65, C.darkWood);
    b.box([0.6, 1.93, -0.3], [4.1, 0.14, 3.1], green).hip([0.6, 2, -0.3], 3.9, 2.9, 0.42, slate, [2.2, 1.7]);
    // Porch gable in the middle of the front.
    b.box([0.6, 1.1, 1.55], [1.5, 1.7, 0.6], yellow).arch([0.6, 0.28, 1.87], 0.8, 0.9, C.black).torus([0.6, 1.2, 1.9], 0.46, 0.07, green, [0, 0, 0], Math.PI);
    b.hip([0.6, 1.96, 1.55], 1.7, 0.8, 0.4, green, [0.3, 0.1]);
    b.cyl([0.6, 2.7, -0.4], 0.92, 0.98, 0.7, yellow, 8);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      b.box([0.6 + Math.sin(a) * 0.92, 2.7, -0.4 + Math.cos(a) * 0.92], [0.28, 0.38, 0.04], green, [0, a, 0]);
    }
    b.dome([0.6, 3.05, -0.4], 0.96, slate);
    minaret(b, -2.4, 0.7, 3.6, yellow, slate);
    for (const y of [1.2, 2.1]) b.torus([-2.4, y, 0.7], 0.29, 0.06, green, [Math.PI / 2, 0, 0]);
    b.box([3.0, 0.75, 0.4], [0.5, 1.05, 2], green).box([3.0, 1.33, 0.4], [0.58, 0.12, 2.1], yellow);
    b.stairs(0.6, 2.2, 0.24, 1.5, C.stone, 3).tree([-3.4, 0, -1.2], 1.2).palm([3.5, 0, -1.3], 2.1);
  },
  'labuhanbatu-utara'(b) {
    // Al-Haji Muhammad Syah mosque (Kualuh): Malay and Middle Eastern blend.
    b.box([0, 0.1, 0], [5.2, 0.2, 4], C.stone).box([0, 0.95, -0.2], [3.5, 1.5, 2.7], C.cream);
    b.box([0, 1.35, 1.2], [3.9, 1.1, 0.25], C.green).arch([0, 0.2, 1.36], 0.8, 0.9, C.darkWood);
    for (const x of [-1.35, 1.35]) b.arch([x, 0.45, 1.36], 0.45, 0.6, C.darkWood).box([x * 1.5, 1.3, 1.2], [0.34, 2.2, 0.34], C.cream).dome([x * 1.5, 2.4, 1.2], 0.2, C.green);
    for (let i = 0; i < 13; i++) b.box([-1.8 + i * 0.3, 2, 1.2], [0.16, 0.2, 0.2], C.cream);
    b.roof([0, 1.72, -0.35], 2.1, 2.9, 0.85, C.maroon, { gable: C.cream });
    b.cyl([0, 2.75, -0.35], 0.68, 0.74, 0.75, C.cream, 8).dome([0, 3.12, -0.35], 0.74, C.green);
    b.pool([-2.7, 0, 1.9], 0.8, 0.55).palm([-3.1, 0, -0.8], 2.4).palm([3, 0, -1], 2).tree([3.1, 0, 1.5], 1);
  },
  'labuhanbatu-selatan'(b) {
    // Istana Bahran: today only ruins remain.
    b.box([0, 0.15, 0], [6, 0.3, 3.6], C.darkStone);
    const heights = [2.1, 1.5, 2.4, 0.8, 1.2, 2, 1, 1.7];
    heights.forEach((h, i) => {
      const x = -2.45 + i * 0.7;
      b.box([x, 0.3 + h / 2, -1.2], [0.28, h, 0.4], C.white).box([x, 0.34 + h, -1.2], [0.4, 0.12, 0.52], C.cream);
      if (i % 3 !== 1) b.box([x + 0.35, 0.55, -1.2], [0.45, 0.5, 0.3], '#cfc6ad');
    });
    for (const x of [-2.45, -1.05]) b.torus([x + 0.35, 1.75, -1.2], 0.36, 0.1, '#cfc6ad', [0, 0, 0], Math.PI);
    for (const z of [-0.4, 0.4, 1.2]) b.box([-2.8, 0.7 + z * 0.2, z], [0.3, 0.8 + z * 0.4, 0.3], C.white).box([2.8, 0.55, z], [0.3, 0.5, 0.3], C.white);
    for (let i = 0; i < 28; i++) b.rock([Math.cos(i * 2.4) * (0.6 + (i % 5) * 0.55), 0.38, 0.35 + Math.sin(i * 1.9) * 1.1], 0.12 + (i % 3) * 0.05, i % 2 ? '#b9ae95' : C.brick);
    b.stairs(0, 1.85, 0.3, 1.8, C.stone, 3);
    b.tree([-1, 0.3, -0.1], 0.7).tree([3.5, 0, -1.2], 1.6).tree([-3.6, 0, -0.8], 1.3).rock([1.5, 0.45, -0.9], 0.3, C.darkLeaf);
  },
  'batu-bara'(b) {
    // Istana Niat Lima Laras: two-storey timber palace mixing Malay, Chinese and European influences.
    b.posts([-2.2, -1.1, 0, 1.1, 2.2], [-1, 0, 1], 0.55, 0.13, C.darkWood);
    b.box([0, 0.62, 0], [5.3, 0.14, 2.7], C.plank).box([0, 1.2, -0.15], [4.7, 1.05, 2.1], '#7d5a3c');
    for (let i = 0; i < 9; i++) b.box([-2 + i * 0.5, 1.25, 0.93], [0.26, 0.6, 0.05], i % 2 ? C.green : C.darkWood);
    b.hip([0, 1.74, -0.15], 5.6, 2.9, 0.4, C.maroon, [4.2, 1.6]);
    b.box([0, 2.55, -0.15], [3.4, 0.9, 1.7], '#7d5a3c');
    for (let i = 0; i < 7; i++) b.box([-1.35 + i * 0.45, 2.55, 0.72], [0.24, 0.52, 0.05], i % 2 ? C.darkWood : C.green);
    b.roof([0, 3.02, -0.15], 1.15, 4, 0.85, C.maroon, { turn: Math.PI / 2, sweep: 0.2, gable: C.cream });
    b.box([0, 2.2, 1.3], [1.5, 0.1, 0.9], C.plank).roof([0, 2.85, 1.15], 0.95, 1.2, 0.65, C.maroon, { sweep: 0.12, gable: C.cream });
    for (const x of [-0.65, 0.65]) b.beam([x, 0.65, 1.7], [x, 2.85, 1.7], 0.07, C.cream);
    for (let i = 0; i < 12; i++) b.box([-2.5 + i * 0.45, 0.92, 1.3], [0.06, 0.46, 0.06], C.cream);
    b.stairs(0, 1.75, 0.62, 0.9, C.plank, 5).palm([-3.4, 0, 0.9], 2.6).palm([3.2, 0, -0.9], 2.9);
  },
  'deli-serdang'(b) {
    // Benteng Putri Hijau: surviving earth ramparts and a ditch.
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 1.65 + 0.9;
      const x = Math.cos(a) * 2.9;
      const z = Math.sin(a) * 2.4;
      b.add(wedge(), i % 2 ? '#8b6a45' : '#7a5c3c', [x, 0, z], [0, -a, 0]);
      if (i % 2 === 0) b.rock([x, 0.95, z], 0.28, C.grass, [1.2, 0.6, 1.2]);
      if (i % 3 === 0) b.rock([Math.cos(a) * 3.75, 0.05, Math.sin(a) * 3.2], 0.3, C.water, [1.5, 0.2, 1.5]);
    }
    b.pool([0.1, 0, 0.2], 0.55, 0.45);
    for (let i = 0; i < 7; i++) b.box([0.2 + Math.sin(i) * 0.25, 0.04, 2.9 - i * 0.38], [0.55, 0.07, 0.3], C.earth);
    b.box([-0.9, 0.6, 1.5], [0.08, 1.1, 0.08], C.darkWood).box([-0.9, 1.15, 1.5], [0.8, 0.45, 0.07], C.cream);
    b.tree([-1.4, 0, -0.8], 1.8).tree([1.2, 0, -1], 1.4).tree([0, 0, -3.4], 1.5).palm([1.7, 0, 1], 2.1).tree([-2, 0, 0.5], 1);
  },
  asahan(b) {
    // Ponot waterfall and the Asahan river rapids.
    for (let i = 0; i < 22; i++) {
      const x = -2.6 + (i % 7) * 0.88;
      const row = Math.floor(i / 7);
      if (Math.abs(x) < 0.75) continue;
      b.rock([x, 0.7 + row * 1.15, -2 - row * 0.25], 1.05, i % 2 ? '#5f6b4c' : '#6e705f', [1, 1.15, 0.8]);
    }
    b.box([0, 1.9, -2.55], [1.7, 3.8, 0.5], C.darkStone);
    for (const [x, w] of [[-0.35, 0.3], [0.05, 0.42], [0.45, 0.22]] as const) b.box([x, 2, -2.2], [w, 3.7, 0.12], C.foam, [0.06, 0, 0]);
    for (let i = 0; i < 12; i++) b.rock([Math.cos(i * 2.3) * 0.65, 0.22 + (i % 3) * 0.08, -1.75 + Math.sin(i) * 0.25], 0.22, C.foam, [1, 0.6, 1]);
    b.pool([0, 0, -1.1], 1.5, 0.8);
    for (let i = 0; i < 9; i++) b.box([Math.sin(i * 0.8) * 0.7, 0.04, -0.5 + i * 0.45], [1.5, 0.07, 0.55], i % 2 ? C.water : '#48a6bc', [0, Math.cos(i * 0.8) * 0.4, 0]);
    for (let i = 0; i < 14; i++) b.rock([(i % 2 ? 1 : -1) * (1 + (i % 3) * 0.12) + Math.sin(i * 0.4) * 0.5, 0.14, -0.3 + i * 0.26], 0.2, i % 3 ? C.stone : C.foam);
    // A raft on the rapids.
    b.torus([0.35, 0.2, 1.8], 0.5, 0.17, C.orange, [Math.PI / 2, 0, 0]).figure([0.15, 0.1, 1.8], C.blue).figure([0.6, 0.05, 1.9], C.red);
    b.tree([-2.5, 0, 0.5], 1.7).tree([2.5, 0, 0.1], 1.9).pine([-2.9, 0, 2], 1.3).tree([2.7, 0, 2.2], 1.1).tree([-2.8, 3.1, -2.3], 1.1).tree([2.5, 3.1, -2.3], 1.2);
  },
};

import { CylinderGeometry } from 'three';
/** One segment of rampart: a low trapezoid mound. */
function wedge() {
  return new CylinderGeometry(0.28, 0.6, 1, 6);
}
