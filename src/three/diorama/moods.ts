/** Light moods for the dioramas. */
export type Mood = 'pagi' | 'siang' | 'senja';

export const MOODS: Record<Mood, { label: string; top: string; horizon: string; sun: string; sunAt: [number, number, number]; sunPower: number; sky: string; ground: string; fill: number }> = {
  pagi: { label: 'Pagi', top: '#7fb2d6', horizon: '#f4dcc0', sun: '#ffd9a8', sunAt: [18, 10, 8], sunPower: 2.5, sky: '#fdeedb', ground: '#4d5f45', fill: 1.15 },
  siang: { label: 'Siang', top: '#5d9fd4', horizon: '#cfe4e0', sun: '#fff3dc', sunAt: [10, 20, 9], sunPower: 2.8, sky: '#eef6ff', ground: '#55684a', fill: 1.35 },
  senja: { label: 'Senja', top: '#35406e', horizon: '#ef9d6a', sun: '#ff9a55', sunAt: [-18, 6, 7], sunPower: 2.7, sky: '#e7b9a0', ground: '#2f3c37', fill: 0.85 },
};

