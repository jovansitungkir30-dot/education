/** Miniature studies: highlands and Tapanuli. All are stylised representations, not measured replicas. */
import { Builder, C, type V3 } from './builder';

export type Model = (b: Builder) => void;

const crop = (b: Builder, x: number, z: number, n: number, color: string) => {
  for (let i = 0; i < n; i++) b.rock([x + i * 0.42, 0.14, z], 0.15, color);
};

export const mainland: Record<string, Model> = {
  karo(b) {
    b.posts([-1.5, -0.5, 0.5, 1.5], [-1.5, -0.5, 0.5, 1.5], 0.9, 0.11);
    b.box([0, 0.96, 0], [3.7, 0.14, 3.7], C.wood).box([0, 1.45, 0], [3.2, 0.85, 3.2], C.darkWood);
    b.box([0, 1.3, 1.62], [0.55, 0.75, 0.05], C.black);
    for (const x of [-1.1, -0.65, 0.65, 1.1]) b.box([x, 1.55, 1.62], [0.26, 0.3, 0.05], C.black);
    for (let i = 0; i < 16; i++) b.box([-1.5 + i * 0.2, 1.88, 1.65], [0.12, 0.12, 0.04], i % 2 ? C.white : C.red);
    b.hip([0, 1.95, 0], 5, 5, 1, C.thatch, [2.5, 2.5]);
    b.box([0, 3.02, 0], [2.4, 0.16, 2.4], C.maroon);
    b.roof([0, 3.08, 0], 1.3, 2.9, 1.35, C.thatch, { sweep: 0.14 });
    b.roof([0, 3.38, 0], 0.7, 3.1, 0.8, C.thatch, { sweep: 0.08, turn: Math.PI / 2 });
    b.box([0, 0.78, 2.15], [1.9, 0.1, 0.75], C.yellow);
    b.stairs(0, 2.55, 0.78, 0.7);
    crop(b, 2.4, 2.4, 5, C.grass);
    crop(b, 2.4, 3, 5, C.leaf);
    b.pine([-3.2, 0, -1.6], 1.5).pine([-3.4, 0, 0.6], 1.2).pine([3.3, 0, -1.8], 1.6);
  },
  simalungun(b) {
    b.posts([-1.2, 0, 1.2], [-2, -1, 0, 1, 2], 1.1, 0.14, C.wood);
    for (const y of [0.45, 0.75]) b.box([-1.2, y, 0], [0.14, 0.14, 4.3], C.darkWood).box([1.2, y, 0], [0.14, 0.14, 4.3], C.darkWood);
    b.box([0, 1.2, 0], [2.9, 0.2, 4.5], C.darkWood).box([0, 1.75, 0], [2.6, 0.9, 4.1], C.wood);
    for (let i = 0; i < 20; i++) b.box([1.32, 1.62, -1.9 + i * 0.2], [0.04, 0.22, 0.1], i % 2 ? C.white : C.red);
    for (const x of [-0.7, 0.7]) b.box([x, 1.8, 2.08], [0.42, 0.5, 0.05], C.black);
    b.hip([0, 2.2, 0], 4.3, 5.8, 1.35, C.palmFibre, [1.1, 2.9]);
    b.roof([0, 3.5, 0], 0.65, 2.9, 0.75, C.palmFibre, { flare: 1.15, gable: C.cream });
    b.roof([0, 2.35, 2.35], 0.75, 1, 0.85, C.palmFibre, { gable: C.cream });
    b.stairs(0, 2.3, 1.2, 0.8, C.plank, 7);
    b.tree([-3.2, 0, 1.4], 1.4).tree([3.2, 0, -1.5], 1.2).palm([-3.1, 0, -1.8], 2.6);
  },
  toba(b) {
    // Balige market hall: open halls with sweeping roofs and decorated gables.
    for (const [x, z, s] of [[-1.9, 0, 1], [1.1, 0, 1.15], [3.6, -0.2, 0.75]] as const) {
      b.box([x, 0.08, z], [2.3 * s, 0.16, 3 * s], C.stone);
      b.posts([x - 0.95 * s, x + 0.95 * s], [z - 1.3 * s, z - 0.45 * s, z + 0.45 * s, z + 1.3 * s], 1.35 * s, 0.07, C.white);
      b.box([x, 1.42 * s, z], [2.15 * s, 0.12, 2.9 * s], C.white);
      b.roof([x, 1.46 * s, z], 1.3 * s, 3.1 * s, 1 * s, C.terracotta, { sweep: 0.7 * s });
      for (let i = 0; i < 5; i++) b.box([x + (i - 2) * 0.22 * s, 1.66 * s, z + 1.56 * s], [0.12 * s, 0.12 * s, 0.04], i % 2 ? C.white : C.black, [0, 0, 0.78]);
      b.box([x, 0.4, z + 0.5 * s], [1.5 * s, 0.45, 0.5], C.plank);
      for (let i = 0; i < 4; i++) b.ball([x - 0.5 * s + i * 0.34 * s, 0.7, z + 0.5 * s], 0.13, [C.orange, C.grass, C.red, C.yellow][i]);
    }
    b.figure([-0.5, 0, 2.5], C.maroon).figure([0.3, 0, 2.8], C.blue).tree([-3.9, 0, 1.6], 1.2);
  },
  samosir(b) {
    b.pool([0.4, 0, 3], 3.6, 1.7);
    b.posts([-1.2, -0.4, 0.4, 1.2], [-2.2, -1.5, -0.8, -0.1, 0.6], 1, 0.1);
    b.box([0, 1.07, -0.8], [2.8, 0.16, 3.3], C.wood).box([0, 1.55, -0.8], [2.55, 0.85, 3], C.darkWood);
    for (const x of [-1.29, 1.29]) for (let i = 0; i < 13; i++) b.box([x, 1.55, -2.1 + i * 0.22], [0.04, 0.2, 0.11], i % 2 ? C.white : C.red);
    b.box([0, 1.4, 0.72], [0.55, 0.55, 0.05], C.black);
    b.roof([0, 1.85, -0.8], 1.75, 3.7, 1.1, C.thatch, { sweep: 0.95, flare: 1.35 });
    for (let i = 0; i < 7; i++) b.box([(i - 3) * 0.24, 2.3, 1.07], [0.13, 0.13, 0.04], i % 2 ? C.white : C.black, [0, 0, 0.78]);
    b.stairs(0, 0.85, 1.07, 0.7);
    b.box([1.8, 0.2, 3.2], [1.5, 0.16, 0.42], C.wood, [0, -0.3, 0]).box([1.8, 0.34, 3.2], [1.55, 0.1, 0.07], C.darkWood, [0, -0.3, 0]);
    b.palm([-3, 0, 0.6], 2.4).pine([3.1, 0, -1.4], 1.4).pine([2.7, 0, -2.6], 1.1);
    b.cone([-2.6, 0.9, -3], 1.5, 1.8, C.darkLeaf, 9).cone([0.4, 1.1, -3.7], 1.8, 2.2, '#4f6a47', 9);
  },
  'mandailing-natal'(b) {
    b.posts([-2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7], [-1.9, -0.7], 1.15, 0.1);
    b.box([0, 1.22, -1.3], [5.9, 0.16, 2.2], C.wood).box([0, 1.85, -1.4], [5.6, 1.1, 1.8], C.darkWood);
    for (const x of [-2.1, -1.3, 1.3, 2.1]) b.box([x, 1.9, -0.48], [0.36, 0.5, 0.05], C.black);
    for (let i = 0; i < 23; i++) b.box([-2.75 + i * 0.25, 1.52, -0.22], [0.06, 0.38, 0.06], C.plank);
    b.box([0, 1.74, -0.22], [5.8, 0.07, 0.09], C.plank);
    b.roof([0, 2.42, -1.35], 1.45, 6.2, 1.1, C.thatch, { sweep: 0.5, turn: Math.PI / 2, gable: C.darkWood });
    b.roof([0, 2.48, -0.6], 1.05, 1.3, 1.35, C.thatch, { sweep: 0.12 });
    for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) b.box([(i - (3 - row) / 2) * 0.3, 2.75 + row * 0.22, 0.06], [0.15, 0.15, 0.05], (row + i) % 2 ? C.white : C.red, [0, 0, 0.78]);
    b.stairs(0, -0.1, 1.22, 1.1);
    // Gordang drums in front, graded from large to small.
    for (let i = 0; i < 9; i++) {
      const s = 1 - Math.abs(i - 4) * 0.1;
      b.cyl([(i - 4) * 0.46, 0.5 * s, 2.3], 0.2 * s, 0.14 * s, 1 * s, C.wood, 12).cyl([(i - 4) * 0.46, 1.01 * s, 2.3], 0.21 * s, 0.21 * s, 0.05, C.cream, 12);
    }
    b.box([0, 0.05, 2.3], [4.4, 0.1, 0.8], C.darkWood);
    b.palm([-3.4, 0, 1.3], 2.5).palm([3.4, 0, 0.6], 2.2);
  },
  'tapanuli-selatan'(b) {
    // A loom with abit godang style cloth, plus folded textiles.
    b.box([0, 0.08, 0], [5, 0.16, 3.6], C.plank);
    for (const x of [-1.6, 1.6]) {
      b.beam([x, 0.1, -1], [x, 2.7, -1], 0.12).beam([x, 0.1, 1], [x, 1.1, 1], 0.1).beam([x, 1.1, 1], [x, 1.1, -1], 0.08);
    }
    b.beam([-1.8, 2.6, -1], [1.8, 2.6, -1], 0.1).beam([-1.7, 1.15, 1], [1.7, 1.15, 1], 0.11);
    for (let i = 0; i < 40; i++) b.beam([-1.4 + i * 0.072, 2.55, -0.98], [-1.4 + i * 0.072, 1.2, 0.95], 0.012, i % 5 === 0 ? C.white : C.maroon);
    const bands = [C.red, C.black, C.red, C.gold, C.red, C.black, C.white, C.red];
    bands.forEach((color, i) => b.box([0, 1.17, 0.35 + i * 0.09], [2.85, 0.04, 0.09], color, [-0.0, 0, 0]));
    for (let i = 0; i < 18; i++) b.beam([-1.35 + i * 0.16, 1.14, 1.12], [-1.35 + i * 0.16, 0.72, 1.18], 0.014, C.gold);
    [C.maroon, C.black, C.red, C.blue].forEach((color, i) => b.box([2.15, 0.28 + i * 0.2, 0.7], [0.75, 0.18, 1.1], color, [0, i * 0.08, 0]));
    b.figure([0, 0.16, 1.75], C.blue);
    for (const x of [-2.2, -2.5]) b.cyl([x, 0.35, -0.6], 0.2, 0.2, 0.4, C.gold, 10).cyl([x, 0.35, 0], 0.2, 0.2, 0.4, C.red, 10);
    b.tree([-3.4, 0, 1.4], 1.2).pine([3.3, 0, -1.4], 1.3);
  },
  'tapanuli-utara'(b) {
    // A large cross on a forested hill above Tarutung.
    b.cone([0, 0.75, -0.3], 3.4, 1.5, C.grass, 18).cyl([0, 1.5, -0.3], 0.85, 1.1, 0.35, C.stone, 18);
    b.box([0, 3.35, -0.3], [0.42, 3.4, 0.28], C.white).box([0, 4.05, -0.3], [1.9, 0.42, 0.28], C.white);
    b.box([0, 1.74, -0.3], [1.1, 0.18, 0.9], C.cream);
    for (let i = 0; i < 9; i++) b.box([0.05 * i, 0.12 + i * 0.17, 2.9 - i * 0.3], [0.9, 0.1, 0.32], C.cream);
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      if (Math.abs(Math.sin(a)) < 0.35 || Math.cos(a) < 0.7) b.pine([Math.cos(a) * (2 + (i % 3) * 0.55), 0.25, -0.3 + Math.sin(a) * (2 + (i % 3) * 0.55)], 0.9 + (i % 3) * 0.2);
    }
  },
  'tapanuli-tengah'(b) {
    // Mahligai tomb complex: old headstones on a hill. Shown quietly, without inscriptions.
    b.cyl([0, 0.3, 0], 3.1, 3.9, 0.6, C.grass, 22).cyl([0, 0.68, 0], 2.4, 2.7, 0.18, C.earth, 22);
    const spots: [number, number, number][] = [[-1.5, -0.8, 1], [-0.8, 0.5, 0.7], [0, -1.2, 1.5], [0.9, -0.2, 0.85], [1.6, 0.8, 0.65], [-0.2, 1.3, 0.75], [1.4, -1.2, 0.9], [-1.7, 0.7, 0.6], [0.35, 0.35, 1.1]];
    for (const [x, z, h] of spots) {
      b.box([x, 0.8, z], [0.55, 0.1, 0.85], C.darkStone);
      for (const dz of [-0.3, 0.3]) {
        b.box([x, 0.8 + (h * (dz < 0 ? 1 : 0.6)) / 2, z + dz], [0.24, h * (dz < 0 ? 1 : 0.6), 0.12], C.stone);
        b.cyl([x, 0.86 + h * (dz < 0 ? 1 : 0.6), z + dz], 0.08, 0.12, 0.14, C.cream, 8);
      }
    }
    for (let i = 0; i < 6; i++) b.box([0, 0.08 + i * 0.12, 3.9 - i * 0.26], [1, 0.1, 0.28], C.stone);
    b.tree([-2.7, 0.55, -1.5], 1.8).tree([2.6, 0.55, -1.7], 1.5).tree([-2.9, 0.4, 1.4], 1.1);
  },
  'humbang-hasundutan'(b) {
    // Palace compound at Bakkara: three traditional houses behind a stone wall.
    for (const [x, z, s] of [[0, -1.2, 1], [-2.3, 0.5, 0.7], [2.3, 0.5, 0.7]] as const) {
      b.posts([x - 0.7 * s, x, x + 0.7 * s], [z - 0.9 * s, z, z + 0.9 * s], 0.8 * s, 0.09 * s);
      b.box([x, 0.86 * s, z], [1.75 * s, 0.14, 2.2 * s], C.wood).box([x, 1.28 * s, z], [1.55 * s, 0.7 * s, 2 * s], C.darkWood);
      b.roof([x, 1.58 * s, z], 1.15 * s, 2.5 * s, 0.9 * s, C.palmFibre, { sweep: 0.62 * s, flare: 1.3 });
      b.box([x, 1.2 * s, z + 1.02 * s], [0.4 * s, 0.42 * s, 0.05], C.black);
    }
    for (let i = 0; i < 17; i++) {
      if (i === 8) continue;
      b.rock([-3.4 + i * 0.43, 0.22, 2.5], 0.27, i % 2 ? C.stone : C.darkStone);
    }
    for (let i = 0; i < 11; i++) b.rock([-3.5, 0.22, 2.1 - i * 0.43], 0.27, C.darkStone).rock([3.5, 0.22, 2.1 - i * 0.43], 0.27, C.stone);
    b.tree([-0.9, 0, 1.2], 1).pine([-3, 0, -2.4], 1.6).pine([3, 0, -2.5], 1.8).cone([0, 1.1, -3.8], 2.4, 2.2, C.darkLeaf, 10);
  },
  'pakpak-bharat'(b) {
    // Mejan: stone figures of a rider on an elephant or horse, set on plinths.
    const rider = (x: number, z: number, s: number, trunk: boolean) => {
      b.box([x, 0.2 * s, z], [1.7 * s, 0.4 * s, 1.2 * s], C.darkStone);
      for (const dx of [-0.45, 0.45]) for (const dz of [-0.25, 0.25]) b.cyl([x + dx * s, 0.65 * s, z + dz * s], 0.14 * s, 0.17 * s, 0.5 * s, C.stone, 8);
      b.box([x, 1.05 * s, z], [1.3 * s, 0.55 * s, 0.75 * s], C.stone);
      b.box([x + 0.78 * s, 1.3 * s, z], [0.45 * s, 0.55 * s, 0.5 * s], C.stone);
      if (trunk) b.beam([x + 1 * s, 1.2 * s, z], [x + 1.18 * s, 0.55 * s, z], 0.1 * s, C.stone);
      else b.box([x + 1.05 * s, 1.5 * s, z], [0.4 * s, 0.25 * s, 0.28 * s], C.stone);
      b.cyl([x - 0.1 * s, 1.65 * s, z], 0.18 * s, 0.25 * s, 0.65 * s, C.darkStone, 8).ball([x - 0.1 * s, 2.12 * s, z], 0.2 * s, C.stone);
      b.beam([x, 1.75 * s, z], [x + 0.55 * s, 1.55 * s, z], 0.07 * s, C.darkStone);
    };
    rider(-0.4, 0, 1.35, true);
    rider(2.2, 0.9, 0.85, false);
    rider(-2.6, 1.1, 0.75, false);
    for (let i = 0; i < 12; i++) b.box([-2.6 + i * 0.48, 0.03, 2.4], [0.4, 0.06, 0.6], i % 2 ? C.darkStone : C.stone);
    b.pine([-2.9, 0, -1.7], 1.9).pine([-1, 0, -2.6], 1.5).pine([1.4, 0, -2.4], 2).tree([3.1, 0, -1], 1.4);
  },
  dairi(b) {
    // Sidikalang coffee: bushes with red cherries, a sack of beans and a cup.
    for (const [x, z] of [[-2.4, -1.3], [-1, -1.8], [-2.8, 0.4], [0.5, -2.2], [-1.6, -0.3]] as const) {
      b.cyl([x, 0.35, z], 0.07, 0.1, 0.7, C.darkWood, 6).rock([x, 0.95, z], 0.55, C.darkLeaf).rock([x + 0.25, 1.25, z], 0.35, C.leaf);
      for (let i = 0; i < 9; i++) b.ball([x + Math.cos(i * 2.2) * 0.52, 0.8 + (i % 4) * 0.18, z + Math.sin(i * 2.2) * 0.52], 0.07, i % 4 ? C.red : C.yellow);
    }
    b.cyl([0.5, 0.7, 0.9], 0.62, 0.8, 1.4, '#b79668', 14).torus([0.5, 1.42, 0.9], 0.6, 0.09, '#a58558', [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 40; i++) b.ball([0.5 + Math.cos(i * 2.4) * (i % 5) * 0.11, 1.46 + (i % 3) * 0.03, 0.9 + Math.sin(i * 2.4) * (i % 5) * 0.11], 0.09, C.coffee, [1.3, 0.7, 0.9]);
    b.cyl([2.5, 0.08, 1.4], 0.85, 0.85, 0.12, C.white, 24).cyl([2.5, 0.55, 1.4], 0.55, 0.4, 0.8, C.white, 22).cyl([2.5, 0.96, 1.4], 0.48, 0.48, 0.03, C.coffee, 22).torus([3.1, 0.55, 1.4], 0.22, 0.07, C.white);
    for (let i = 0; i < 18; i++) b.ball([1.3 + (i % 6) * 0.22, 0.06, 2.3 + Math.floor(i / 6) * 0.2], 0.09, C.coffee, [1.3, 0.7, 0.9]);
    b.cyl([2.2, 0.35, -0.8], 0.9, 0.75, 0.2, C.plank, 18).cyl([2.2, 0.47, -0.8], 0.8, 0.8, 0.04, '#9c8354', 18);
  },
  'padang-lawas-utara'(b) {
    // Biaro Bahal: red-brick temple on a stepped base.
    b.box([0, 0.2, 0], [4.6, 0.4, 4.6], C.darkBrick).box([0, 0.55, 0], [4, 0.3, 4], C.brick).box([0, 0.85, 0], [3.3, 0.3, 3.3], C.darkBrick);
    b.box([0, 1.7, -0.15], [2.3, 1.4, 2.3], C.brick);
    for (const x of [-1.05, 1.05]) b.box([x, 1.7, 1.02], [0.22, 1.45, 0.14], C.darkBrick);
    b.arch([0, 1.02, 1.02], 0.6, 0.75).box([0, 2.48, -0.15], [2.65, 0.18, 2.65], C.darkBrick).box([0, 2.72, -0.15], [2, 0.3, 2], C.brick);
    b.cyl([0, 3.35, -0.15], 0.72, 0.9, 0.95, C.brick, 16).torus([0, 3.88, -0.15], 0.72, 0.1, C.darkBrick, [Math.PI / 2, 0, 0]).cyl([0, 4.2, -0.15], 0.35, 0.65, 0.55, C.darkBrick, 16).cyl([0, 4.65, -0.15], 0.1, 0.25, 0.4, C.brick, 10);
    b.stairs(0, 2.25, 1, 1, C.brick, 7);
    for (let i = 0; i < 14; i++) b.box([-3.2 + i * 0.5, 0.12, -3], [0.46, 0.24 + (i % 3) * 0.1, 0.3], C.darkBrick);
    b.palm([-3.2, 0, 1], 2.3).tree([3.2, 0, -1.4], 1.3).tree([3.3, 0, 1.9], 0.9);
  },
  'padang-lawas'(b) {
    // Biaro Sipamutung: a main brick temple with smaller remains around it, drawn differently from Bahal.
    b.box([0, 0.18, -0.6], [3.8, 0.36, 3.8], C.darkBrick).box([0, 0.55, -0.6], [3, 0.42, 3], C.brick).box([0, 1.5, -0.6], [2.1, 1.5, 2.1], C.darkBrick);
    b.arch([0, 0.8, 0.48], 0.55, 0.7).box([0, 2.36, -0.6], [2.4, 0.2, 2.4], C.brick);
    b.hip([0, 2.46, -0.6], 1.9, 1.9, 1.15, C.brick, [0.8, 0.8]).box([0, 3.72, -0.6], [0.6, 0.22, 0.6], C.darkBrick).box([0, 3.95, -0.6], [0.3, 0.25, 0.3], C.brick);
    for (const [x, z, h] of [[-2.6, 0.9, 0.9], [2.5, 0.8, 1.2], [-2.3, -2.2, 0.55], [2.4, -2.1, 0.7]] as const) {
      b.box([x, h / 2, z], [1.1, h, 1.1], C.brick).box([x, h + 0.08, z], [1.3, 0.16, 1.3], C.darkBrick);
    }
    b.stairs(0, 1.35, 0.76, 0.8, C.darkBrick, 5);
    for (let i = 0; i < 26; i++) b.box([Math.cos(i * 2.7) * (2.2 + (i % 4) * 0.45), 0.07, 1.6 + Math.sin(i * 1.7) * 1.1], [0.26, 0.12, 0.17], i % 2 ? C.brick : C.darkBrick, [0, i, 0]);
    b.tree([-3.6, 0, -0.6], 1.5).palm([3.5, 0, -0.4], 2);
  },
};

export type Anchor = V3;
