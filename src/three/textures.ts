import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d')!);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

const cache = new Map<string, CanvasTexture>();
const memo = (key: string, make: () => CanvasTexture) => {
  let t = cache.get(key);
  if (!t) cache.set(key, (t = make()));
  return t;
};

/** Abstract geometric ornament in red, black and white. Original artwork, not a real gorga motif. */
export const ornamentTexture = () =>
  memo('ornament', () =>
    canvasTexture(512, 256, (c) => {
      c.fillStyle = '#7e2a1c';
      c.fillRect(0, 0, 512, 256);
      c.lineWidth = 5;
      for (let y = 0; y < 256; y += 64) {
        c.fillStyle = '#17110d';
        c.fillRect(0, y, 512, 8);
        for (let x = 0; x < 512; x += 64) {
          c.strokeStyle = '#efe6d2';
          c.beginPath();
          c.moveTo(x + 32, y + 12);
          c.lineTo(x + 58, y + 36);
          c.lineTo(x + 32, y + 60);
          c.lineTo(x + 6, y + 36);
          c.closePath();
          c.stroke();
          c.strokeStyle = '#17110d';
          c.strokeRect(x + 23, y + 27, 18, 18);
        }
      }
    }),
  );

/** Original woven-stripe study. */
export const textileTexture = () =>
  memo('textile', () =>
    canvasTexture(512, 768, (c) => {
      c.fillStyle = '#4c1712';
      c.fillRect(0, 0, 512, 768);
      const bands: [number, number, string][] = [
        [20, 26, '#14100e'], [52, 5, '#e8dcc0'], [64, 40, '#8f2f1f'], [112, 4, '#c9a24b'], [150, 18, '#14100e'],
        [196, 4, '#e8dcc0'], [214, 84, '#681f17'],
      ];
      for (const [x, w, color] of bands) {
        c.fillStyle = color;
        c.fillRect(x, 0, w, 768);
        c.fillRect(512 - x - w, 0, w, 768);
      }
      c.fillStyle = '#e8dcc0';
      for (let y = 24; y < 768; y += 48) {
        for (let i = 0; i < 4; i++) {
          c.fillRect(238 + i * 3, y + i * 5, 36 - i * 6, 3);
          c.fillRect(238 + i * 3, y - i * 5, 36 - i * 6, 3);
        }
      }
      // Thread grain.
      c.globalAlpha = 0.16;
      for (let y = 0; y < 768; y += 4) {
        c.fillStyle = y % 8 ? '#000' : '#fff';
        c.fillRect(0, y, 512, 1);
      }
      c.globalAlpha = 1;
    }),
  );

/** Layered fibre look for dark thatched roofing. */
export const thatchTexture = () =>
  memo('thatch', () => {
    const t = canvasTexture(256, 256, (c) => {
      c.fillStyle = '#3a2d22';
      c.fillRect(0, 0, 256, 256);
      // Deterministic pseudo-random strokes.
      let seed = 7;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < 2600; i++) {
        c.strokeStyle = rnd() > 0.5 ? '#5a4734' : '#241b14';
        const x = rnd() * 256;
        const y = rnd() * 256;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + rnd() * 3 - 1.5, y + 8 + rnd() * 10);
        c.stroke();
      }
      c.fillStyle = 'rgba(0,0,0,0.35)';
      for (let y = 0; y < 256; y += 32) c.fillRect(0, y, 256, 4);
    });
    t.repeat.set(3, 2);
    return t;
  });
