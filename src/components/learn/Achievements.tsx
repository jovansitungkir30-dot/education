import { useState } from 'react';
import { ADMIN, visitedDistricts } from '../../data/atlas';
import { ARTIFACTS } from '../../data/artifacts';
import { MODULES } from '../../data/modules';
import { STORIES } from '../../data/stories';
import { badges } from '../../lib/badges';
import { passedModules, useProgress } from '../../lib/progress';

export default function Achievements() {
  const { state, points, setName, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const passed = passedModules(state);
  const complete = passed.length === MODULES.length;
  const meters = [
    ['Modul lulus', passed.length, MODULES.length],
    ['Wilayah dijelajahi', visitedDistricts(state).length, ADMIN.length],
    ['Artefak dijelajahi', state.visited.artifact.length, ARTIFACTS.length],
    ['Cerita selesai', state.visited.story.length, STORIES.length],
  ] as const;
  const list = badges(state);
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-forest-900 p-6 sm:p-10">
        <p className="eyebrow text-gold-300">Perjalanan Anda</p>
        <h2 className="mt-2 mb-6 text-4xl">{points} poin jelajah</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {meters.map(([label, n, total]) => (
            <label key={label} className="text-sm font-semibold">
              <span className="flex justify-between"><span>{label}</span><span>{n}/{total}</span></span>
              <progress className="mt-1.5 h-2 w-full accent-gold-500" value={n} max={total} />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl">Lencana</h2>
        <ul className="grid gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <li key={b.name} className={`flex list-none gap-4 rounded-2xl border p-4 ${b.earned ? 'border-gold-500 bg-forest-800' : 'border-ivory/15 opacity-65'}`}>
              <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden="true">
                <path d="M24 2L43 13V35L24 46L5 35V13Z" fill={b.earned ? '#c9a24b' : 'none'} stroke="#c9a24b" strokeWidth="2" />
                <path d="M24 12L36 24L24 36L12 24Z" fill="none" stroke={b.earned ? '#0f231b' : '#c9a24b'} strokeWidth="2.5" />
              </svg>
              <div>
                <p className="m-0 font-display text-xl">{b.name}</p>
                <p className="m-0 text-sm opacity-80">{b.earned ? 'Diraih. ' : 'Terkunci. '}{b.how}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-3xl">Sertifikat penyelesaian</h2>
        {complete ? (
          <>
            <label className="mb-4 flex max-w-md flex-col gap-1 text-sm font-semibold">
              Nama yang ditampilkan di sertifikat
              <input className="min-h-11 rounded-lg border border-ivory/30 bg-forest-900 px-3 text-base" value={state.name} maxLength={60} onChange={(e) => setName(e.target.value)} />
            </label>
            <div id="certificate" className="paper border-[10px] border-double border-gold-700 p-8 text-center sm:p-14">
              <p className="eyebrow">RuangNusantara</p>
              <h3 className="mt-3 text-3xl sm:text-4xl">Sertifikat Penyelesaian</h3>
              <p>Dengan ini dicatat bahwa</p>
              <p className="font-display text-3xl break-words text-terracotta-700">{state.name.trim() || 'Nama Anda'}</p>
              <p>telah lulus seluruh {MODULES.length} modul belajar tentang warisan budaya Sumatera Utara.</p>
              <div className="weave mx-auto my-4 w-60" />
              <p className="mb-0 text-xs">Catatan belajar mandiri · {points} poin · Bukan kualifikasi terakreditasi.</p>
            </div>
            <button type="button" className="btn btn-gold mt-4" onClick={() => window.print()}>Cetak atau simpan sebagai PDF</button>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-ivory/30 p-6">Lulus semua {MODULES.length} modul untuk membuka sertifikat. Tinggal {MODULES.length - passed.length} lagi.</p>
        )}
      </section>

      <section className="border-t border-ivory/15 pt-5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <span>Hapus semua poin, lencana, dan nilai kuis di browser ini?</span>
            <button type="button" className="btn btn-terra" onClick={() => { reset(); setConfirming(false); }}>Ya, hapus</button>
            <button type="button" className="btn btn-line" onClick={() => setConfirming(false)}>Simpan kemajuan saya</button>
          </div>
        ) : (
          <button type="button" className="btn btn-line" onClick={() => setConfirming(true)}>Atur ulang kemajuan</button>
        )}
      </section>
    </div>
  );
}
