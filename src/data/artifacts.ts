import { fact, type Fact } from './types';

export type ModelId = 'rumah-bolon' | 'siwaluh-jabu' | 'omo-sebua' | 'hombo-batu' | 'ulos' | 'gondang' | 'gordang' | 'sigale-gale' | 'gorga';

export interface Hotspot {
  position: [number, number, number];
  label: string;
  text: string;
}

export interface Artifact {
  id: ModelId;
  name: string;
  origin: string;
  description: string;
  history: Fact;
  significance: Fact;
  /** Only filled where a source supports it. */
  materials?: Fact;
  hotspots: Hotspot[];
  regionId: string;
  camera: [number, number, number];
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'rumah-bolon', name: 'Rumah Batak Toba (Rumah Bolon)', origin: 'Batak Toba', regionId: 'samosir', camera: [7, 3.5, 8],
    description: 'Studi sederhana rumah panggung dengan atap pelana yang melengkung dan bagian depan atap yang berhias.',
    history: fact('history', 'Arsitektur Batak Toba dikenal dengan rumah panggung kayu, bubungan atap melengkung, dan ujung atap yang menjorok.', 'batakArchitecture', 'tobaHouseForm'),
    significance: fact('interpretation', 'Para peneliti membaca bentuk dan ornamen rumah ini sebagai pembawa makna budaya.', 'tobaHouseForm'),
    hotspots: [
      { position: [0, 3.55, 2.35], label: 'Atap pelana', text: 'Bubungannya melandai di tengah dan naik ke arah kedua ujung.' },
      { position: [0, 2.15, 2.05], label: 'Bagian depan atap', text: 'Bagian depan menjadi pusat ornamen ukir dan lukis. Pola di sini hanya pengganti abstrak untuk gorga, bukan salinan motif asli.' },
      { position: [1.35, 0.55, 1.4], label: 'Tiang', text: 'Lantai hunian ditinggikan dari tanah dengan tiang kayu.' },
    ],
  },
  {
    id: 'siwaluh-jabu', name: 'Rumah Karo (Siwaluh Jabu)', origin: 'Karo', regionId: 'karo', camera: [7.5, 4, 8.5],
    description: 'Studi sederhana rumah besar bersama dengan atap tinggi berlapis.',
    history: fact('history', 'Sebuah kajian mendokumentasikan rumah siwaluh jabu di Lingga, sebuah desa Karo.', 'karoSpace'),
    significance: fact('tradition', 'Secara tradisi, delapan rumah tangga berbagi rumah ini pada tempat yang ditentukan adat. Kajian tahun 2020 menemukan penempatan itu sudah tidak dijalankan di Lingga.', 'karoSpace'),
    hotspots: [
      { position: [0, 4.1, 0], label: 'Atap berlapis', text: 'Atap yang tinggi mendominasi bentuknya. Model ini menyederhanakan susunan dan ujung atapnya.' },
      { position: [2.25, 1.35, 0], label: 'Ruang bersama', text: 'Secara tradisi, beberapa rumah tangga tinggal di bawah satu atap, masing-masing pada tempat adatnya.' },
      { position: [0, 0.75, 2.2], label: 'Teras depan', text: 'Dalam representasi ini, teras yang ditinggikan mengantar ke pintu masuk.' },
    ],
  },
  {
    id: 'omo-sebua', name: 'Rumah besar Nias (Omo Sebua)', origin: 'Nias, tradisi selatan', regionId: 'nias', camera: [7.5, 4.5, 9],
    description: 'Studi sederhana rumah pemimpin dengan atap sangat tinggi serta susunan tiang dan penopang yang rapat.',
    history: fact('history', 'Omo sebua adalah rumah besar para pemimpin, dibangun di atas tiang kayu yang sangat besar dengan atap curam.', 'omoSebua'),
    significance: fact('history', 'Arsitektur kayu Nias dikaji karena ketahanannya terhadap gempa.', 'niasQuake'),
    materials: fact('history', 'Tiang kayu keras yang berat, dengan bagian struktur yang disambung tanpa mengandalkan paku.', 'omoSebua'),
    hotspots: [
      { position: [0, 4.9, 0.9], label: 'Atap curam', text: 'Ketinggian atap adalah salah satu ciri paling mencolok rumah ini.' },
      { position: [1.2, 0.8, 1.55], label: 'Penopang menyilang', text: 'Kayu tegak dan miring bekerja bersama. Ini membantu bangunan merespons guncangan.' },
      { position: [-1.4, 0.12, 1.55], label: 'Alas batu', text: 'Dalam representasi prinsip fondasi ini, tiang bertumpu di atas batu.' },
    ],
  },
  {
    id: 'hombo-batu', name: 'Susunan lompat batu (Hombo Batu)', origin: 'Nias, tradisi selatan', regionId: 'nias', camera: [5.5, 3, 6.5],
    description: 'Representasi susunan batu tinggi yang dilompati dalam fahombo. Pelompatnya tidak disimulasikan.',
    history: fact('history', 'Sejumlah keterangan mengaitkan lompat batu dengan latihan pada masa pertikaian antarkampung.', 'hombo'),
    significance: fact('contemporary', 'Kini tradisi ini menjadi peragaan budaya dan simbol Nias Selatan.', 'hombo'),
    hotspots: [
      { position: [0, 2.7, 0], label: 'Puncak', text: 'Keterangan yang terbit menyebut tinggi sekitar dua meter atau lebih; angkanya beragam.' },
      { position: [0.85, 1.2, 0.35], label: 'Susunan batu', text: 'Pola blok pada model ini hanya ilustrasi.' },
      { position: [0, 0.35, 1.35], label: 'Batu tumpuan', text: 'Dalam representasi ini, batu kecil di depan susunan menandai tempat bertumpu sebelum melompat.' },
    ],
  },
  {
    id: 'ulos', name: 'Studi kain ulos', origin: 'Tradisi tenun Batak', regionId: 'toba', camera: [0, 1.2, 6.5],
    description: 'Kain bergaris rancangan sendiri yang dibuat lewat kode. Tampilannya mengesankan tenunan dan bukan salinan jenis ulos tertentu.',
    history: fact('contemporary', 'Menenun ulos masih menjadi kerajinan yang hidup di kawasan Toba.', 'unescoUlosProject'),
    significance: fact('tradition', 'Memberikan ulos dapat mengungkapkan berkat dan kasih sayang dalam hubungan kekerabatan.', 'ulosStudy', 'ulosEncyclopedia'),
    hotspots: [
      { position: [0, 0.9, 0.25], label: 'Bidang tengah', text: 'Garis yang tampak di sini hanya hiasan. Jenis ulos asli punya rancangan dan nama khusus yang sebaiknya dipelajari dari para penenun.' },
      { position: [-1.75, 0.1, 0.25], label: 'Tepi', text: 'Tepi dan garis adalah hasil nyata dari cara benang disusun di alat tenun.' },
      { position: [0.6, -1.65, 0.2], label: 'Rumbai', text: 'Dalam representasi ini, ujung benang yang lepas membentuk rumbai.' },
    ],
  },
  {
    id: 'gondang', name: 'Taganing dan ogung', origin: 'Batak Toba', regionId: 'toba', camera: [4.5, 3, 7],
    description: 'Sebagian dari gondang sabangunan: sederet gendang bernada dengan gong gantung.',
    history: fact('tradition', 'Ansambel lengkapnya juga mencakup gendang gordang, sarune bolon, dan hesek. Jumlah alatnya beragam.', 'gondangRitual', 'taganing'),
    significance: fact('tradition', 'Gondang dan tortor berkaitan erat dalam upacara Toba.', 'gondangRitual'),
    hotspots: [
      { position: [0, 2.05, 0.5], label: 'Taganing', text: 'Gendang berbeda ukuran menghasilkan nada berbeda. Taganing dapat membawakan pola melodi.' },
      { position: [2.5, 1.6, 0.2], label: 'Ogung', text: 'Gong memainkan pola berulang yang saling mengisi.' },
      { position: [-1.65, 0.7, 0.45], label: 'Rangka', text: 'Rangka pada model ini adalah penyangga yang disederhanakan.' },
    ],
  },
  {
    id: 'gordang', name: 'Gordang Sambilan', origin: 'Mandailing', regionId: 'mandailing', camera: [5, 3.5, 7.5],
    description: 'Sembilan gendang dengan ukuran bertingkat. Proporsi dan penempatannya disederhanakan.',
    history: fact('tradition', 'Gordang Sambilan secara harfiah berarti sembilan gendang.', 'gordang'),
    significance: fact('tradition', 'Ansambel ini bagian dari upacara penting dan penggunaannya diatur adat.', 'gordang'),
    hotspots: [
      { position: [0, 2.55, 0], label: 'Gendang terbesar', text: 'Perbedaan ukuran menghasilkan karakter suara yang berbeda.' },
      { position: [-2.4, 1.35, 0.2], label: 'Deret bertingkat', text: 'Kesembilan gendang dimainkan bersama oleh beberapa pemusik.' },
    ],
  },
  {
    id: 'sigale-gale', name: 'Studi boneka Sigale-gale', origin: 'Batak Toba, Samosir', regionId: 'samosir', camera: [3.5, 2.5, 7],
    description: 'Representasi boneka kayu di atas peti yang sengaja dibuat polos. Model ini tidak meniru wajah, busana, atau mekanisme sigale-gale asli mana pun.',
    history: fact('tradition', 'Sigale-gale adalah boneka kayu Batak Toba dari Samosir yang terkait dengan upacara kematian papurpur sapata bagi orang terpandang yang meninggal tanpa keturunan.', 'sigalegale'),
    significance: fact('contemporary', 'Kini boneka ini juga dikenal luas oleh wisatawan. Latar upacara kematiannya patut dihormati ketika ditampilkan sebagai pertunjukan.', 'sigalegale'),
    hotspots: [
      { position: [0, 3.15, 0.35], label: 'Sosok', text: 'Boneka ini sosok kayu menyerupai manusia. Raut wajahnya sengaja dibiarkan polos.' },
      { position: [0.74, 2.2, 0.3], label: 'Lengan', text: 'Boneka ini dibuat agar dapat bergerak. Sendi pada model ini hanya ilustrasi.' },
      { position: [1.0, 0.55, 0.68], label: 'Peti alas', text: 'Dalam representasi ini, sosok berdiri di atas alas berbentuk peti.' },
    ],
  },
  {
    id: 'gorga', name: 'Studi panel ornamen', origin: 'Terinspirasi warna gorga Batak Toba', regionId: 'samosir', camera: [0, 0.6, 6],
    description: 'Panel geometris rancangan sendiri dengan warna merah, putih, dan hitam. Sengaja tidak meniru motif gorga.',
    history: fact('contemporary', 'Ukiran gorga adalah kerajinan Batak Toba yang pernah dimasukkan UNESCO dalam sebuah proyek pemulihan.', 'unescoUlosProject'),
    significance: fact('interpretation', 'Tiap motif dipahami membawa makna. Situs ini tidak memberi makna pada motif tanpa sumber yang terverifikasi.'),
    hotspots: [
      { position: [0, 0, 0.35], label: 'Tiga warna', text: 'Merah, putih, dan hitam lazim dikaitkan dengan gorga.' },
      { position: [1.45, 1.1, 0.3], label: 'Mengapa bukan salinan?', text: 'Mengarang motif tiruan lalu memberinya makna akan menyesatkan. Panel ini tidak mengklaim makna simbolis apa pun.' },
    ],
  },
];
