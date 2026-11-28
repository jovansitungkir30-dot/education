/** Every area as a readable index: the way in that needs neither the map nor 3D. */
import { useEffect, useState } from 'react';
import ExplorationProgress from '../components/region/ExplorationProgress';
import { ADMIN } from '../data/atlas';
import { LANDMARKS } from '../data/landmarks';
import { THEMES, ZONES, themeById } from '../data/pathways';
import { SCENES } from '../data/scenes';
import { useProgress } from '../lib/progress';
import { go, href } from '../lib/router';
import { searchAreas } from '../lib/search';

export default function Directory({ params, unknown = false }: { params: URLSearchParams; unknown?: boolean }) {
  const theme = themeById(params.get('tema'));
  const [query, setQuery] = useState('');
  const { state } = useProgress();

  useEffect(() => {
    document.title = 'Daftar Wilayah · RuangNusantara';
  }, []);

  const matches = searchAreas(query).filter((d) => !theme || theme.areas.includes(d.id));
  const shown = new Set(matches.map((d) => d.id));
  const quizzes = Object.entries(state.scores).filter(([k]) => k.startsWith('diorama:'));
  const average = quizzes.length ? Math.round(quizzes.reduce((n, [, v]) => n + v, 0) / quizzes.length) : null;

  return (
    <div className="paper min-h-dvh pb-20 text-ink">
      <header className="bg-forest-900 pt-28 text-ivory">
        <div className="wrap grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-end">
          <div>
            <p className="eyebrow m-0 text-gold-300">Indeks koleksi</p>
            <h1 className="display mt-2 mb-3">25 kabupaten dan 8 kota</h1>
            <p className="m-0 max-w-[60ch] text-lg opacity-85">Semua halaman wilayah bisa dibuka dari sini, tanpa peta dan tanpa tampilan 3D.</p>
            {unknown && <p className="mt-4 mb-0 inline-block border-l-4 border-gold-500 pl-3 font-bold" role="alert">Wilayah yang Anda tuju tidak ditemukan. Pilih dari daftar di bawah.</p>}
            <a className="btn btn-gold mt-5" href={href('/explore')}>Buka peta</a>
          </div>
          <div className="border-t border-ivory/25 pt-4">
            <ExplorationProgress />
            <dl className="m-0 mt-3 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs opacity-75">Kuis wilayah selesai</dt><dd className="m-0 font-display text-3xl">{quizzes.length}</dd></div>
              <div><dt className="text-xs opacity-75">Rata-rata nilai terbaik</dt><dd className="m-0 font-display text-3xl">{average === null ? '–' : `${average}%`}</dd></div>
            </dl>
            <a className="mt-2 inline-block text-sm underline" href={href('/learn', { view: 'progress' })}>Lihat lencana dan sertifikat</a>
          </div>
        </div>
        <div className="weave" aria-hidden="true" />
      </header>

      <div className="wrap pt-8">
        <search className="block">
          <label className="block font-extrabold" htmlFor="cari-wilayah">Cari wilayah, landmark, atau istilah</label>
          <input id="cari-wilayah" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: Karo, masjid, candi, mejan" className="mt-2 min-h-12 w-full max-w-xl rounded-md border-2 border-ink/30 bg-white px-4 text-base" />
        </search>

        <h2 className="mt-8 mb-2 text-2xl">Jalur jelajah</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Jalur tematik">
          <button type="button" className="chip" aria-pressed={!theme} onClick={() => go('/wilayah')}>Semua wilayah</button>
          {THEMES.map((t) => (
            <button key={t.id} type="button" className="chip" aria-pressed={theme?.id === t.id} onClick={() => go('/wilayah', { tema: t.id })}>{t.name} ({t.areas.length})</button>
          ))}
        </div>
        <p className="mt-3 mb-0 max-w-[68ch] text-sm">{theme ? `${theme.about} ` : ''}Jalur menunjukkan wilayah yang sudah punya materi di atlas ini. Itu tidak berarti budayanya hanya ada di sana, atau tidak ada di wilayah lain.</p>

        <p className="mt-6 mb-0 font-bold" role="status">{matches.length} dari {ADMIN.length} wilayah ditampilkan</p>
        {!matches.length && <button type="button" className="btn btn-terra mt-3" onClick={() => { setQuery(''); go('/wilayah'); }}>Hapus pencarian dan jalur</button>}

        {ZONES.map((zone) => {
          const areas = zone.areas.filter((id) => shown.has(id));
          if (!areas.length) return null;
          return (
            <section key={zone.id} className="mt-10" aria-labelledby={`zona-${zone.id}`}>
              <h2 id={`zona-${zone.id}`} className="m-0 border-b-2 border-ink/80 pb-2 text-3xl">{zone.name}</h2>
              <ul className="m-0 grid gap-x-10 p-0 lg:grid-cols-2">
                {areas.map((id) => {
                  const d = ADMIN.find((x) => x.id === id)!;
                  const scene = SCENES[id];
                  const found = scene.spots.filter((s) => state.visited.warisan.includes(`${id}:${s.id}`)).length;
                  const score = state.scores[`diorama:${id}`];
                  const visited = state.visited.region.includes(id);
                  return (
                    <li key={id} className="list-none border-b border-ink/15">
                      <a className="group grid min-h-24 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 py-3" href={href('/wilayah', { id })}>
                        <span className="pt-1 font-display text-2xl text-terracotta-700 tabular-nums" aria-hidden="true">{String(ADMIN.indexOf(d) + 1).padStart(2, '0')}</span>
                        <span>
                          <span className="block font-display text-2xl leading-tight group-hover:text-terracotta-700">{d.name}<span className="ml-2 font-sans text-xs font-bold tracking-wider uppercase opacity-75">{d.type}</span></span>
                          <span className="block font-bold">{LANDMARKS[id].name}</span>
                          <span className="block text-sm opacity-80">{LANDMARKS[id].preview}</span>
                          <span className="mt-1 block text-xs font-bold">
                            {visited ? '✓ Sudah dikunjungi' : 'Belum dikunjungi'} · {found}/{scene.spots.length} titik budaya
                            {score !== undefined && ` · kuis ${score}%`}
                            {LANDMARKS[id].evidence === 'terbatas' && ' · dasar pemilihan lemah'}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
