import { fact, type Fact } from './types';

export interface DioramaSpot {
  id: string;
  title: string;
  /** What part of the subject this explains. */
  topic: 'Struktur' | 'Ornamen' | 'Material' | 'Fungsi ruang' | 'Makna budaya' | 'Tradisi' | 'Lanskap';
  position: [number, number, number];
  info: Fact;
}

export interface DioramaQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Diorama {
  /** Same as the administrative area id. */
  id: string;
  title: string;
  summary: string;
  /** What is illustrative in the scene, shown to the visitor. */
  caveat: string;
  spots: DioramaSpot[];
  quiz: DioramaQuestion[];
}

export const DIORAMAS: Record<string, Diorama> = {
  samosir: {
    id: 'samosir', title: 'Tepi danau di Samosir',
    summary: 'Rumah panggung Batak Toba di dekat Danau Toba.',
    caveat: 'Tata letak, perahu, pepohonan, dan bukit adalah ilustrasi suasana, bukan rekaman kampung tertentu. Pola pada atap bukan motif gorga asli.',
    spots: [
      { id: 'atap', title: 'Atap pelana', topic: 'Struktur', position: [-2.1, 4.5, 1.4], info: fact('history', 'Rumah Batak Toba beratap lengkung menyerupai pelana, dengan ujung atap yang menjorok.', 'batakArchitecture', 'tobaHouseForm') },
      { id: 'tiang', title: 'Rumah panggung', topic: 'Struktur', position: [-0.9, 0.8, 0.4], info: fact('history', 'Lantai hunian ditinggikan di atas tiang-tiang kayu.', 'batakArchitecture') },
      { id: 'gorga', title: 'Bagian depan berhias', topic: 'Ornamen', position: [-2.25, 2.5, 1], info: fact('tradition', 'Bagian depan rumah menjadi tempat gorga, seni ukir dan lukis yang dikenal dengan warna merah, putih, dan hitam.') },
      { id: 'makna', title: 'Makna bentuk', topic: 'Makna budaya', position: [4.4, 3.5, -1.2], info: fact('interpretation', 'Para peneliti membaca bentuk rumah dan bagian dalamnya sebagai pembawa makna budaya.', 'tobaHouseForm') },
      { id: 'danau', title: 'Danau Toba', topic: 'Lanskap', position: [-1.6, 0.5, 7.3], info: fact('history', 'Danau Toba mengisi kaldera besar, cekungan yang terbentuk akibat amblesan saat letusan gunung api dahsyat.', 'nasaToba') },
    ],
    quiz: [
      { q: 'Seperti apa bentuk atap rumah Batak Toba?', options: ['Kubah bundar', 'Lengkung menyerupai pelana', 'Datar'], answer: 1, why: 'Bubungannya melandai di tengah dan naik ke ujung.' },
      { q: 'Cekungan Danau Toba terbentuk oleh…', options: ['Amblesan kaldera vulkanik', 'Galian manusia', 'Meteor'], answer: 0, why: 'Danau ini mengisi sebuah kaldera.' },
      { q: 'Warna yang lekat dengan gorga adalah…', options: ['Biru, kuning, ungu', 'Merah, putih, hitam', 'Hijau dan emas'], answer: 1, why: 'Gorga dikenal dengan tiga warna itu.' },
    ],
  },
  karo: {
    id: 'karo', title: 'Dataran tinggi Karo',
    summary: 'Rumah besar siwaluh jabu di lingkungan dataran tinggi.',
    caveat: 'Gunung, ladang, dan pagar adalah ilustrasi suasana dataran tinggi, bukan tempat tertentu. Susunan atap disederhanakan.',
    spots: [
      { id: 'rumah', title: 'Satu atap, delapan rumah tangga', topic: 'Fungsi ruang', position: [-1.2, 2.5, 1], info: fact('history', 'Nama siwaluh jabu merujuk pada delapan rumah tangga di bawah satu atap. Rumah panggung ini dapat mencapai tinggi sekitar 12 meter dengan dinding yang miring ke luar.', 'karoSpace') },
      { id: 'ruang', title: 'Batas yang tak terlihat', topic: 'Fungsi ruang', position: [0.9, 1.6, 0.4], info: fact('tradition', 'Secara tradisi antarruang tidak berdinding. Adatlah yang menandai batas dan menentukan siapa menempati tiap tempat, beserta tanggung jawabnya.', 'karoSpace') },
      { id: 'kini', title: 'Keadaan masa kini', topic: 'Makna budaya', position: [5.2, 3.4, -1.4], info: fact('contemporary', 'Kajian tahun 2020 di Desa Lingga menemukan sekat tambahan, rumah yang tidak lagi dihuni delapan keluarga, dan perawatan yang menurun.', 'karoSpace') },
      { id: 'atap', title: 'Atap tinggi berlapis', topic: 'Struktur', position: [-1.2, 4.4, -0.9], info: fact('interpretation', 'Atap yang tinggi mendominasi sosok rumah. Model ini menyederhanakan lapisan dan ujung atapnya.') },
      { id: 'teras', title: 'Teras depan (ture)', topic: 'Fungsi ruang', position: [-1.2, 1.05, 1.5], info: fact('contemporary', 'Menurut kajian di Lingga, ture sudah tidak lagi dipakai sebagai tempat melahirkan seperti dahulu.', 'karoSpace') },
    ],
    quiz: [
      { q: '“Siwaluh jabu” merujuk pada…', options: ['Delapan rumah tangga', 'Sembilan gendang', 'Lima wilayah adat'], answer: 0, why: 'Delapan rumah tangga berbagi satu rumah.' },
      { q: 'Secara tradisi, apa yang membatasi ruang di dalamnya?', options: ['Tembok batu', 'Aturan adat', 'Tidak ada aturan'], answer: 1, why: 'Batasnya tidak berupa dinding, melainkan adat.' },
      { q: 'Menurut kajian 2020 di Lingga, penempatan berdasarkan peran…', options: ['Masih dijalankan penuh', 'Sudah tidak dijalankan', 'Baru saja dimulai'], answer: 1, why: 'Kajian itu mencatat praktiknya sudah berubah.' },
    ],
  },
  'mandailing-natal': {
    id: 'mandailing-natal', title: 'Pusat huta Mandailing',
    summary: 'Bagas Godang, halaman luas, dan Sopo Godang sebagai satu kesatuan.',
    caveat: 'Susunan ini ilustrasi dari keterangan tertulis, bukan replika terukur. Penempatan Gordang Sambilan di balai dipakai sebagai contoh; sumber berbeda soal tempat penyimpanannya.',
    spots: [
      { id: 'bagas', title: 'Bagas Godang', topic: 'Fungsi ruang', position: [-2.6, 2.4, -1.9], info: fact('history', 'Bagas Godang adalah rumah panggung kediaman raja adat. Bangunan ini juga pernah menjadi tempat upacara adat dan tempat berlindung warga.', 'mandailingBuildings') },
      { id: 'bindu', title: 'Ornamen bindu', topic: 'Ornamen', position: [-0.4, 3.9, -1.2], info: fact('interpretation', 'Ornamen segitiga bindu di bagian depan atap dimaknai sebagai lambang Dalihan Na Tolu. Pola pada model ini disederhanakan.', 'mandailingBuildings') },
      { id: 'halaman', title: 'Halaman luas', topic: 'Struktur', position: [-1.6, 0.3, 1.6], info: fact('history', 'Sopo Godang terletak di depan Bagas Godang, dipisahkan oleh halaman yang luas.', 'mandailingBuildings') },
      { id: 'sopo', title: 'Sopo Godang', topic: 'Fungsi ruang', position: [5.4, 3.6, 2.6], info: fact('history', 'Sopo Godang adalah balai terbuka tanpa dinding untuk musyawarah, peradilan adat, pertunjukan, dan belajar.', 'mandailingBuildings') },
      { id: 'gordang', title: 'Gordang Sambilan', topic: 'Tradisi', position: [5.1, 1.45, 2.7], info: fact('tradition', 'Gordang Sambilan adalah ansambel sembilan gendang dengan ukuran bertingkat yang dimainkan pada upacara penting. Penggunaannya diatur adat.', 'gordang') },
    ],
    quiz: [
      { q: 'Apa ciri bangunan Sopo Godang?', options: ['Balai terbuka tanpa dinding', 'Rumah tertutup bertingkat', 'Menara batu'], answer: 0, why: 'Balai ini terbuka dan dipakai untuk musyawarah.' },
      { q: 'Ornamen bindu dimaknai sebagai lambang…', options: ['Dalihan Na Tolu', 'Silima Suak', 'Hombo batu'], answer: 0, why: 'Bentuk segitiganya dikaitkan dengan Dalihan Na Tolu.' },
      { q: 'Gordang Sambilan terdiri atas…', options: ['Tiga gong', 'Sembilan gendang', 'Dua belas seruling'], answer: 1, why: 'Sambilan berarti sembilan.' },
    ],
  },
  'nias-selatan': {
    id: 'nias-selatan', title: 'Permukiman batu Nias Selatan',
    summary: 'Jalan berlapis batu, rumah adat, dan susunan lompat batu.',
    caveat: 'Ini bukan denah Bawomataluo. Jumlah rumah, letak batu, dan posisi susunan lompat batu hanya ilustrasi; rumah-rumah samping memakai model yang disederhanakan.',
    spots: [
      { id: 'sebua', title: 'Omo sebua', topic: 'Struktur', position: [0, 5.2, -5.2], info: fact('history', 'Omo sebua, rumah besar para pemimpin, berdiri di atas tiang kayu yang sangat besar dengan atap yang tinggi dan curam.', 'omoSebua') },
      { id: 'gempa', title: 'Struktur dan gempa', topic: 'Material', position: [1, 0.9, -4.7], info: fact('history', 'Penelitian tentang gempa 2004 dan 2005 menemukan rumah tradisional Nias bertahan sangat baik, walaupun ada yang miring, roboh, atau rusak.', 'niasQuake') },
      { id: 'batu', title: 'Karya batu', topic: 'Makna budaya', position: [-2.35, 1.4, -2.2], info: fact('history', 'Bawomataluo dikenal dengan karya batu monumental yang menyatu dengan tata permukimannya.', 'unescoBawomataluo') },
      { id: 'hombo', title: 'Hombo batu', topic: 'Tradisi', position: [0.2, 3, 4.2], info: fact('history', 'Sejumlah keterangan mengaitkan lompat batu dengan persiapan menghadapi pertikaian antarkampung. Kini tradisi ini menjadi peragaan dan simbol budaya.', 'hombo') },
      { id: 'unesco', title: 'Status warisan', topic: 'Makna budaya', position: [4.4, 3.4, 0.1], info: fact('contemporary', 'Permukiman tradisional Bawomataluo tercantum dalam Daftar Sementara UNESCO sejak 2009. Statusnya belum ditetapkan sebagai Situs Warisan Dunia.', 'unescoBawomataluo') },
    ],
    quiz: [
      { q: 'Omo sebua adalah…', options: ['Rumah besar para pemimpin', 'Alat musik', 'Kain tenun'], answer: 0, why: 'Itu rumah monumental para pemimpin.' },
      { q: 'Kini hombo batu terutama menjadi…', options: ['Latihan perang aktif', 'Peragaan dan simbol budaya', 'Cara membangun rumah'], answer: 1, why: 'Tujuannya sudah berubah seiring waktu.' },
      { q: 'Status UNESCO Bawomataluo menurut sumber di sini…', options: ['Daftar Sementara', 'Situs Warisan Dunia', 'Tidak pernah diusulkan'], answer: 0, why: 'Masuk Daftar Sementara belum berarti ditetapkan.' },
    ],
  },
};

export const SPOT_COUNT = Object.values(DIORAMAS).reduce((n, d) => n + d.spots.length, 0);
