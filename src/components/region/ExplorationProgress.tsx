import { ADMIN, visitedDistricts } from '../../data/atlas';
import { TOTAL_SPOTS } from '../../data/scenes';
import { useProgress } from '../../lib/progress';

export default function ExplorationProgress({ compact = false }: { compact?: boolean }) {
  const { state } = useProgress();
  const areas = visitedDistricts(state).length;
  const found = state.visited.warisan.length;
  return (
    <div className={compact ? 'text-sm' : ''}>
      <p className="m-0 font-extrabold">{areas} dari {ADMIN.length} wilayah telah dijelajahi</p>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-current/15" role="progressbar" aria-label="Wilayah dijelajahi" aria-valuemin={0} aria-valuemax={ADMIN.length} aria-valuenow={areas}>
        <div className="h-full rounded-full bg-gold-500" style={{ width: `${(areas / ADMIN.length) * 100}%` }} />
      </div>
      <p className="mt-1.5 mb-0 text-xs opacity-80">{found} dari {TOTAL_SPOTS} objek budaya telah ditemukan</p>
      {areas === ADMIN.length && <p className="mt-2 mb-0 font-display text-lg">Penjelajah Budaya Sumatera Utara</p>}
    </div>
  );
}
