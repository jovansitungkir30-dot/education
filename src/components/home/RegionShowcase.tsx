/** All 33 areas on one spread: a large spotlight and a complete index that drives it. */
import { useMemo, useState } from 'react';
import { AREAS } from '../../data/area-content';
import { ADMIN, DISTRICTS, districtById, fullName } from '../../data/atlas';
import { LANDMARKS } from '../../data/landmarks';
import { AREA_PHOTOS, RELATIONS } from '../../data/media';
import { ZONES, zoneOf } from '../../data/pathways';
import { HALF_HEIGHT, HALF_WIDTH, svgPath } from '../../lib/geo';
import { useProgress } from '../../lib/progress';
import { href } from '../../lib/router';

const today = () => Math.floor(Date.now() / 86_400_000);

/** Where the area is, drawn from the real boundaries. Used beside, or instead of, a photograph. */
function Locator({ id, className }: { id: string; className: string }) {
  const paths = useMemo(() => DISTRICTS.map((d) => ({ d, path: svgPath(d) })), []);
  return (
    <svg viewBox={`${-HALF_WIDTH - 0.3} ${-HALF_HEIGHT - 0.3} ${HALF_WIDTH * 2 + 0.6} ${HALF_HEIGHT * 2 + 0.6}`} className={className} aria-hidden="true">
      {paths.map(({ d, path }) => <path key={d.id} d={path} fill={d.id === id ? '#ffd45e' : d.type === 'air' ? '#3a93a8' : '#3f6650'} stroke="#e9dcb8" strokeOpacity={d.id === id ? 1 : 0.35} strokeWidth={d.id === id ? 1.6 : 0.6} vectorEffect="non-scaling-stroke" />)}
    </svg>
  );
}

export default function RegionShowcase() {
  // A different starting area each day, so no handful of places is always in front.
  const [id, setId] = useState(() => ADMIN[(today() * 7) % ADMIN.length].id);
  const [zone, setZone] = useState<string | null>(null);
  const { state } = useProgress();
  const district = districtById(id)!;
  const photo = AREA_PHOTOS[id]?.find((p) => p.relation === 'objek') ?? AREA_PHOTOS[id]?.[0];
  const list = zone ? ZONES.find((z) => z.id === zone)!.areas.map((a) => districtById(a)!) : ADMIN;

  const pickZone = (z: string | null) => {
    setZone(z);
    if (z) setId(ZONES.find((x) => x.id === z)!.areas[today() % ZONES.find((x) => x.id === z)!.areas.length]);
  };
  const random = () => {
    const pool = list.filter((d) => d.id !== id);
    const unseen = pool.filter((d) => !state.visited.region.includes(d.id));
    const from = unseen.length ? unseen : pool;
    setId(from[Math.floor(Math.random() * from.length)].id);
  };

  return (
    <section className="bg-forest-950 py-20" aria-labelledby="tiga-tiga">
      <div className="wrap">
        <p className="eyebrow m-0 text-gold-300">25 kabupaten · 8 kota</p>
        <h2 id="tiga-tiga" className="display mt-2 mb-4">Setiap wilayah punya halamannya sendiri</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Saring menurut zona">
          <button type="button" className="chip" aria-pressed={!zone} onClick={() => pickZone(null)}>Semua ({ADMIN.length})</button>
          {ZONES.map((z) => <button key={z.id} type="button" className="chip" aria-pressed={zone === z.id} onClick={() => pickZone(z.id)}>{z.name} ({z.areas.length})</button>)}
        </div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <article className="relative min-h-[30rem] overflow-hidden rounded-xl bg-forest-900" aria-live="polite">
            {photo ? (
              <img key={photo.file} src={`./${photo.file}`} alt={photo.alt} className="absolute inset-0 size-full animate-[fade-in_0.5s_both] object-cover" />
            ) : (
              <Locator id={id} className="absolute inset-0 size-full p-8 pb-48" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 via-40% to-transparent to-75%" />
            {photo && <Locator id={id} className="absolute top-3 right-3 h-32 w-28 rounded-md bg-forest-950/75 p-1.5" />}
            <div className="relative flex min-h-[30rem] flex-col justify-end p-5 sm:p-8">
              <p className="eyebrow m-0 text-gold-300">{zoneOf(id).name}</p>
              <h3 className="mt-1 mb-1 text-4xl sm:text-5xl">{fullName(district)}</h3>
              <p className="m-0 font-display text-xl text-gold-300">{LANDMARKS[id].name}</p>
              <p className="mt-2 mb-4 max-w-[60ch] leading-relaxed">{AREAS[id].lead}</p>
              <div className="flex flex-wrap gap-2">
                <a className="btn btn-gold" href={href('/wilayah', { id })}>Jelajahi {district.name} →</a>
                <button type="button" className="btn btn-line" onClick={random}>Kejutkan saya</button>
              </div>
              {photo && <p className="mt-3 mb-0 text-[11px] opacity-75">{RELATIONS[photo.relation].label}: {photo.alt} Foto: <a className="underline" href={photo.page} target="_blank" rel="noreferrer">{photo.author}</a>, {photo.license}.</p>}
            </div>
          </article>

          <div className="min-w-0">
            <ul className="m-0 grid max-h-[30rem] grid-cols-2 content-start gap-x-3 overflow-y-auto p-0 pr-1" aria-label="Indeks wilayah">
              {list.map((d) => (
                <li key={d.id} className="list-none border-t border-ivory/15">
                  <button type="button" aria-pressed={d.id === id} onClick={() => setId(d.id)} onPointerEnter={(e) => { if (e.pointerType === 'mouse') setId(d.id); }} className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-1 py-1.5 text-left text-sm font-bold ${d.id === id ? 'text-gold-300' : 'opacity-85 hover:opacity-100'}`}>
                    <span>{d.type === 'kota' ? 'Kota ' : ''}{d.name}</span>
                    {state.visited.region.includes(d.id) && <span aria-label="sudah dikunjungi">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="btn btn-line" href={href('/wilayah')}>Cari di daftar lengkap</a>
              <a className="btn btn-line" href={href('/explore')}>Lihat di peta</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
