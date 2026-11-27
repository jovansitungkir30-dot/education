import type { PhotoId } from './photos';
import type { SourceId } from './sources';
import type { Knowledge } from './types';

export interface Lesson {
  title: string;
  body: string;
  photo: PhotoId;
}

export type Activity =
  | { type: 'reveal'; title: string; cards: { front: string; back: string }[] }
  | { type: 'match'; title: string; pairs: { left: string; right: string }[] }
  | { type: 'classify'; title: string; items: { text: string; answer: Knowledge }[] };

export interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Module {
  id: string;
  title: string;
  badge: string;
  /** Number of passed modules needed to open this one. */
  requires: number;
  objectives: string[];
  lessons: Lesson[];
  activity: Activity;
  quiz: Question[];
  sources: SourceId[];
}

/** Rotates the options by a stable amount so the correct answer does not cluster in one position. */
const q = (text: string, options: string[], answer: number, why: string): Question => {
  const shift = text.length % options.length;
  return {
    q: text,
    options: options.map((_, i) => options[(i + shift) % options.length]),
    answer: (answer - shift + options.length) % options.length,
    why,
  };
};

export const MODULES: Module[] = [
  {
    id: 'intro', title: 'Pengantar Sumatera Utara', badge: 'Perintis Jalan', requires: 0,
    objectives: ['Menggambarkan Sumatera Utara sebagai daerah dengan banyak komunitas', 'Membedakan sejarah geologi dari cerita rakyat', 'Memahami arti label di situs ini'],
    lessons: [
      { title: 'Banyak komunitas', photo: 'toba-panorama', body: 'Sumatera Utara mencakup Batak Toba, Karo, Mandailing, Angkola, Pakpak, Simalungun, Nias, Melayu, dan banyak komunitas lain. Bahasa, sejarah, dan adat mereka berbeda. “Batak” adalah istilah luas yang tidak dipakai semua orang untuk menyebut dirinya dengan cara yang sama, dan Nias bukan kebudayaan Batak.' },
      { title: 'Satu danau, dua jenis penjelasan', photo: 'samosir-ferry', body: 'Geologi menjelaskan Danau Toba sebagai kaldera vulkanik. Sebuah legenda terkenal menjelaskannya lewat janji yang dilanggar. Yang satu adalah sejarah alam berbasis bukti; yang lain cerita rakyat yang membawa ingatan dan nilai budaya. Keduanya layak diperhatikan dengan label yang tepat.' },
    ],
    activity: { type: 'classify', title: 'Pernyataan jenis apa ini?', items: [
      { text: 'Danau Toba menempati kaldera vulkanik.', answer: 'history' },
      { text: 'Perempuan yang semula ikan emas kembali ke air, lalu terbentuklah danau.', answer: 'folklore' },
      { text: 'Saat ini Bawomataluo ada di Daftar Sementara UNESCO.', answer: 'contemporary' },
    ] },
    quiz: [
      q('Pernyataan mana yang akurat?', ['Sumatera Utara punya satu budaya bersama', 'Sumatera Utara dihuni banyak komunitas yang berbeda', 'Semua komunitas di sana adalah Batak'], 1, 'Provinsi ini majemuk; Nias, Melayu, dan komunitas lain bukan Batak.'),
      q('Bagaimana legenda ikan emas seharusnya disajikan?', ['Sebagai geologi', 'Sebagai cerita rakyat', 'Sebagai catatan pemerintah'], 1, 'Ini cerita tutur dengan banyak versi.'),
      q('Apa yang membentuk cekungan Danau Toba?', ['Amblesan kaldera vulkanik', 'Meteor', 'Bendungan'], 0, 'Danau ini mengisi kaldera vulkanik.'),
      q('Pengaruh letusan raksasa itu terhadap manusia purba…', ['Sudah pasti sepenuhnya', 'Masih diperdebatkan', 'Belum pernah diteliti'], 1, 'Para peneliti berbeda pendapat tentang besarnya dampak.'),
    ],
    sources: ['nasaToba', 'britannicaToba', 'legendGnfi'],
  },
  {
    id: 'batak', title: 'Menjelajahi Keragaman Budaya Batak', badge: 'Banyak Suara', requires: 0,
    objectives: ['Menyebutkan beberapa komunitas yang sering disebut Batak', 'Tidak menerapkan istilah satu komunitas kepada semuanya', 'Menghubungkan tiap komunitas dengan wilayahnya'],
    lessons: [
      { title: 'Label yang luas', photo: 'karo-wedding', body: 'Toba, Karo, Simalungun, Pakpak, Angkola, dan Mandailing sering dikelompokkan sebagai Batak. Bahasa, busana, arsitektur, dan upacaranya berbeda. Sebagian orang, termasuk banyak orang Karo dan Mandailing, lebih suka memakai nama khususnya.' },
      { title: 'Wilayah', photo: 'simalungun-house', body: 'Secara garis besar, dataran tinggi Karo berada di utara danau, Simalungun di timur laut, Pakpak di barat, Toba di sekitar selatan, serta Angkola dan Mandailing lebih ke selatan. Ini penyederhanaan: orang tinggal dan merantau jauh melampaui wilayah tersebut.' },
    ],
    activity: { type: 'match', title: 'Jodohkan komunitas dengan cirinya', pairs: [
      { left: 'Karo', right: 'Rumah siwaluh jabu' },
      { left: 'Mandailing', right: 'Gordang Sambilan' },
      { left: 'Simalungun', right: 'Dayok binatur' },
      { left: 'Pakpak', right: 'Silima Suak' },
    ] },
    quiz: [
      q('Silima Suak merujuk pada…', ['Lima wilayah adat Pakpak', 'Sembilan gendang', 'Tarian Nias'], 0, 'Simsim, Keppas, Pegagan, Kelasen, dan Boang.'),
      q('Komunitas mana yang ada di dataran tinggi sebelah utara Danau Toba?', ['Mandailing', 'Karo', 'Angkola'], 1, 'Dataran tinggi Karo berada di utara.'),
      q('Suatu adat tercatat di Toba. Apa yang bisa disimpulkan tentang Karo?', ['Pasti sama persis', 'Belum bisa disimpulkan tanpa bukti dari Karo', 'Pasti dilarang'], 1, 'Bukti tentang satu komunitas tidak otomatis berlaku bagi yang lain.'),
      q('Tolu Sahundulan, Lima Saodoran milik komunitas mana?', ['Simalungun', 'Nias', 'Melayu Deli'], 0, 'Itu falsafah adat Simalungun.'),
    ],
    sources: ['pakpakSuak', 'simalungunAdat', 'karoSpace', 'gordang'],
  },
  {
    id: 'ulos', title: 'Memahami Ulos', badge: 'Penjaga Benang', requires: 0,
    objectives: ['Menjelaskan ulos sebagai kain sekaligus hubungan', 'Menggambarkan mangulosi', 'Menyadari bahwa keterangan penggunaannya beragam'],
    lessons: [
      { title: 'Lebih dari kain', photo: 'ulos-weaving', body: 'Ulos adalah kain tenun yang berperan dalam kehidupan sehari-hari dan upacara. Menenunnya butuh keterampilan dan waktu, dan sampai kini masih menjadi kerajinan yang dikerjakan.' },
      { title: 'Memberikan ulos', photo: 'tortor', body: 'Dalam mangulosi, ulos disampirkan untuk mengungkapkan berkat dan kasih sayang. Kedudukan kekerabatan menentukan siapa boleh memberi kepada siapa. Ragidup, ragihotang, dan sibolang termasuk jenis yang dikenal, dan keterangan terbit tentang penggunaannya tidak sepenuhnya sepakat.' },
    ],
    activity: { type: 'reveal', title: 'Buka tiap kartu', cards: [
      { front: 'Mangulosi', back: 'Tindakan memberikan ulos sebagai berkat dan kasih sayang.' },
      { front: 'Mengapa sumber berbeda', back: 'Praktiknya beragam antarkampung, keluarga, dan upacara.' },
      { front: 'Apakah ulos masuk daftar UNESCO?', back: 'Riset kami menemukan proyek pelindungan UNESCO yang melibatkan penenun ulos, tetapi tidak menemukan pencantuman ulos dalam daftar UNESCO.' },
    ] },
    quiz: [
      q('Mangulosi berarti…', ['Menjual kain', 'Memberikan ulos sebagai ungkapan berkat', 'Mewarnai benang'], 1, 'Ini tindakan memberi yang penuh makna.'),
      q('Apa yang menentukan siapa memberi ulos kepada siapa?', ['Hubungan kekerabatan', 'Harga', 'Pilihan acak'], 0, 'Kedudukan kekerabatan menentukan.'),
      q('Saat sumber berbeda tentang suatu jenis ulos, sikap terbaik adalah…', ['Memilih satu lalu menganggapnya berlaku umum', 'Mencatat perbedaannya dan mencari petunjuk setempat', 'Mengabaikan ulos'], 1, 'Keragaman adalah bagian dari tradisi yang hidup.'),
      q('Manakah nama jenis ulos?', ['Ragidup', 'Hesek', 'Omo sebua'], 0, 'Hesek adalah alat musik dan omo sebua adalah rumah Nias.'),
    ],
    sources: ['ulosStudy', 'ulosEncyclopedia', 'unescoUlosProject'],
  },
  {
    id: 'architecture', title: 'Arsitektur Tradisional', badge: 'Pembaca Rumah', requires: 1,
    objectives: ['Membandingkan bangunan Toba, Karo, Mandailing, dan Nias', 'Membaca rumah sebagai struktur sekaligus ruang sosial', 'Menghubungkan konstruksi kayu dengan respons terhadap gempa'],
    lessons: [
      { title: 'Atap dan tiang', photo: 'gorga-house', body: 'Banyak rumah tradisional di provinsi ini berdiri di atas tiang, tetapi bentuknya berbeda-beda. Rumah Toba beratap pelana melengkung; siwaluh jabu Karo menampung beberapa rumah tangga.' },
      { title: 'Ruang sosial', photo: 'mandailing-house', body: 'Di kampung Mandailing, rumah raja, balai terbuka, dan halaman punya peran sosial yang berbeda. Di siwaluh jabu Karo, secara tradisi adat menentukan tempat tiap rumah tangga, walaupun kajian tahun 2020 di Lingga menemukan hal ini sudah tidak dijalankan.' },
      { title: 'Struktur yang bergerak', photo: 'nias-house', body: 'Penelitian di Nias setelah gempa 2004 dan 2005 menemukan bahwa rumah tradisional sebagian besar bertahan baik. Penopang, sambungan, dan tumpuan yang mampu mengakomodasi gerakan menjadi inti penjelasannya. Ketahanannya tetap bergantung pada perawatan dan kekuatan guncangan.' },
    ],
    activity: { type: 'match', title: 'Jodohkan bangunan dengan perannya', pairs: [
      { left: 'Sopo Godang', right: 'Balai terbuka untuk musyawarah' },
      { left: 'Bagas Godang', right: 'Rumah raja adat' },
      { left: 'Siwaluh jabu', right: 'Rumah bersama delapan rumah tangga' },
      { left: 'Omo sebua', right: 'Rumah besar pemimpin Nias' },
    ] },
    quiz: [
      q('“Siwaluh jabu” merujuk pada…', ['Rumah untuk delapan rumah tangga', 'Perangkat gendang', 'Kain tenun'], 0, 'Namanya berkaitan dengan delapan rumah tangga.'),
      q('Sopo Godang berkaitan dengan…', ['Musyawarah', 'Menangkap ikan', 'Hanya menenun'], 0, 'Itu balai adat untuk umum.'),
      q('Rumah mana yang sebagian besar bertahan baik saat gempa Nias 2004–2005?', ['Rumah kayu tradisional', 'Semua bangunan modern', 'Keduanya tidak diteliti'], 0, 'Penelitian mencatat ketahanan yang baik pada rumah tradisional.'),
      q('Rumah Bolon Simalungun dan rumah Toba adalah…', ['Selalu sama persis', 'Tradisi berbeda walaupun namanya sama', 'Sama-sama dari Nias'], 1, 'Nama yang sama tidak berarti bangunannya sama.'),
    ],
    sources: ['tobaHouseForm', 'karoSpace', 'mandailingBuildings', 'niasQuake'],
  },
  {
    id: 'music', title: 'Musik dan Tari', badge: 'Penyimak Irama', requires: 1,
    objectives: ['Mengenali bagian gondang sabangunan', 'Membedakannya dari Gordang Sambilan', 'Memahami kaitan tari, musik, dan upacara'],
    lessons: [
      { title: 'Gondang sabangunan', photo: 'gondang', body: 'Ansambel Toba memadukan taganing, gordang, ogung, sarune bolon, dan hesek. Taganing dapat membawakan melodi sekaligus irama, sementara gong saling mengisi dalam siklus berulang.' },
      { title: 'Sembilan gendang', photo: 'gordang-sambilan', body: 'Gordang Sambilan berasal dari Mandailing: sembilan gendang bertingkat yang dimainkan berkelompok pada acara yang diatur adat.' },
      { title: 'Tari dalam konteksnya', photo: 'tortor', body: 'Sejumlah kajian menggambarkan gondang dan tortor berkaitan erat dalam upacara Toba. Geraknya berkomunikasi di dalam hubungan kekerabatan, bukan hanya sebagai pertunjukan.' },
    ],
    activity: { type: 'match', title: 'Jodohkan bunyi dengan perannya', pairs: [
      { left: 'Taganing', right: 'Perangkat gendang bernada' },
      { left: 'Ogung', right: 'Gong gantung' },
      { left: 'Sarune bolon', right: 'Alat tiup berlidah' },
      { left: 'Hesek', right: 'Menjaga ketukan tetap' },
    ] },
    quiz: [
      q('Gordang Sambilan terutama terkait dengan…', ['Mandailing', 'Nias', 'Melayu Deli'], 0, 'Itu ansambel Mandailing.'),
      q('Sarune bolon adalah…', ['Gong', 'Alat tiup berlidah', 'Tarian'], 1, 'Alat musik tiup yang memakai lidah getar.'),
      q('Dalam upacara Toba, tortor…', ['Berkaitan erat dengan gondang', 'Tidak pernah diiringi musik', 'Adalah sejenis kain'], 0, 'Di sana musik dan gerak menyatu.'),
      q('Maena dikaji dalam konteks apa?', ['Upacara pernikahan Nias', 'Pembangunan rumah Karo', 'Perdagangan di Medan'], 0, 'Maena dikaji dalam upacara pernikahan Falöwa.'),
    ],
    sources: ['gondangRitual', 'taganing', 'gordang', 'niasMaena'],
  },
  {
    id: 'nias', title: 'Warisan Budaya Nias', badge: 'Saksi Pulau', requires: 2,
    objectives: ['Mengenali Nias sebagai kebudayaan tersendiri', 'Menyebut status warisan Bawomataluo dengan tepat', 'Membahas hombo batu dalam konteks sejarah'],
    lessons: [
      { title: 'Dunianya sendiri', photo: 'nias-house', body: 'Ono Niha memiliki bahasa dan warisan sendiri, dengan perbedaan antardaerah di pulau itu. Bawomataluo di selatan memadukan rumah dan karya batu monumental dalam permukiman yang dirancang.' },
      { title: 'Dulu dan kini', photo: 'nias-hombo', body: 'Sejumlah keterangan mengaitkan hombo batu dengan latihan untuk pertikaian di masa lalu. Kini tradisi itu diperagakan sebagai simbol budaya. Jangan menyajikan citra perang masa lampau sebagai gambaran masyarakat masa kini.' },
    ],
    activity: { type: 'classify', title: 'Beri label tiap pernyataan', items: [
      { text: 'Rumah tradisional bertahan baik saat gempa 2004–2005.', answer: 'history' },
      { text: 'Maena dibawakan bersama-sama dalam adat pernikahan.', answer: 'tradition' },
      { text: 'Warisan Nias Selatan menjadi sasaran upaya pelestarian saat ini.', answer: 'contemporary' },
    ] },
    quiz: [
      q('Menurut sumber yang dipakai di sini, status UNESCO Bawomataluo adalah…', ['Sudah ditetapkan sebagai Situs Warisan Dunia', 'Ada di Daftar Sementara', 'Dicoret dari semua daftar'], 1, 'Masuk Daftar Sementara belum berarti ditetapkan.'),
      q('Kini hombo batu terutama merupakan…', ['Persiapan perang masa kini', 'Peragaan dan simbol budaya', 'Cara memasak'], 1, 'Tujuannya sudah berubah.'),
      q('Apakah Nias termasuk kebudayaan Batak?', ['Ya', 'Tidak'], 1, 'Nias punya bahasa dan warisan sendiri.'),
      q('Omo sebua adalah…', ['Rumah besar para pemimpin', 'Lagu perang', 'Kain tenun'], 0, 'Itu rumah yang monumental.'),
    ],
    sources: ['unescoBawomataluo', 'hombo', 'omoSebua', 'niasQuake'],
  },
  {
    id: 'culinary', title: 'Warisan Kuliner Tradisional', badge: 'Penjelajah Rempah', requires: 2,
    objectives: ['Mengenal andaliman dan arsik', 'Memperhatikan perbedaan resep antarkomunitas', 'Memahami makanan sebagai bahasa upacara'],
    lessons: [
      { title: 'Andaliman dan arsik', photo: 'arsik', body: 'Andaliman memberi aroma mirip jeruk dan sensasi getir menggigit. Arsik adalah masakan ikan berbumbu, sering memakai ikan mas. Keterangan yang terbit mencatat versi Karo memakai kecombrang, berbeda dari versi lain yang menonjolkan andaliman.' },
      { title: 'Makanan yang bertutur', photo: 'simalungun-house', body: 'Dalam adat Simalungun, dayok binatur adalah ayam yang ditata teratur dan disajikan bersama nasihat. Tatanan dan tuturannya tidak terpisahkan. Kebiasaan makan juga berbeda menurut agama dan keluarga: misalnya, banyak Muslim Mandailing dan Angkola menjalankan aturan halal.' },
    ],
    activity: { type: 'reveal', title: 'Kenali kosakata rasa', cards: [
      { front: 'Andaliman', back: 'Rempah sekeluarga jeruk dengan sensasi menggigit di lidah.' },
      { front: 'Arsik', back: 'Ikan berbumbu yang dimasak sampai bumbunya meresap.' },
      { front: 'Dayok binatur', back: 'Hidangan ayam adat Simalungun yang ditata teratur.' },
    ] },
    quiz: [
      q('Andaliman adalah…', ['Rempah', 'Rumah', 'Gendang'], 0, 'Itu rempah yang khas.'),
      q('Dayok binatur termasuk adat mana?', ['Simalungun', 'Nias', 'Karo'], 0, 'Itu hidangan Simalungun.'),
      q('Apakah semua komunitas memasak arsik dengan cara yang sama?', ['Ya', 'Tidak'], 1, 'Versi yang digambarkan berbeda-beda.'),
    ],
    sources: ['andaliman', 'arsik', 'simalungunAdat'],
  },
  {
    id: 'wisdom', title: 'Kearifan Lokal dan Falsafah Budaya', badge: 'Pemikir Kekerabatan', requires: 3,
    objectives: ['Menggambarkan Dalihan Na Tolu sebagai sistem hubungan', 'Membandingkannya dengan falsafah Simalungun', 'Membedakan praktik dari penafsiran'],
    lessons: [
      { title: 'Hubungan di atas pangkat', photo: 'angkola-tortor', body: 'Dalihan Na Tolu mengatur tiga kedudukan kekerabatan yang saling bergantung. Seseorang menempati kedudukan berbeda dalam hubungan yang berbeda, sehingga kehormatan dan pelayanan bergiliran.' },
      { title: 'Lebih dari satu falsafah', photo: 'simalungun-house', body: 'Simalungun mengenal Tolu Sahundulan, Lima Saodoran. Kepedulian yang mirip tentang kerja sama bisa punya nama, kategori, dan aturan berbeda. Penjelasan tungku tiga batu untuk Dalihan Na Tolu adalah gambaran penafsiran yang membantu.' },
    ],
    activity: { type: 'classify', title: 'Praktik atau penafsiran?', items: [
      { text: 'Kedudukan kekerabatan menentukan peran dalam upacara.', answer: 'tradition' },
      { text: 'Tiga batu tungku melambangkan keseimbangan antarkedudukan.', answer: 'interpretation' },
    ] },
    quiz: [
      q('Kedudukan kekerabatan dalam Dalihan Na Tolu bersifat…', ['Kelas sosial yang tetap', 'Tergantung hubungan dan acaranya', 'Ditentukan oleh kekayaan'], 1, 'Orang berpindah antarkedudukan.'),
      q('Falsafah Simalungun yang sepadan disebut…', ['Tolu Sahundulan, Lima Saodoran', 'Silima Suak', 'Hombo Batu'], 0, 'Silima Suak milik Pakpak.'),
      q('Gambaran tiga batu tungku sebaiknya dipahami sebagai…', ['Penjelasan berupa penafsiran', 'Fakta geologi', 'Resep masakan'], 0, 'Itu cara menjelaskan makna.'),
    ],
    sources: ['dalihanCore', 'simalungunAdat'],
  },
];
