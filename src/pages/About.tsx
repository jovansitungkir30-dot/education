import { useState } from 'react';
import { ESSENTIALS } from '../components/credits/AboutExperience';
import SourcesPanel from '../components/credits/SourcesPanel';
import { KindTag, SectionHead } from '../components/ui';
import { AREA_PHOTOS, HERITAGE_PHOTOS, RECORDINGS, type Language, type MediaItem } from '../data/media';
import { ALL_PHOTOS } from '../data/photos';
import { SOURCES, type SourceId } from '../data/sources';
import { KNOWLEDGE, type Knowledge } from '../data/types';
import { href } from '../lib/router';

const MORE = [
  'Banyak materi bersandar pada ensiklopedia, pers, atau ringkasan pencarian. Statusnya tertera pada tiap sumber.',
  'Sebagian wilayah belum punya materi untuk semua topik. Topik yang kosong tidak diisi tebakan.',
  'Tidak semua foto memperlihatkan landmarknya. Setiap foto diberi label sesuai isinya.',
  'Empat pilihan landmark masih lemah dasarnya: Labuhanbatu, Labuhanbatu Utara, Nias Utara, dan Serdang Bedagai.',
  'Belum ada rekaman musik tradisional berlisensi terbuka. Bunyi alat musik disintesis; rekaman asli yang ada hanya pelafalan kata.',
  'Batas wilayah berasal dari data 2020 yang disederhanakan, tidak untuk keperluan hukum atau navigasi. Relief peta diperbesar sekitar 11 kali dan jalur putus-putus bukan jalan.',
];

const PHOTOS: MediaItem[] = [
  ...ALL_PHOTOS.map((p) => ({ ...p, relation: 'objek' as const, verification: 'keterangan' as const })),
  ...Object.values(AREA_PHOTOS).flat(),
  ...Object.values(HERITAGE_PHOTOS),
];
const AUDIO = (Object.keys(RECORDINGS) as Language[]).flatMap((language) => RECORDINGS[language].map((r) => ({ ...r, language })));
const REFERENCES = (Object.keys(SOURCES) as SourceId[]).sort((a, b) => SOURCES[a].title.localeCompare(SOURCES[b].title, 'id'));

export default function About() {
  const [panel, setPanel] = useState(false);
  return (
    <div className="pt-30 pb-24">
      <div className="wrap !max-w-4xl">
        <SectionHead as="h1" eyebrow="Tentang" title="Atlas belajar budaya Sumatera Utara">
          Jelajahi 33 kabupaten dan kota lewat peta, model 3D, sejarah, tradisi, kuliner, dan bunyi. Tujuannya membuat penasaran tanpa meratakan perbedaan antarkomunitas.
        </SectionHead>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btn-gold" href={href('/explore')}>Mulai dari peta</a>
          <button type="button" className="btn btn-line" onClick={() => setPanel(true)}>Sumber &amp; Kredit</button>
        </div>

        <section className="paper mt-10 rounded-xl p-6 sm:p-9">
          <h2 className="mt-0 text-3xl">Yang perlu Anda tahu</h2>
          <dl className="m-0 grid gap-x-10 sm:grid-cols-2">
            {ESSENTIALS.map(([title, text]) => (
              <div key={title} className="border-t border-ink/15 py-3"><dt className="font-extrabold">{title}</dt><dd className="m-0">{text}</dd></div>
            ))}
          </dl>
          <details className="mt-3 border-t border-ink/15">
            <summary className="min-h-11 cursor-pointer py-3 font-extrabold">Keterbatasan selengkapnya</summary>
            <ul className="mt-0 list-disc space-y-1.5 pl-5">{MORE.map((l) => <li key={l}>{l}</li>)}</ul>
          </details>
          <details className="border-t border-ink/15">
            <summary className="min-h-11 cursor-pointer py-3 font-extrabold">Arti label pada teks</summary>
            <dl className="m-0 grid gap-4 pb-3 sm:grid-cols-2">
              {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => <div key={k}><dt><KindTag kind={k} /></dt><dd className="mt-1 ml-0 text-sm">{KNOWLEDGE[k].hint}</dd></div>)}
            </dl>
          </details>
          <details className="border-t border-ink/15">
            <summary className="min-h-11 cursor-pointer py-3 font-extrabold">Data peta dan huruf</summary>
            <p className="mt-0 text-sm">Batas wilayah: geoBoundaries (sumber BPS, WFP, OCHA ROAP; data 2020), CC BY 3.0 IGO, disederhanakan. Citra peta: Sentinel-2 cloudless 2016, https://s2maps.eu oleh EOX IT Services GmbH (memuat data Copernicus Sentinel 2016 &amp; 2017 yang dimodifikasi), CC BY 4.0; warna diubah, awan diredam, dan laut digambar ulang. Ketinggian: AWS Terrain Tiles (Mapzen; SRTM, USGS). Huruf: Fraunces dan Manrope (SIL Open Font License).</p>
          </details>
          <p className="mb-0">Anda bagian dari salah satu komunitas ini dan menemukan yang keliru? Pengetahuan Anda patut diutamakan dalam perbaikan.</p>
        </section>
      </div>
      <SourcesPanel open={panel} onClose={() => setPanel(false)} references={REFERENCES} photos={PHOTOS} audio={AUDIO} />
    </div>
  );
}
