/**
 * One curated landmark for each of the 25 regencies and 8 cities.
 * A landmark is one representative element, never a claim that an area has a single culture.
 */
import { fact, type Fact } from './types';

export type LandmarkCategory =
  | 'Arsitektur adat' | 'Bangunan bersejarah' | 'Tempat ibadah' | 'Situs arkeologi' | 'Warisan alam'
  | 'Seni pertunjukan' | 'Kerajinan' | 'Kuliner dan hasil bumi' | 'Warisan transportasi' | 'Kehidupan pesisir' | 'Museum';

/** How firm the basis for choosing this landmark is. */
export type Evidence = 'cukup' | 'terbatas';

export type Section = 'history' | 'architecture' | 'traditions' | 'arts' | 'culinary' | 'stories';

export const SECTIONS: Record<Section, string> = {
  history: 'Latar sejarah',
  architecture: 'Arsitektur dan peninggalan',
  traditions: 'Tradisi dan kebiasaan',
  arts: 'Musik, tari, dan kerajinan',
  culinary: 'Kuliner',
  stories: 'Cerita budaya',
};

export interface Spot {
  title: string;
  topic: string;
  /** Position on the model. */
  at: [number, number, number];
  info: Fact;
}

export interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Landmark {
  id: string;
  name: string;
  category: LandmarkCategory;
  /** One line shown on the map. */
  preview: string;
  /** Geographic context. */
  place: string;
  communities: string;
  why: string;
  evidence: Evidence;
  /** What the miniature simplifies or invents. */
  modelNote: string;
  /** Commons search used to look for documentary photos. */
  facts: Partial<Record<Section, Fact[]>>;
  spots: Spot[];
  quiz: Question[];
}

const spot = (title: string, topic: string, at: [number, number, number], info: Fact): Spot => ({ title, topic, at, info });
const q = (text: string, options: string[], answer: number, why: string): Question => {
  // Rotate by a stable amount so the right answer does not always sit in one place.
  const k = text.length % options.length;
  return { q: text, options: options.map((_, i) => options[(i + k) % options.length]), answer: (answer - k + options.length) % options.length, why };
};

const MIXED = 'Wilayah ini dihuni beragam komunitas. Susunan komunitasnya belum kami riset dengan sumber yang cukup.';

