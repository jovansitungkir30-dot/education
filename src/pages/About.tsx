import { SectionHead, Credit, KindTag } from '../components/ui';
import { SOURCES, CHECK_LABEL, checkOf, type SourceId } from '../data/sources';
import { ALL_PHOTOS } from '../data/photos';
import LANDMARK_PHOTOS from '../data/landmark-photos.json';
import { KNOWLEDGE, type Knowledge } from '../data/types';

const LIMITS = [
  'Tiap rujukan di bawah menunjukkan sejauh mana ia sudah dicek. Beberapa gagal dibuka atau hanya dilihat sebagai ringkasan pencarian, jadi periksa itu lebih dulu. Sebagian berupa halaman ensiklopedia atau pers.',
  'Beberapa pernyataan belum punya sumber. Pada panel fakta, pernyataan itu ditandai “Menunggu tinjauan ahli” dan masih perlu dikonfirmasi.',
  'Belum ada wakil komunitas atau ahli yang meninjau konten ini.',
  'Angkola dan beberapa topik lain masih dibahas tipis, dan Pakpak belum punya foto. Kekosongan ditampilkan apa adanya, tidak diisi tebakan.',
  'Model 3D dan diorama adalah representasi prosedural yang disederhanakan, bukan replika terukur atau akurat secara sejarah. Tata letak diorama, vegetasi, gunung, dan pohon pada peta beranda hanya ilustrasi.',
  'Diorama baru tersedia untuk Samosir, Karo, Mandailing Natal, dan Nias Selatan.',
  'Contoh audio disintesis di browser, bukan rekaman atau komposisi tradisional. Narasi memakai suara komputer perangkat Anda; pelafalan nama lokal bisa keliru, dan mutunya bergantung pada ketersediaan suara bahasa Indonesia.',
  'Peta menampilkan batas administrasi dari data 2020 yang disederhanakan, jadi tidak untuk keperluan hukum atau navigasi. Batas administrasi bukan batas budaya.',
  'Tampilan bentang alam adalah olahan: citra diambil 2016–2017, warnanya diperkuat, awan diredam secara otomatis, laut dan danau digambar ulang, dan relief diperbesar sekitar 11 kali. Jalur putus-putus adalah rute jelajah, bukan jalan.',
  'Ejaan dan istilah setempat bisa beragam. Sebagian judul rujukan ditulis dalam bahasa Inggris.',
];

export default function About() {
  return (
    <div className="pt-30 pb-24">
      <div className="wrap">
        <SectionHead as="h1" eyebrow="Tentang" title="Ruang digital untuk belajar budaya dengan cermat">
          RuangNusantara memperkenalkan warisan Sumatera Utara kepada pelajar, mahasiswa, wisatawan, dan siapa saja yang ingin tahu. Tujuannya tampil hidup tanpa meratakan perbedaan antarkomunitas.
        </SectionHead>

        <section className="mt-12">
          <h2 className="text-3xl">Cara menjelajah</h2>
          <ol className="grid gap-5 p-0 md:grid-cols-4">
            {[
              ['Buka peta', 'Lihat 25 kabupaten dan 8 kota dengan batas aslinya. Geser, perbesar, atau pilih dari daftar.'],
              ['Pilih wilayah', 'Baca materi budaya yang sudah diriset. Wilayah yang belum, ditandai apa adanya.'],
              ['Buka halaman wilayah', 'Setiap kabupaten dan kota punya landmark 3D dengan titik budaya. Samosir, Karo, Mandailing Natal, dan Nias Selatan punya diorama yang lebih rinci.'],
              ['Uji dan lanjutkan', 'Kerjakan mini kuis, lihat catatan temuan, lalu jelajahi wilayah lain. Tidak ada materi yang dikunci di peta.'],
            ].map(([title, text], i) => (
              <li key={title} className="list-none border-t-2 border-gold-500 pt-4">
                <span className="font-display text-3xl text-gold-300">{i + 1}</span>
                <h3 className="mt-1 mb-1 text-xl">{title}</h3>
                <p className="m-0 text-sm opacity-80">{text}</p>
              </li>
            ))}
          </ol>
          <a className="btn btn-gold mt-6" href="#/explore">Mulai Jelajahi</a>
        </section>

        <section className="paper mt-12 rounded-3xl p-6 sm:p-10">
          <h2 className="mt-0 text-3xl">Cara membaca label</h2>
          <dl className="grid gap-5 md:grid-cols-2">
            {(Object.keys(KNOWLEDGE) as Knowledge[]).map((k) => (
              <div key={k}><dt><KindTag kind={k} /></dt><dd className="mt-1.5 ml-0">{KNOWLEDGE[k].hint}</dd></div>
            ))}
          </dl>
          <h2 className="mt-10 text-3xl">Keterbatasan</h2>
          <ul className="list-disc space-y-1.5 pl-5">{LIMITS.map((l) => <li key={l}>{l}</li>)}</ul>
          <p>Jika Anda bagian dari salah satu komunitas ini dan menemukan yang keliru atau kurang, pengetahuan Anda patut diutamakan dalam perbaikan.</p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Rujukan</h2>
          <ul className="grid gap-4 p-0 md:grid-cols-2">
            {(Object.keys(SOURCES) as SourceId[]).map((id) => ({ id, ...SOURCES[id] })).map((s) => (
              <li key={s.url} className="list-none rounded-2xl border border-ivory/15 p-4">
                <a className="font-bold underline underline-offset-2" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                <span className="mt-1 block text-sm opacity-70">{s.publisher} · {s.type} · {CHECK_LABEL[checkOf(s.id)]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Kredit foto</h2>
          <p className="text-sm opacity-75">Ukurannya diubah oleh Wikimedia Commons; sebagian terpotong oleh tata letak halaman. Tiap foto tetap berada di bawah lisensi yang tertera.</p>
          <ul className="grid gap-3 p-0 md:grid-cols-2">
            {ALL_PHOTOS.map((p) => (
              <li key={p.id} className="list-none text-sm"><strong>{p.alt}.</strong> <Credit id={p.id} /></li>
            ))}
            {Object.values(LANDMARK_PHOTOS).map((p) => (
              <li key={p.file} className="list-none text-sm">
                <strong>{p.alt}.</strong>{' '}
                <span className="text-[11px] opacity-80">
                  Foto: <a className="underline" href={p.page} target="_blank" rel="noreferrer">{p.author}</a>,{' '}
                  {p.licenseUrl ? <a className="underline" href={p.licenseUrl} target="_blank" rel="noreferrer">{p.license}</a> : p.license}, via Wikimedia Commons
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm opacity-75">Batas wilayah: geoBoundaries (sumber BPS, WFP, OCHA ROAP; data 2020), CC BY 3.0 IGO, disederhanakan. Citra peta: Sentinel-2 cloudless 2016, https://s2maps.eu oleh EOX IT Services GmbH (memuat data Copernicus Sentinel 2016 &amp; 2017 yang dimodifikasi), CC BY 4.0; warna diubah, awan diredam, dan laut digambar ulang. Ketinggian: AWS Terrain Tiles (Mapzen; SRTM, USGS). Huruf: Fraunces dan Manrope (SIL Open Font License).</p>
        </section>
      </div>
    </div>
  );
}
