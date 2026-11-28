import { visitedDistricts } from '../data/atlas';
import { DIORAMAS } from '../data/dioramas';
import { MODULES } from '../data/modules';
import { passedModules, type ProgressState } from './progress';

export const EXPLORER = { regions: 5, artifacts: 3, stories: 2 };

/** Area ids whose diorama has every discovery point opened. */
export const completedDioramas = (s: ProgressState) =>
  new Set(Object.values(DIORAMAS).filter((d) => d.spots.every((spot) => s.visited.warisan.includes(`${d.id}:${spot.id}`))).map((d) => d.id));

export function badges(s: ProgressState) {
  const done = completedDioramas(s);
  const passed = passedModules(s);
  return [
    {
      name: 'Penjelajah Budaya',
      how: `Kunjungi ${EXPLORER.regions} wilayah, jelajahi ${EXPLORER.artifacts} artefak, dan selesaikan ${EXPLORER.stories} cerita.`,
      earned: visitedDistricts(s).length >= EXPLORER.regions && s.visited.artifact.length >= EXPLORER.artifacts && s.visited.story.length >= EXPLORER.stories,
    },
    ...Object.values(DIORAMAS).map((d) => ({ name: `Jejak: ${d.title}`, how: 'Buka semua titik temuan di diorama ini.', earned: done.has(d.id) })),
    ...[5, 15, 33].map((n) => ({
      name: n === 33 ? 'Keliling Sumatera Utara' : `Penjelajah ${n} Wilayah`,
      how: `Buka halaman ${n} kabupaten atau kota.`,
      earned: visitedDistricts(s).length >= n,
    })),
    ...MODULES.map((m) => ({ name: m.badge, how: `Lulus kuis modul “${m.title}”.`, earned: passed.includes(m.id) })),
  ];
}