export const LANDMARKS: Record<string, Landmark> = {
  asahan: {
    id: 'asahan', name: 'Air Terjun Ponot dan Sungai Asahan', category: 'Warisan alam', evidence: 'terbatas',
    preview: 'Jeram sungai yang dikenal pegiat arung jeram.', place: 'Kabupaten di sisi timur provinsi, dilalui Sungai Asahan.', communities: MIXED,
    why: 'Sungai Asahan dan air terjun di sekitarnya adalah penanda bentang alam yang dikenal luas. Ini penanda alam, bukan simbol satu kebudayaan.',
    modelNote: 'Tebing, jeram, dan perahu karet bergaya miniatur. Tinggi dan bentuk air terjun tidak diukur dari aslinya.',
    facts: {
      history: [fact('contemporary', 'Sungai Asahan dikenal sebagai lokasi arung jeram yang pernah menjadi tuan rumah lomba.', 'asahanSungai', 'asahanJeram')],
      traditions: [fact('contemporary', 'Jeramnya dinilai berkelas tinggi, sehingga tidak disarankan bagi pemula.', 'asahanJeram')],
    },
    spots: [
      spot('Air terjun', 'Lanskap', [0, 3.4, -2.2], fact('contemporary', 'Air Terjun Ponot disebut berada di kawasan Desa Tangga. Catatan lokasi dan tingginya berbeda antarsumber.', 'asahanJeram')),
      spot('Jeram', 'Lanskap', [0, 0.8, 0.5], fact('contemporary', 'Arung jeram di Sungai Asahan ditujukan bagi pengarung berpengalaman.', 'asahanJeram')),
      spot('Reputasi', 'Makna', [0.4, 1.9, 1.8], fact('contemporary', 'Sumber pariwisata menyebut sungai ini dikenal hingga mancanegara.', 'asahanSungai')),
    ],
    quiz: [
      q('Sungai Asahan dikenal sebagai lokasi…', ['Arung jeram', 'Balap perahu layar', 'Tambak garam'], 0, 'Jeramnya menarik pegiat arung jeram.'),
      q('Landmark Asahan di atlas ini termasuk jenis…', ['Warisan alam', 'Tempat ibadah', 'Kerajinan'], 0, 'Ini penanda bentang alam.'),
    ],
  },
  'batu-bara': {
    id: 'batu-bara', name: 'Istana Niat Lima Laras', category: 'Bangunan bersejarah', evidence: 'cukup',
    preview: 'Istana kayu peninggalan Kerajaan Lima Laras.', place: 'Kabupaten di pesisir timur Sumatera Utara.', communities: 'Istana ini terkait sejarah kerajaan Melayu setempat. Penduduk kabupaten ini lebih beragam daripada itu.',
    why: 'Peninggalan arsitektur yang paling jelas terdokumentasi untuk wilayah ini dalam penelusuran kami.',
    modelNote: 'Dua lantai kayu dengan anjungan depan. Jumlah anjungan, ukuran, dan hiasan disederhanakan.',
    facts: {
      history: [fact('history', 'Istana dibangun pada awal abad ke-20. Satu sumber menyebut 1912 dan mengaitkan namanya dengan nazar (niat) Datuk Matyoeda; ejaan nama pendirinya berbeda antarsumber.', 'limaLaras', 'limaLarasJurnal')],
      architecture: [fact('history', 'Rancangannya digambarkan memadukan unsur Melayu, Tiongkok, dan Eropa.', 'limaLarasJurnal')],
      stories: [fact('contemporary', 'Bangunan ini dilaporkan mengalami kerusakan, dan ada rencana revitalisasi.', 'limaLaras')],
    },
    spots: [
      spot('Atap', 'Struktur', [0, 4, -0.1], fact('history', 'Istana menggabungkan beberapa gaya arsitektur.', 'limaLarasJurnal')),
      spot('Anjungan', 'Struktur', [0, 2.7, 1.5], fact('history', 'Satu laporan menyebut istana ini memiliki enam anjungan. Model ini hanya menampilkan satu di depan.', 'limaLaras')),
      spot('Asal nama', 'Cerita', [-1.8, 1.3, 1], fact('tradition', 'Nama Niat Lima Laras dikaitkan dengan niat atau nazar pendirinya.', 'limaLaras')),
    ],
    quiz: [
      q('Istana Niat Lima Laras dibangun sekitar…', ['Awal abad ke-20', 'Abad ke-11', 'Tahun 1990-an'], 0, 'Sumber menempatkannya pada awal abad ke-20.'),
      q('Gaya arsitekturnya digambarkan sebagai…', ['Campuran Melayu, Tiongkok, dan Eropa', 'Murni gaya Jawa', 'Gaya modern minimalis'], 0, 'Ketiga unsur itu disebut berpadu.'),
    ],
  },
  dairi: {
    id: 'dairi', name: 'Kopi Sidikalang', category: 'Kuliner dan hasil bumi', evidence: 'cukup',
    preview: 'Kopi dari Sidikalang yang namanya dikenal luas.', place: 'Kabupaten di dataran tinggi barat Danau Toba, beribu kota Sidikalang.', communities: 'Komunitas Pakpak termasuk yang tinggal di Dairi, bersama komunitas lain.',
    why: 'Kopi Sidikalang adalah hasil bumi yang melekat pada nama daerah. Dipilih sebagai warisan pertanian, bukan sebagai simbol satu suku.',
    modelNote: 'Pohon kopi, karung biji, dan cangkir sebagai komposisi simbolis.',
    facts: {
      culinary: [fact('contemporary', 'Daerah Sidikalang dikenal sebagai penghasil kopi, terutama robusta; petani juga menanam arabika.', 'sidikalang')],
      history: [fact('contemporary', 'Kopi Robusta Sidikalang tercantum dalam daftar indikasi geografis Indonesia bertanggal 2019. Cek status terbarunya pada daftar resmi.', 'sidikalangIg')],
    },
    spots: [
      spot('Pohon kopi', 'Hasil bumi', [-1.6, 1.7, -1], fact('contemporary', 'Kopi ditanam petani di kawasan Sidikalang.', 'sidikalang')),
      spot('Biji kopi', 'Material', [0.5, 1.8, 0.9], fact('contemporary', 'Robusta adalah jenis yang paling lekat dengan nama Sidikalang.', 'sidikalang')),
      spot('Indikasi geografis', 'Makna', [2.5, 1.4, 1.4], fact('contemporary', 'Indikasi geografis melindungi nama produk yang mutunya terkait daerah asal.', 'sidikalangIg')),
    ],
    quiz: [
      q('Kopi Sidikalang berasal dari kabupaten…', ['Dairi', 'Asahan', 'Nias'], 0, 'Sidikalang adalah ibu kota Dairi.'),
      q('Jenis yang paling lekat dengan nama Sidikalang adalah…', ['Robusta', 'Liberika', 'Excelsa'], 0, 'Robusta Sidikalang yang paling dikenal.'),
    ],
  },
  'deli-serdang': {
    id: 'deli-serdang', name: 'Situs Benteng Putri Hijau', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Sisa benteng tanah di Deli Tua.', place: 'Kabupaten yang mengelilingi sebagian Kota Medan.', communities: MIXED,
    why: 'Situs cagar budaya tingkat provinsi yang berada di wilayah ini.',
    modelNote: 'Tanggul tanah melingkar sebagai gambaran benteng. Ini bukan denah situs.',
    facts: {
      history: [
        fact('contemporary', 'Situs di Desa Deli Tua, Namorambe, ditetapkan sebagai cagar budaya tingkat provinsi pada 2019.', 'putriHijauBerita'),
        fact('interpretation', 'Situs ini dikaitkan dengan Kerajaan Aru.', 'putriHijau'),
      ],
      stories: [fact('folklore', 'Masyarakat setempat memiliki cerita dan kepercayaan tentang sosok Putri Hijau di sekitar situs ini. Ini cerita rakyat, bukan catatan sejarah.', 'putriHijau')],
    },
    spots: [
      spot('Tanggul tanah', 'Struktur', [-2.6, 1.3, 0.4], fact('contemporary', 'Peninggalan utamanya berupa struktur benteng tanah yang pernah rusak lalu dipulihkan bentuknya.', 'putriHijauBerita')),
      spot('Status', 'Makna', [-0.9, 1.4, 1.5], fact('contemporary', 'Statusnya cagar budaya tingkat provinsi, dan kawasan intinya masih rawan dirusak.', 'putriHijauBerita')),
      spot('Putri Hijau', 'Cerita', [0.2, 0.7, 0.2], fact('folklore', 'Nama situs terhubung dengan cerita tentang Putri Hijau.', 'putriHijau')),
    ],
    quiz: [
      q('Benteng Putri Hijau berada di wilayah…', ['Deli Tua', 'Barus', 'Bawomataluo'], 0, 'Situsnya di Desa Deli Tua.'),
      q('Cerita tentang Putri Hijau sebaiknya dipahami sebagai…', ['Cerita rakyat', 'Laporan geologi', 'Data sensus'], 0, 'Itu cerita tutur masyarakat.'),
    ],
  },
  'humbang-hasundutan': {
    id: 'humbang-hasundutan', name: 'Kompleks Istana Sisingamangaraja, Bakkara', category: 'Bangunan bersejarah', evidence: 'cukup',
    preview: 'Pusat dinasti Sisingamangaraja di Lembah Bakkara.', place: 'Kabupaten dataran tinggi di barat daya Danau Toba.', communities: 'Situs ini terkait sejarah Batak Toba. Kabupaten ini juga dihuni komunitas lain, termasuk Pakpak.',
    why: 'Situs sejarah yang kuat kaitannya dengan wilayah ini.',
    modelNote: 'Tiga rumah dalam pagar batu sebagai gambaran kompleks. Ukuran dan letak tidak diukur.',
    facts: {
      history: [fact('history', 'Kompleks di Kecamatan Baktiraja digambarkan sebagai pusat kekuasaan dinasti Sisingamangaraja; di sinilah Sisingamangaraja XII menyusun strategi melawan Belanda.', 'bakkara', 'bakkaraMongabay')],
      architecture: [fact('contemporary', 'Di dalam kompleks disebut ada beberapa rumah adat.', 'bakkaraMongabay')],
    },
    spots: [
      spot('Rumah utama', 'Struktur', [0, 3.1, -1.2], fact('history', 'Kompleks ini dikaitkan dengan kedudukan Sisingamangaraja.', 'bakkara')),
      spot('Pagar batu', 'Struktur', [-2.5, 0.7, 2.5], fact('interpretation', 'Pagar batu pada model menandai satu kompleks; bentuk aslinya tidak ditiru.')),
      spot('Perlawanan', 'Sejarah', [2.3, 2.2, 0.5], fact('history', 'Sisingamangaraja XII adalah pemimpin perlawanan terhadap Belanda dan dimakamkan di Balige.', 'bakkara')),
    ],
    quiz: [
      q('Kompleks istana di Bakkara terkait dengan dinasti…', ['Sisingamangaraja', 'Kesultanan Deli', 'Kerajaan Lima Laras'], 0, 'Itu pusat dinasti Sisingamangaraja.'),
      q('Bakkara berada di kabupaten…', ['Humbang Hasundutan', 'Langkat', 'Padang Lawas'], 0, 'Kecamatan Baktiraja ada di Humbang Hasundutan.'),
    ],
  },
  karo: {
    id: 'karo', name: 'Rumah Siwaluh Jabu', category: 'Arsitektur adat', evidence: 'cukup',
    preview: 'Rumah besar untuk delapan rumah tangga.', place: 'Dataran tinggi di utara Danau Toba.', communities: 'Karo, dengan bahasa dan adatnya sendiri.',
    why: 'Bentuk arsitektur Karo yang terdokumentasi dalam kajian.', modelNote: 'Susunan atap disederhanakan.', facts: {}, spots: [], quiz: [],
  },
  'kota-binjai': {
    id: 'kota-binjai', name: 'Rambutan Binjai', category: 'Kuliner dan hasil bumi', evidence: 'terbatas',
    preview: 'Buah yang menjadi ciri Kota Rambutan.', place: 'Kota di barat Medan.', communities: MIXED,
    why: 'Rambutan disebut sebagai ciri dan julukan kota. Ini penanda hasil bumi.',
    modelNote: 'Buah diperbesar sebagai simbol.',
    facts: {
      culinary: [fact('contemporary', 'Binjai dijuluki Kota Rambutan, dan nama Binjai juga dipakai untuk salah satu varietas rambutan.', 'rambutan')],
    },
    spots: [
      spot('Pohon rambutan', 'Hasil bumi', [-1.3, 3.5, -1], fact('contemporary', 'Rambutan lazim dikaitkan dengan identitas Kota Binjai.', 'rambutan')),
      spot('Buah', 'Ciri', [-0.4, 0.8, 2.1], fact('interpretation', 'Kulit berambut berwarna merah membuat buah ini mudah dikenali.')),
      spot('Julukan', 'Makna', [1.5, 1.7, 0.9], fact('contemporary', 'Julukan Kota Rambutan menempel pada Binjai.', 'rambutan')),
    ],
    quiz: [
      q('Julukan Kota Binjai adalah…', ['Kota Rambutan', 'Kota Salak', 'Kota Lemang'], 0, 'Binjai lekat dengan rambutan.'),
      q('Landmark Binjai di atlas ini termasuk…', ['Kuliner dan hasil bumi', 'Situs arkeologi', 'Museum'], 0, 'Yang diangkat adalah buahnya.'),
    ],
  },
  'kota-gunungsitoli': {
    id: 'kota-gunungsitoli', name: 'Museum Pusaka Nias', category: 'Museum', evidence: 'cukup',
    preview: 'Museum yang merawat ribuan benda budaya Nias.', place: 'Kota di pesisir timur Pulau Nias.', communities: 'Ono Niha (orang Nias) dan warga lain.',
    why: 'Lembaga pelestarian budaya Nias yang berkedudukan di kota ini.',
    modelNote: 'Beberapa paviliun mengelilingi bangunan tengah. Denah dan fasad tidak ditiru.',
    facts: {
      history: [fact('contemporary', 'Museum ini dikelola Yayasan Pusaka Nias, sebuah yayasan nirlaba. Gempa Maret 2005 merusak sebagian pajangan dan koleksi.', 'museumNiasRri', 'museumNias')],
      arts: [fact('contemporary', 'Koleksinya mencakup benda sejarah, budaya, dan seni, antara lain patung leluhur, perhiasan, dan kursi batu kebesaran.', 'museumNias')],
    },
    spots: [
      spot('Bangunan tengah', 'Fungsi', [0, 3, -0.5], fact('contemporary', 'Museum menjadi tempat pameran dan pelestarian budaya Nias.', 'museumNiasRri')),
      spot('Koleksi batu', 'Koleksi', [0, 1.6, 1.9], fact('contemporary', 'Benda kebesaran dari batu termasuk dalam koleksi yang disebut.', 'museumNias')),
      spot('Paviliun', 'Struktur', [-2.4, 1.9, 1.1], fact('contemporary', 'Koleksinya berjumlah ribuan, dan hanya sebagian yang dipamerkan.', 'museumNiasRri')),
    ],
    quiz: [
      q('Museum Pusaka Nias berada di…', ['Gunungsitoli', 'Sibolga', 'Medan'], 0, 'Museumnya di Kota Gunungsitoli.'),
      q('Peran utama museum ini adalah…', ['Melestarikan budaya Nias', 'Memproduksi kendaraan', 'Menambang batu'], 0, 'Museum merawat dan memamerkan warisan Nias.'),
    ],
  },
  'kota-medan': {
    id: 'kota-medan', name: 'Istana Maimun', category: 'Bangunan bersejarah', evidence: 'cukup',
    preview: 'Istana Kesultanan Deli di pusat kota.', place: 'Ibu kota provinsi.', communities: 'Kota majemuk: Melayu, berbagai kelompok Batak, Jawa, Tionghoa, Minangkabau, keturunan India, dan lainnya.',
    why: 'Bangunan bersejarah utama kota yang terdokumentasi. Ia mewakili satu lapisan sejarah, bukan seluruh warga Medan.',
    modelNote: 'Fasad kuning memanjang dengan serambi depan; jumlah lengkung dan atap disederhanakan.',
    facts: {
      history: [fact('history', 'Istana Maimun dibangun sekitar 1887 hingga 1892 untuk Kesultanan Deli; tanggalnya sedikit berbeda antarsumber.', 'maimun')],
      architecture: [fact('history', 'Rancangannya memadukan beberapa tradisi arsitektur. Rumah Tjong A Fie di kota yang sama memadukan gaya Tionghoa, Melayu, dan pengaruh Eropa.', 'maimun', 'medanSites')],
    },
    spots: [
      spot('Serambi depan', 'Struktur', [0, 2.6, 1.4], fact('history', 'Istana ini menjadi kediaman resmi Sultan Deli pada masanya.', 'maimun')),
      spot('Lengkung', 'Ornamen', [-2.2, 1.2, 0.9], fact('interpretation', 'Deretan lengkung memberi irama pada wajah bangunan.')),
      spot('Kota majemuk', 'Makna', [2.4, 3.2, -0.3], fact('contemporary', 'Warisan istana Melayu hidup berdampingan dengan warisan banyak komunitas lain di Medan.', 'medanWiki')),
    ],
    quiz: [
      q('Istana Maimun terkait dengan…', ['Kesultanan Deli', 'Kerajaan Lima Laras', 'Dinasti Sisingamangaraja'], 0, 'Ini istana Kesultanan Deli.'),
      q('Medan paling tepat digambarkan sebagai…', ['Kota dengan satu budaya', 'Kota majemuk', 'Kota tanpa sejarah'], 1, 'Banyak komunitas hidup di Medan.'),
    ],
  },
  'kota-padangsidimpuan': {
    id: 'kota-padangsidimpuan', name: 'Salak Sidimpuan', category: 'Kuliner dan hasil bumi', evidence: 'cukup',
    preview: 'Buah khas dari “Kota Salak”.', place: 'Kota di Tapanuli bagian selatan, dikelilingi perbukitan.', communities: 'Termasuk kawasan budaya Angkola, dengan warga dari berbagai latar.',
    why: 'Salak adalah julukan sekaligus buah tangan khas kota ini.', modelNote: 'Buah diperbesar sebagai simbol.',
    facts: {
      culinary: [fact('contemporary', 'Padangsidimpuan dijuluki Kota Salak karena dikelilingi kebun salak di perbukitan. Salak menjadi buah tangan khasnya.', 'salak')],
    },
    spots: [
      spot('Kulit bersisik', 'Ciri', [0.3, 2.4, 0.8], fact('interpretation', 'Kulit bersisik cokelat membuat salak mudah dikenali.')),
      spot('Keranjang', 'Buah tangan', [1.8, 0.9, 1], fact('contemporary', 'Salak mudah dijumpai di pasar dan lazim dibawa sebagai oleh-oleh.', 'salak')),
      spot('Tanaman salak', 'Hasil bumi', [-2.4, 2.2, -1.2], fact('contemporary', 'Kebun salak berada di kawasan perbukitan sekitar kota.', 'salak')),
    ],
    quiz: [
      q('Julukan Padangsidimpuan adalah…', ['Kota Salak', 'Kota Ikan', 'Kota Rambutan'], 0, 'Kota ini lekat dengan salak.'),
      q('Salak di kota ini lazim menjadi…', ['Buah tangan khas', 'Bahan bangunan', 'Alat musik'], 0, 'Banyak dibawa sebagai oleh-oleh.'),
    ],
  },
  'kota-pematangsiantar': {
    id: 'kota-pematangsiantar', name: 'Becak BSA Siantar', category: 'Warisan transportasi', evidence: 'cukup',
    preview: 'Becak bermesin motor tua Inggris.', place: 'Kota yang berada di tengah wilayah Simalungun.', communities: MIXED,
    why: 'Becak motor BSA diangkat sebagai ikon kota dan punya tugu sendiri.', modelNote: 'Bentuk motor dan bak penumpang disederhanakan; bukan model BSA tertentu.',
    facts: {
      history: [fact('history', 'Sepeda motor BSA (Birmingham Small Arms) asal Inggris diubah menjadi becak motor, dan menjadi ikon kota terutama sejak sekitar 1970-an.', 'becakBsa')],
      traditions: [fact('contemporary', 'Jumlah becak BSA terus berkurang; komunitas pemiliknya berupaya menjaganya. Tugu Becak BSA diresmikan pada 2016.', 'becakBsa')],
    },
    spots: [
      spot('Mesin', 'Teknik', [0, 1.4, 0.9], fact('history', 'Penggeraknya motor BSA buatan Inggris.', 'becakBsa')),
      spot('Bak penumpang', 'Fungsi', [0.1, 1.2, -0.6], fact('contemporary', 'Bak samping dipakai mengangkut penumpang di dalam kota.', 'becakBsa')),
      spot('Ikon kota', 'Makna', [0.1, 2.8, -0.5], fact('contemporary', 'Becak BSA dipandang sebagai ikon Pematangsiantar.', 'becakBsa')),
    ],
    quiz: [
      q('Motor yang dipakai becak ikonik Siantar adalah…', ['BSA', 'Skuter listrik', 'Sepeda kayuh'], 0, 'BSA berasal dari Inggris.'),
      q('Tantangan becak BSA saat ini adalah…', ['Jumlahnya berkurang', 'Terlalu banyak diproduksi', 'Dilarang punya roda'], 0, 'Unitnya makin sedikit.'),
    ],
  },
  'kota-sibolga': {
    id: 'kota-sibolga', name: 'Perahu nelayan Pesisir Sibolga', category: 'Kehidupan pesisir', evidence: 'terbatas',
    preview: 'Gambaran kota pelabuhan yang dijuluki Kota Ikan.', place: 'Kota pelabuhan di pantai barat.', communities: 'Kota Pesisir yang majemuk, antara lain Batak, Minangkabau, Mandailing, dan Tionghoa.',
    why: 'Laut dan perikanan membentuk kehidupan kota. Perahu dipilih sebagai gambaran, karena belum ada satu bangunan ikonik yang kami verifikasi.',
    modelNote: 'Perahu nelayan bergaya umum, bukan jenis perahu tradisional tertentu.',
    facts: {
      history: [fact('contemporary', 'Sibolga dijuluki Kota Ikan; perikanan dan perdagangan laut menjadi tumpuan ekonominya.', 'sibolgaIkan')],
      arts: [fact('tradition', 'Kesenian Sikambang diteliti sebagai penanda identitas budaya Pesisir Sibolga dalam lingkungan yang multikultural.', 'sikambang')],
    },
    spots: [
      spot('Perahu', 'Kehidupan laut', [-0.6, 2.4, 0.6], fact('contemporary', 'Banyak kegiatan ekonomi kota bertumpu pada laut.', 'sibolgaIkan')),
      spot('Dermaga', 'Fungsi', [-1.6, 1.2, -1.5], fact('interpretation', 'Dermaga pada model menggambarkan tempat bongkar hasil tangkapan.')),
      spot('Sikambang', 'Kesenian', [-1.1, 1.8, -1.4], fact('tradition', 'Sikambang adalah kesenian yang lekat dengan identitas Pesisir.', 'sikambang')),
    ],
    quiz: [
      q('Julukan Sibolga adalah…', ['Kota Ikan', 'Kota Salak', 'Kota Kopi'], 0, 'Sebutan itu terkait potensi lautnya.'),
      q('Kesenian yang diteliti sebagai identitas Pesisir Sibolga adalah…', ['Sikambang', 'Gordang Sambilan', 'Tari Moyo'], 0, 'Sikambang.'),
    ],
  },
  'kota-tanjungbalai': {
    id: 'kota-tanjungbalai', name: 'Masjid Raya Sultan Ahmadsyah', category: 'Tempat ibadah', evidence: 'cukup',
    preview: 'Masjid peninggalan Kesultanan Asahan.', place: 'Kota pelabuhan sungai di pesisir timur.', communities: 'Terkait sejarah Melayu Asahan; warga kota beragam.',
    why: 'Disebut sebagai ikon kota dan bangunan cagar budaya.', modelNote: 'Ruang utama memanjang dan menara terpisah; detail fasad disederhanakan.',
    facts: {
      history: [fact('history', 'Masjid dibangun pada masa Sultan Ahmadsyah, penguasa Asahan 1854–1888. Tahun pembangunan yang disebut berkisar 1883–1886.', 'ahmadsyah')],
      architecture: [fact('contemporary', 'Masjid ini digambarkan bergaya Melayu dan dipandang sebagai ikon kota.', 'ahmadsyah')],
    },
    spots: [
      spot('Atap', 'Struktur', [-0.4, 3.6, 0], fact('contemporary', 'Gaya bangunannya digambarkan bernuansa Melayu.', 'ahmadsyah')),
      spot('Serambi', 'Fungsi', [-1.5, 1.1, 1.4], fact('contemporary', 'Masjid berada di kawasan Tanjungbalai Selatan.', 'ahmadsyah')),
      spot('Kesultanan', 'Sejarah', [2.75, 3.2, 0.5], fact('history', 'Masjid ini peninggalan Kesultanan Asahan.', 'ahmadsyah')),
    ],
    quiz: [
      q('Masjid Raya Sultan Ahmadsyah terkait dengan…', ['Kesultanan Asahan', 'Kesultanan Langkat', 'Kerajaan Aru'], 0, 'Sultan Ahmadsyah adalah penguasa Asahan.'),
      q('Masjid ini berada di kota…', ['Tanjungbalai', 'Binjai', 'Sibolga'], 0, 'Letaknya di Tanjungbalai.'),
    ],
  },
  'kota-tebing-tinggi': {
    id: 'kota-tebing-tinggi', name: 'Lemang Tebing Tinggi', category: 'Kuliner dan hasil bumi', evidence: 'cukup',
    preview: 'Ketan dalam bambu, identitas kuliner kota.', place: 'Kota di jalur lintas pesisir timur.', communities: 'Perdagangan lemang di kota ini dirintis pendatang Minangkabau; warganya beragam.',
    why: 'Lemang dikenal luas sebagai identitas kuliner kota.', modelNote: 'Deretan bambu dan bara api sebagai gambaran cara memasak.',
    facts: {
      culinary: [fact('contemporary', 'Lemang menjadi identitas kuliner Tebing Tinggi, didukung pemerintah kota lewat bantuan kepada pedagang.', 'lemangStudi')],
      history: [fact('history', 'Perdagangan lemang di kota ini dirintis warga Minangkabau dan populer sejak 1950-an. Pada 2013 kota ini mencatat rekor MURI terkait lemang.', 'lemangStudi', 'lemang')],
    },
    spots: [
      spot('Bambu', 'Bahan', [-1.2, 2.2, -0.7], fact('interpretation', 'Ketan dimasak di dalam ruas bambu.')),
      spot('Bara api', 'Cara masak', [0, 0.8, 1], fact('interpretation', 'Bambu disandarkan di dekat api agar matang perlahan.')),
      spot('Sajian', 'Kuliner', [1.7, 1, 2.2], fact('contemporary', 'Lemang batok termasuk sajian yang terkenal dari kota ini.', 'lemang')),
    ],
    quiz: [
      q('Lemang dibuat dari…', ['Ketan dalam bambu', 'Tepung yang digoreng', 'Ikan asap'], 0, 'Ketan dimasak dalam bambu.'),
      q('Perdagangan lemang di kota ini dirintis oleh pendatang…', ['Minangkabau', 'Eropa', 'Nias'], 0, 'Menurut kajian yang dirujuk.'),
    ],
  },
  labuhanbatu: {
    id: 'labuhanbatu', name: 'Masjid Raya Rantauprapat', category: 'Tempat ibadah', evidence: 'terbatas',
    preview: 'Masjid yang terkait Kesultanan Bilah.', place: 'Kabupaten di bagian tenggara pesisir timur, beribu kota Rantauprapat.', communities: MIXED,
    why: 'Peninggalan terkait Kesultanan Bilah yang paling jelas dalam penelusuran kami.', modelNote: 'Bentuk dan warna masjid adalah penafsiran, bukan salinan.',
    facts: {
      history: [fact('history', 'Sebuah skripsi menyebut masjid agung ini dibangun pada 1933 di atas tanah pemberian Kesultanan Bilah.', 'rantauprapat')],
      architecture: [fact('history', 'Arsitekturnya digambarkan memadukan gaya Timur Tengah, India, dan Eropa.', 'rantauprapat')],
    },
    spots: [
      spot('Kubah', 'Struktur', [0, 4.4, 0], fact('history', 'Perpaduan beberapa gaya terlihat dalam rancangannya.', 'rantauprapat')),
      spot('Lengkung', 'Ornamen', [-0.4, 1.4, 1.7], fact('interpretation', 'Bukaan melengkung pada model menegaskan nuansa Timur Tengah.')),
      spot('Kesultanan Bilah', 'Sejarah', [1.6, 2.9, 1.6], fact('history', 'Masjid ini terhubung dengan sejarah Kesultanan Bilah.', 'rantauprapat')),
    ],
    quiz: [
      q('Masjid ini terkait dengan kesultanan…', ['Bilah', 'Deli', 'Langkat'], 0, 'Tanahnya dari Kesultanan Bilah.'),
      q('Ibu kota Kabupaten Labuhanbatu adalah…', ['Rantauprapat', 'Kisaran', 'Balige'], 0, 'Rantauprapat.'),
    ],
  },
  'labuhanbatu-selatan': {
    id: 'labuhanbatu-selatan', name: 'Puing Istana Bahran, Kotapinang', category: 'Bangunan bersejarah', evidence: 'cukup',
    preview: 'Sisa istana Kesultanan Kotapinang.', place: 'Kabupaten di ujung tenggara provinsi.', communities: MIXED,
    why: 'Jejak utama Kesultanan Kotapinang yang masih berdiri sebagian.', modelNote: 'Tiang dan dinding runtuh digambarkan bebas; ini bukan rekaman kondisi puing.',
    facts: {
      history: [fact('history', 'Istana Bahran adalah pusat Kesultanan Kotapinang. Tahun pembangunannya berbeda antarsumber, sekitar 1927–1934. Istana hancur pada masa revolusi sosial 1946.', 'bahran')],
      stories: [fact('contemporary', 'Kini tersisa puing yang kurang terawat; ada dorongan untuk melestarikannya sebagai wisata sejarah. Status cagar budaya resminya belum kami pastikan.', 'bahran')],
    },
    spots: [
      spot('Tiang tersisa', 'Struktur', [-1.7, 2.6, -1.2], fact('contemporary', 'Yang tampak hari ini hanyalah sebagian struktur.', 'bahran')),
      spot('Tahun 1946', 'Sejarah', [0.2, 0.8, 0.4], fact('history', 'Revolusi sosial 1946 mengakhiri banyak istana di Sumatra Timur, termasuk ini.', 'bahran')),
      spot('Pelestarian', 'Makna', [1.8, 2.5, -1.2], fact('contemporary', 'Peninggalan ini membutuhkan perlindungan.', 'bahran')),
    ],
    quiz: [
      q('Istana Bahran adalah pusat kesultanan…', ['Kotapinang', 'Asahan', 'Serdang'], 0, 'Kesultanan Kotapinang.'),
      q('Kondisi istana saat ini…', ['Tinggal puing', 'Baru selesai dibangun', 'Menjadi pasar modern'], 0, 'Yang tersisa puing.'),
    ],
  },
  'labuhanbatu-utara': {
    id: 'labuhanbatu-utara', name: 'Masjid Raya Al-Haji Muhammad Syah (Kualuh)', category: 'Tempat ibadah', evidence: 'terbatas',
    preview: 'Masjid peninggalan Kesultanan Kualuh.', place: 'Kabupaten di pesisir timur bagian tenggara.', communities: MIXED,
    why: 'Peninggalan Kesultanan Kualuh yang tercatat dalam kajian lokal.', modelNote: 'Bentuk masjid adalah penafsiran dari keterangan tertulis.',
    facts: {
      history: [fact('history', 'Masjid di Tanjung Pasir ini dikaitkan dengan Kesultanan Kualuh; kajian yang paling konsisten menyebut pembangunan 1934–1937, sementara sumber lain menyebut tahun berbeda.', 'kualuh')],
      architecture: [fact('history', 'Gayanya digambarkan memadukan arsitektur Melayu dan Timur Tengah.', 'kualuh')],
    },
    spots: [
      spot('Kubah', 'Struktur', [0, 4, -0.35], fact('history', 'Unsur Timur Tengah berpadu dengan gaya Melayu.', 'kualuh')),
      spot('Pintu depan', 'Fungsi', [0, 1.1, 1.5], fact('contemporary', 'Masjid berada di tepi jalan utama Dusun Tanjung Pasir.', 'kualuh')),
      spot('Kesultanan Kualuh', 'Sejarah', [-2, 2.2, 1.2], fact('history', 'Masjid ini bagian dari jejak Kesultanan Kualuh.', 'kualuh')),
    ],
    quiz: [
      q('Masjid ini peninggalan kesultanan…', ['Kualuh', 'Bilah', 'Deli'], 0, 'Kesultanan Kualuh.'),
      q('Arsitekturnya digambarkan memadukan gaya…', ['Melayu dan Timur Tengah', 'Romawi dan Gotik', 'Jepang dan Jawa'], 0, 'Dua unsur itu disebut.'),
    ],
  },
  langkat: {
    id: 'langkat', name: 'Masjid Azizi, Tanjung Pura', category: 'Tempat ibadah', evidence: 'cukup',
    preview: 'Masjid warisan Kesultanan Langkat.', place: 'Kabupaten di barat laut provinsi, berbatasan dengan Aceh.', communities: 'Terkait sejarah Melayu Langkat; warga kabupaten ini beragam.',
    why: 'Bangunan warisan paling dikenal dari Kesultanan Langkat.', modelNote: 'Kubah, serambi, dan menara disederhanakan.',
    facts: {
      history: [fact('history', 'Pembangunan dimulai pada masa Sultan Musa dan diteruskan Sultan Abdul Aziz; masjid diresmikan 13 Juni 1902. Tahun awal pembangunan berbeda antarsumber.', 'azizi', 'aziziWiki')],
      architecture: [fact('history', 'Rancangannya memadukan unsur budaya Melayu dan arsitektur Islam.', 'aziziWiki')],
      stories: [fact('tradition', 'Nama Azizi diambil dari nama Sultan Abdul Aziz.', 'azizi')],
    },
    spots: [
      spot('Kubah utama', 'Struktur', [0, 4.6, 0], fact('history', 'Kubah besar menjadi ciri sosok masjid.', 'aziziWiki')),
      spot('Gerbang depan', 'Fungsi', [0, 1.9, 2.4], fact('contemporary', 'Masjid ini masih dipakai beribadah.', 'azizi')),
      spot('Menara', 'Struktur', [2.75, 3.9, 1.6], fact('history', 'Masjid diresmikan pada 1902.', 'azizi', 'aziziWiki')),
    ],
    quiz: [
      q('Masjid Azizi berada di…', ['Tanjung Pura, Langkat', 'Perbaungan', 'Barus'], 0, 'Di Tanjung Pura.'),
      q('Nama “Azizi” diambil dari…', ['Sultan Abdul Aziz', 'Nama sungai', 'Nama arsitek'], 0, 'Dari nama sang sultan.'),
    ],
  },
  'mandailing-natal': {
    id: 'mandailing-natal', name: 'Bagas Godang dan Gordang Sambilan', category: 'Arsitektur adat', evidence: 'cukup',
    preview: 'Rumah raja adat dan sembilan gendang.', place: 'Kabupaten paling selatan di pesisir barat daya.', communities: 'Mandailing, bersama komunitas pesisir dan lainnya.',
    why: 'Arsitektur dan musik adat Mandailing yang terdokumentasi.', modelNote: 'Susunan dan ukuran disederhanakan.', facts: {}, spots: [], quiz: [],
  },
  nias: {
    id: 'nias', name: 'Tari Moyo (Tari Elang)', category: 'Seni pertunjukan', evidence: 'cukup',
    preview: 'Tarian yang meniru kepak elang.', place: 'Kabupaten di Pulau Nias.', communities: 'Ono Niha (orang Nias).',
    why: 'Kami belum menemukan bangunan ikonik khusus untuk kabupaten ini. Tari Moyo dikenal di Nias dari utara sampai selatan, jadi ia bukan milik eksklusif kabupaten ini.',
    modelNote: 'Sosok penari tanpa raut wajah; busana dan gerak hanya gambaran, bukan rekaman koreografi.',
    facts: {
      arts: [
        fact('tradition', 'Dalam bahasa Nias, moyo berarti elang. Gerak tangan menyerupai kepak sayap, dengan langkah berjinjit dan mengentak.', 'tariMoyo'),
        fact('tradition', 'Tarian diiringi musik gondra dan lagu.', 'tariMoyo'),
      ],
      stories: [fact('folklore', 'Cerita asal-usul tarian ini punya beberapa versi yang berbeda antarwilayah di Nias.', 'tariMoyo')],
      traditions: [fact('contemporary', 'Kini tarian ini lazim ditampilkan untuk menyambut tamu, dalam pernikahan, dan acara adat.', 'tariMoyo')],
    },
    spots: [
      spot('Gerak lengan', 'Gerak', [1.4, 2.6, 0.5], fact('tradition', 'Lengan dikepakkan menyerupai elang yang terbang.', 'tariMoyo')),
      spot('Irama pengiring', 'Musik', [0.7, 1.3, -2.3], fact('tradition', 'Gondra termasuk musik pengiringnya.', 'tariMoyo')),
      spot('Fungsi', 'Makna', [0, 3.5, 0.5], fact('contemporary', 'Tari Moyo hadir dalam penyambutan dan perayaan.', 'tariMoyo')),
    ],
    quiz: [
      q('Arti kata “moyo” dalam bahasa Nias adalah…', ['Elang', 'Gunung', 'Perahu'], 0, 'Moyo berarti elang.'),
      q('Tari Moyo kini lazim ditampilkan untuk…', ['Menyambut tamu', 'Membajak sawah', 'Menangkap ikan'], 0, 'Antara lain penyambutan tamu.'),
    ],
  },
  'nias-barat': {
    id: 'nias-barat', name: 'Megalit Baladano Laina', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Kompleks tujuh peninggalan batu besar.', place: 'Kabupaten di sisi barat Pulau Nias.', communities: 'Ono Niha (orang Nias).',
    why: 'Situs megalitik di Mandrehe yang tercatat sebagai cagar budaya.', modelNote: 'Bentuk dan letak batu digambar bebas.',
    facts: {
      history: [fact('history', 'Situs di Mandrehe ini memuat tujuh tinggalan batu besar dan tercatat sebagai cagar budaya.', 'baladano')],
      architecture: [fact('history', 'Jenis megalit yang dikenal di Nias mencakup batu tegak seperti behu dan batu datar seperti daro-daro.', 'baladano')],
      stories: [fact('contemporary', 'Peninggalan megalitik di Nias Barat dinilai rentan hilang dan belum terdata menyeluruh.', 'baladano')],
    },
    spots: [
      spot('Batu tegak', 'Bentuk', [-0.4, 3.4, -1.5], fact('history', 'Batu tegak termasuk bentuk megalit yang dikenal di Nias.', 'baladano')),
      spot('Batu meja', 'Bentuk', [0.4, 1.3, 0.6], fact('history', 'Batu datar juga termasuk di antaranya.', 'baladano')),
      spot('Pelindungan', 'Makna', [0.3, 0.8, 2.2], fact('contemporary', 'Peninggalan batu perlu dijaga dari kerusakan dan pencurian.', 'baladano')),
    ],
    quiz: [
      q('Baladano Laina adalah situs…', ['Megalitik', 'Candi bata', 'Istana kayu'], 0, 'Peninggalan batu besar.'),
      q('Situs ini berada di wilayah…', ['Mandrehe, Nias Barat', 'Portibi', 'Deli Tua'], 0, 'Di Mandrehe.'),
    ],
  },
  'nias-selatan': {
    id: 'nias-selatan', name: 'Omo Sebua dan Hombo Batu', category: 'Arsitektur adat', evidence: 'cukup',
    preview: 'Rumah besar dan tradisi lompat batu.', place: 'Bagian selatan Pulau Nias beserta pulau-pulau di sekitarnya.', communities: 'Ono Niha, dengan tradisi khas Nias Selatan.',
    why: 'Warisan arsitektur dan tradisi yang terdokumentasi di wilayah ini.', modelNote: 'Tata letak ilustratif, bukan denah desa.', facts: {}, spots: [], quiz: [],
  },
  'nias-utara': {
    id: 'nias-utara', name: 'Omo Hada, rumah panggung warga', category: 'Arsitektur adat', evidence: 'terbatas',
    preview: 'Rumah kayu bertumpu batu.', place: 'Bagian utara Pulau Nias.', communities: 'Ono Niha (orang Nias).',
    why: 'Omo hada, rumah warga biasa, pernah diteliti untuk Nias bagian utara. Ciri denah khas utara belum kami verifikasi, jadi tidak ditiru.',
    modelNote: 'Memakai bentuk rumah panggung Nias yang umum. Denah asli rumah Nias Utara belum dimodelkan.',
    facts: {
      architecture: [
        fact('history', 'Penelitian atas omo hada menunjukkan alas tiang yang bertumpu bebas di atas batu berperan dalam kestabilannya, walau tidak lagi efektif pada guncangan yang sangat kuat.', 'omoHada'),
        fact('history', 'Rumah tradisional Nias bertumpu pada tiang tegak dan miring tanpa paku, dan umumnya bertahan baik saat gempa 2004–2005.', 'niasQuake'),
      ],
    },
    spots: [
      spot('Alas batu', 'Struktur', [-1.3, 0.4, 0.6], fact('history', 'Tiang yang bertumpu di atas batu dapat bergeser saat diguncang.', 'omoHada')),
      spot('Penopang miring', 'Struktur', [0.9, 0.9, 0.7], fact('history', 'Tiang miring membantu menahan guncangan.', 'niasQuake')),
      spot('Rumah warga', 'Fungsi', [0, 3.9, -0.4], fact('contemporary', 'Omo hada adalah sebutan rumah warga, berbeda dari omo sebua milik pemimpin.', 'omoSebua')),
    ],
    quiz: [
      q('Omo hada adalah…', ['Rumah warga', 'Alat musik', 'Kain tenun'], 0, 'Rumah tradisional warga biasa.'),
      q('Bagian yang membantu menghadapi gempa antara lain…', ['Tiang bertumpu batu dan penopang miring', 'Dinding beton tebal', 'Atap logam berat'], 0, 'Menurut penelitian yang dirujuk.'),
    ],
  },
  'padang-lawas': {
    id: 'padang-lawas', name: 'Biaro Sipamutung', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Candi bata Buddha di Barumun Tengah.', place: 'Kabupaten di pedalaman bagian selatan–timur.', communities: MIXED,
    why: 'Candi yang disebut terbesar dalam gugus percandian Padang Lawas di wilayah kabupaten ini.', modelNote: 'Bentuk candi dan sisa bangunan adalah penafsiran.',
    facts: {
      history: [fact('interpretation', 'Biaro Sipamutung di Desa Siparau adalah candi bercorak Buddha, diperkirakan dari sekitar abad ke-11 dan dikaitkan dengan Kerajaan Pannai.', 'sipamutung')],
      architecture: [fact('history', 'Candi ini terutama dibangun dari bata. Warga setempat menyebut bangunan semacam ini biaro.', 'sipamutung')],
    },
    spots: [
      spot('Puncak candi', 'Struktur', [0, 4, -0.6], fact('interpretation', 'Sosok puncak pada model direka; bentuk asli perlu dilihat pada dokumentasi situs.')),
      spot('Bata', 'Material', [-1.1, 1.5, 0.5], fact('history', 'Bata adalah bahan utamanya.', 'sipamutung')),
      spot('Gugus candi', 'Lanskap', [2.5, 1.4, 0.8], fact('history', 'Sipamutung bagian dari gugus percandian Padang Lawas.', 'sipamutung')),
    ],
    quiz: [
      q('Bahan utama Biaro Sipamutung adalah…', ['Bata', 'Kayu', 'Besi'], 0, 'Candi bata.'),
      q('Istilah setempat untuk bangunan ini adalah…', ['Biaro', 'Sopo', 'Omo'], 0, 'Disebut biaro.'),
    ],
  },
  'padang-lawas-utara': {
    id: 'padang-lawas-utara', name: 'Candi Bahal (Biaro Portibi)', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Kompleks candi bata Buddha Vajrayana.', place: 'Kabupaten pedalaman di bagian selatan–timur.', communities: MIXED,
    why: 'Peninggalan arkeologi paling dikenal di wilayah ini.', modelNote: 'Satu candi utama dengan alas bertingkat; relief dan ukuran tidak ditiru.',
    facts: {
      history: [fact('history', 'Kompleks Biaro Bahal di Kecamatan Portibi terdiri atas Bahal I, II, dan III, bercorak Buddha Vajrayana. Perkiraan usianya berbeda antarsumber, sekitar abad ke-11 hingga ke-12.', 'bahalWiki', 'bahalSpasial')],
      stories: [fact('interpretation', 'Kata biaro dikaitkan dengan vihara, dan Portibi dengan kata prithivi yang berarti bumi.', 'bahalWiki')],
      architecture: [fact('history', 'Bangunannya dari bata merah.', 'bahalSpasial')],
    },
    spots: [
      spot('Atap candi', 'Struktur', [0, 4.8, -0.15], fact('history', 'Candi berdiri dalam kompleks yang terdiri atas beberapa bangunan.', 'bahalSpasial')),
      spot('Pintu', 'Struktur', [0, 1.7, 1.2], fact('history', 'Corak keagamaannya Buddha Vajrayana.', 'bahalWiki')),
      spot('Nama', 'Cerita', [-1.8, 1.2, 1.8], fact('interpretation', 'Nama Portibi dikaitkan dengan arti bumi.', 'bahalWiki')),
    ],
    quiz: [
      q('Candi Bahal bercorak…', ['Buddha Vajrayana', 'Arsitektur kolonial', 'Rumah adat'], 0, 'Buddha Vajrayana.'),
      q('Candi Bahal terutama dibangun dari…', ['Bata', 'Bambu', 'Ijuk'], 0, 'Bata merah.'),
    ],
  },
  'pakpak-bharat': {
    id: 'pakpak-bharat', name: 'Patung Batu Mejan', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Patung batu penunggang gajah atau kuda.', place: 'Kabupaten dataran tinggi di barat provinsi.', communities: 'Pakpak.',
    why: 'Peninggalan batu yang disebut peneliti sebagai identitas khas masyarakat Pakpak Bharat.', modelNote: 'Patung disederhanakan tanpa detail ukiran; bukan salinan mejan tertentu.',
    facts: {
      history: [fact('history', 'Mejan adalah patung batu yang menggambarkan orang menunggang gajah atau kuda, peninggalan leluhur Pakpak yang diteliti arkeolog.', 'mejanUgm')],
      traditions: [fact('interpretation', 'Mejan digambarkan sebagai lambang kepahlawanan.', 'mejanUgm')],
      stories: [fact('contemporary', 'Banyak mejan dilaporkan rusak atau hilang, sehingga pelindungannya mendesak.', 'mejanUgm')],
    },
    spots: [
      spot('Penunggang', 'Bentuk', [-0.5, 3, 0], fact('history', 'Sosok penunggang menjadi ciri mejan.', 'mejanUgm')),
      spot('Hewan tunggangan', 'Bentuk', [1, 1.7, 0], fact('history', 'Hewannya berupa gajah atau kuda.', 'mejanUgm')),
      spot('Identitas', 'Makna', [2.2, 1.7, 0.9], fact('contemporary', 'Mejan menjadi kebanggaan identitas masyarakat Pakpak Bharat.', 'mejanUgm')),
    ],
    quiz: [
      q('Mejan adalah…', ['Patung batu penunggang', 'Kain tenun', 'Gendang'], 0, 'Patung batu.'),
      q('Mejan terkait dengan masyarakat…', ['Pakpak', 'Nias', 'Melayu Deli'], 0, 'Warisan Pakpak.'),
    ],
  },
  samosir: {
    id: 'samosir', name: 'Rumah Batak Toba di tepi Danau Toba', category: 'Arsitektur adat', evidence: 'cukup',
    preview: 'Rumah beratap pelana di pulau tengah danau.', place: 'Pulau Samosir dan tepi barat Danau Toba.', communities: 'Batak Toba.',
    why: 'Arsitektur Batak Toba dan lanskap danau yang lekat dengan Samosir.', modelNote: 'Pola hias abstrak, bukan motif gorga asli.', facts: {}, spots: [], quiz: [],
  },
  'serdang-bedagai': {
    id: 'serdang-bedagai', name: 'Masjid Raya Sulaimaniyah, Perbaungan', category: 'Tempat ibadah', evidence: 'terbatas',
    preview: 'Masjid peninggalan Kesultanan Serdang.', place: 'Kabupaten pesisir timur di tenggara Medan.', communities: 'Terkait sejarah Melayu Serdang; warga kabupaten ini beragam.',
    why: 'Peninggalan Kesultanan Serdang yang masih dikenal.', modelNote: 'Bentuk masjid adalah penafsiran.',
    facts: {
      history: [fact('history', 'Masjid di Perbaungan didirikan atas perintah Sultan Sulaiman Syariful Alamsyah ketika pusat Kesultanan Serdang dipindahkan; sebuah skripsi menyebut tahun 1894. Bangunan awalnya sederhana dan telah banyak diubah.', 'sulaimaniyah')],
    },
    spots: [
      spot('Atap bertingkat', 'Struktur', [0, 3.9, -0.2], fact('interpretation', 'Atap pada model disusun bertingkat sebagai gambaran umum.')),
      spot('Serambi', 'Fungsi', [-1.4, 1.5, 1.8], fact('history', 'Bentuk bangunan sekarang sudah berbeda dari bangunan awalnya.', 'sulaimaniyah')),
      spot('Kesultanan Serdang', 'Sejarah', [2.55, 2.5, 1.9], fact('history', 'Masjid ini menjadi bukti warisan Kesultanan Melayu Serdang.', 'sulaimaniyah')),
    ],
    quiz: [
      q('Masjid Sulaimaniyah Perbaungan terkait dengan kesultanan…', ['Serdang', 'Bilah', 'Asahan'], 0, 'Kesultanan Serdang.'),
      q('Bangunan masjid sekarang…', ['Sudah banyak berubah dari awal', 'Sama persis dengan aslinya', 'Belum pernah dibangun'], 0, 'Telah mengalami perubahan.'),
    ],
  },
  simalungun: {
    id: 'simalungun', name: 'Rumah Bolon Pematang Purba', category: 'Arsitektur adat', evidence: 'cukup',
    preview: 'Rumah panggung bekas keluarga raja Purba.', place: 'Kabupaten luas di timur laut Danau Toba.', communities: 'Simalungun, bersama komunitas lain.',
    why: 'Peninggalan arsitektur kerajaan yang menjadi rujukan budaya Simalungun.', modelNote: 'Ornamen dan proporsi disederhanakan.',
    facts: {},
    spots: [
      spot('Atap', 'Struktur', [0, 4.2, 0], fact('history', 'Kompleks Rumah Bolon Pematang Purba terkait bekas keluarga raja Purba.', 'simalungunOrnament')),
      spot('Ornamen', 'Ornamen', [1.5, 1.7, 0.6], fact('interpretation', 'Ornamennya pernah dikaji secara semiotika.', 'simalungunOrnament')),
      spot('Dayok binatur', 'Kuliner adat', [0, 1.3, 2.7], fact('tradition', 'Ayam yang ditata teratur disajikan bersama nasihat pada acara adat Simalungun.', 'simalungunAdat')),
    ],
    quiz: [
      q('Rumah Bolon ini berada di…', ['Pematang Purba', 'Tanjung Pura', 'Portibi'], 0, 'Pematang Purba.'),
      q('Hidangan adat Simalungun yang ditata teratur adalah…', ['Dayok binatur', 'Lemang', 'Pelleng'], 0, 'Dayok binatur.'),
    ],
  },
  'tapanuli-selatan': {
    id: 'tapanuli-selatan', name: 'Tenun Sipirok (Abit Godang)', category: 'Kerajinan', evidence: 'cukup',
    preview: 'Kain adat tenunan tangan dari Sipirok.', place: 'Kabupaten di Tapanuli bagian selatan.', communities: 'Angkola, bersama komunitas lain.',
    why: 'Kerajinan tenun yang jelas terkait dengan Sipirok.', modelNote: 'Alat tenun dan garis kain adalah gambaran, bukan motif abit godang asli.',
    facts: {
      arts: [fact('tradition', 'Tenun Sipirok menghasilkan antara lain abit godang dan parompa sadun dengan alat tenun bukan mesin.', 'sipirokTenun')],
      traditions: [fact('tradition', 'Abit godang dan parompa sadun dipakai dalam upacara adat; motifnya membawa makna.', 'sipirokTenun')],
    },
    spots: [
      spot('Alat tenun', 'Teknik', [0, 2.7, -1], fact('contemporary', 'Penenunan memakai alat bukan mesin.', 'sipirokTenun')),
      spot('Kain adat', 'Material', [0, 1.4, 0.6], fact('tradition', 'Abit godang termasuk kain adat utama.', 'sipirokTenun')),
      spot('Parompa sadun', 'Makna', [2.15, 1.3, 0.7], fact('tradition', 'Parompa sadun adalah kain adat bermotif dengan makna tersendiri.', 'sipirokTenun')),
    ],
    quiz: [
      q('Kain adat yang dihasilkan tenun Sipirok antara lain…', ['Abit godang', 'Uis nipes', 'Songket Palembang'], 0, 'Abit godang.'),
      q('Alat tenun yang dipakai tergolong…', ['Bukan mesin', 'Robot pabrik', 'Cetak digital'], 0, 'Alat tenun bukan mesin.'),
    ],
  },
  'tapanuli-tengah': {
    id: 'tapanuli-tengah', name: 'Kompleks Makam Mahligai, Barus', category: 'Situs arkeologi', evidence: 'cukup',
    preview: 'Makam tua di perbukitan Barus.', place: 'Kabupaten di pesisir barat; Barus adalah kota pelabuhan tua.', communities: MIXED,
    why: 'Situs bersejarah penting di Barus. Ditampilkan dengan hormat sebagai kompleks makam.', modelNote: 'Nisan disederhanakan tanpa tulisan; letaknya direka.',
    facts: {
      history: [
        fact('history', 'Kompleks di perbukitan Barus ini memuat makam kuno bernisan dengan inskripsi Islam yang dikaji peneliti.', 'mahligai'),
        fact('interpretation', 'Barus kerap disebut titik awal Islam di Nusantara. Klaim ini penafsiran yang belum disepakati semua sejarawan, begitu pula pembacaan sebagian angka tahun pada nisan.', 'mahligai'),
      ],
    },
    spots: [
      spot('Nisan', 'Peninggalan', [0, 2.7, -1.2], fact('history', 'Inskripsi pada nisan menjadi bahan kajian sejarah.', 'mahligai')),
      spot('Perbukitan', 'Lanskap', [-1.8, 1.3, 0.8], fact('contemporary', 'Makam berada di atas bukit di Barus Utara.', 'mahligai')),
      spot('Sikap berkunjung', 'Etika', [0, 0.8, 3], fact('contemporary', 'Ini tempat pemakaman yang diziarahi, sehingga perlu dikunjungi dengan hormat.')),
    ],
    quiz: [
      q('Makam Mahligai berada di kawasan…', ['Barus', 'Balige', 'Bakkara'], 0, 'Di Barus.'),
      q('Sebutan Barus sebagai titik awal Islam di Nusantara adalah…', ['Penafsiran yang masih dikaji', 'Fakta yang disepakati semua ahli', 'Isi sebuah resep'], 0, 'Belum disepakati semua sejarawan.'),
    ],
  },
  'tapanuli-utara': {
    id: 'tapanuli-utara', name: 'Salib Kasih, Tarutung', category: 'Bangunan bersejarah', evidence: 'terbatas',
    preview: 'Ikon kota Tarutung di perbukitan.', place: 'Kabupaten dataran tinggi di selatan Danau Toba, beribu kota Tarutung.', communities: 'Batak Toba menjadi bagian besar sejarah wilayah ini; warganya tidak seragam.',
    why: 'Salib Kasih disebut sebagai ikon Tarutung dan terkait sejarah penginjilan di wilayah ini.', modelNote: 'Bukit, hutan, dan monumen disederhanakan.',
    facts: {
      history: [fact('history', 'Misionaris Jerman I. L. Nommensen berperan besar dalam sejarah penyebaran Kristen di kawasan ini.', 'tarutungWiki')],
      traditions: [fact('contemporary', 'Tarutung dijuluki Kota Rohani, dan Salib Kasih menjadi ikonnya serta tujuan wisata rohani.', 'salibKasih', 'tarutungWiki')],
    },
    spots: [
      spot('Salib', 'Monumen', [0, 4.8, -0.3], fact('contemporary', 'Monumen salib berukuran besar menjadi penanda Tarutung.', 'salibKasih')),
      spot('Bukit', 'Lanskap', [1.6, 1.5, 0.4], fact('contemporary', 'Tarutung dikelilingi perbukitan Bukit Barisan.', 'tarutungWiki')),
      spot('Nommensen', 'Sejarah', [0, 1, 2.6], fact('history', 'Monumen ini terhubung dengan ingatan akan karya Nommensen.', 'tarutungWiki')),
    ],
    quiz: [
      q('Salib Kasih adalah ikon kota…', ['Tarutung', 'Kisaran', 'Kabanjahe'], 0, 'Tarutung.'),
      q('Tokoh yang lekat dengan sejarah ini adalah…', ['Nommensen', 'Sultan Abdul Aziz', 'Datuk Matyoeda'], 0, 'I. L. Nommensen.'),
    ],
  },
  toba: {
    id: 'toba', name: 'Onan Balerong, Pasar Balige', category: 'Bangunan bersejarah', evidence: 'cukup',
    preview: 'Los pasar berornamen khas di Balige.', place: 'Kabupaten di tepi selatan Danau Toba, beribu kota Balige.', communities: 'Batak Toba.',
    why: 'Landmark Balige yang memadukan fungsi pasar dan ornamen Batak.', modelNote: 'Tiga los dari enam bangunan asli; ornamen disederhanakan.',
    facts: {
      history: [fact('history', 'Situs pariwisata Kabupaten Toba menyebut Balerong dibangun pada masa kolonial, tahun 1928, terdiri atas enam bangunan berangka baja.', 'balerong')],
      architecture: [fact('history', 'Bangunannya dihiasi ukiran bermotif Batak (gorga).', 'balerong')],
      traditions: [fact('contemporary', 'Balerong tetap menjadi pasar tradisional dan penanda budaya Balige. Status cagar budayanya belum kami pastikan.', 'balerong')],
    },
    spots: [
      spot('Atap', 'Struktur', [1.1, 2.9, 0], fact('history', 'Deretan atap los menjadi ciri pasar ini.', 'balerong')),
      spot('Ornamen', 'Ornamen', [-1.9, 1.8, 1.6], fact('history', 'Ornamen bermotif Batak menghiasi bangunan. Pola pada model hanya pengganti.', 'balerong')),
      spot('Pasar', 'Fungsi', [-0.2, 1.4, 2.4], fact('contemporary', 'Los-los ini dipakai berdagang.', 'balerong')),
    ],
    quiz: [
      q('Onan Balerong adalah…', ['Pasar tradisional di Balige', 'Candi di Portibi', 'Istana di Medan'], 0, 'Pasar di Balige.'),
      q('Ornamen pada bangunannya bermotif…', ['Batak (gorga)', 'Batik pesisir Jawa', 'Mozaik Romawi'], 0, 'Motif Batak.'),
    ],
  },
};

export const landmarkById = (id: string | null) => (id ? LANDMARKS[id] : undefined);
