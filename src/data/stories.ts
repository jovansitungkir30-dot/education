import { fact, type Fact, type Knowledge } from './types';
import type { PhotoId } from './photos';

export interface Chapter {
  title: string;
  fact: Fact;
  photo: PhotoId;
}

export interface Story {
  id: string;
  title: string;
  kicker: string;
  /** The dominant kind of knowledge in the story. Each chapter also carries its own label. */
  kind: Knowledge;
  intro: string;
  chapters: Chapter[];
}

export const STORIES: Story[] = [
  {
    id: 'legend', title: 'Legenda Danau Toba', kicker: 'Cerita tutur', kind: 'folklore',
    intro: 'Penceritaan ulang dengan kata-kata kami sendiri atas legenda yang dikenal luas. Para penutur berbeda dalam hal nama, tempat, dan rincian.',
    chapters: [
      { title: 'Tangkapan berwarna emas', photo: 'toba-panorama', fact: fact('folklore', 'Seorang petani bernama Toba, yang hidup sendiri, menarik seekor ikan emas yang tidak biasa dari air. Ikan itu berubah menjadi seorang perempuan.', 'legendGnfi') },
      { title: 'Sebuah janji', photo: 'samosir-ferry', fact: fact('folklore', 'Perempuan itu bersedia hidup bersamanya dengan satu syarat: asal-usulnya tidak boleh disebut. Mereka dikaruniai seorang anak laki-laki, Samosir.', 'legendGnfi', 'legendDetik') },
      { title: 'Kata yang tak bisa ditarik', photo: 'ulos-weaving', fact: fact('folklore', 'Suatu hari, karena marah kepada anaknya, Toba menyebut asal-usul ibunya. Janji itu pun terlanggar.', 'legendGnfi') },
      { title: 'Air dan pulau', photo: 'toba-panorama', fact: fact('folklore', 'Sang anak naik ke tempat tinggi. Ibunya kembali ke air, daratan terendam menjadi danau, dan tempat tinggi itu tersisa sebagai pulau.', 'legendGnfi', 'legendDetik') },
    ],
  },
  {
    id: 'earth', title: 'Apa yang direkam bebatuan', kicker: 'Geologi', kind: 'history',
    intro: 'Penjelasan ilmiah tentang bentang alam yang sama, dipisahkan dari legendanya.',
    chapters: [
      { title: 'Sebuah kaldera', photo: 'samosir-ferry', fact: fact('history', 'Danau Toba mengisi kaldera besar, yaitu cekungan yang terbentuk akibat amblesan saat letusan gunung api dahsyat.', 'nasaToba') },
      { title: 'Letusan raksasa terakhir', photo: 'toba-panorama', fact: fact('history', 'Letusan raksasa terakhir umumnya diperkirakan terjadi sekitar 74.000 tahun lalu. Perkiraan yang terbit berbeda beberapa ribu tahun.', 'britannicaToba') },
      { title: 'Pertanyaan terbuka', photo: 'toba-panorama', fact: fact('interpretation', 'Klaim bahwa letusan itu menyebabkan populasi manusia nyaris punah masih diperdebatkan.', 'britannicaToba') },
    ],
  },
  {
    id: 'kinship', title: 'Tiga kedudukan, satu upacara', kicker: 'Nilai bersama', kind: 'tradition',
    intro: 'Sistem kekerabatan mengatur siapa yang memberi, siapa yang melayani, dan siapa yang menasihati. Tiap komunitas menamai dan menjalankannya dengan cara sendiri.',
    chapters: [
      { title: 'Dalihan Na Tolu', photo: 'angkola-tortor', fact: fact('tradition', 'Di lingkungan Toba, Angkola, dan Mandailing, Dalihan Na Tolu menyebut tiga kedudukan kekerabatan yang saling bergantung. Istilahnya berbeda antarkomunitas.', 'dalihanCore') },
      { title: 'Gambaran tungku', photo: 'tortor', fact: fact('interpretation', 'Ungkapan ini sering dijelaskan lewat tungku dari tiga batu: periuk baru kokoh bila ketiganya menopang.', 'dalihanCore') },
      { title: 'Falsafah Simalungun', photo: 'simalungun-house', fact: fact('tradition', 'Adat Simalungun mengenal Tolu Sahundulan: tondong untuk nasihat, sanina untuk musyawarah, dan boru untuk tenaga. Ini falsafah milik Simalungun sendiri.', 'simalungunAdat') },
      { title: 'Peran berpindah', photo: 'tortor', fact: fact('tradition', 'Sebuah kedudukan menggambarkan hubungan, bukan pangkat tetap. Seseorang bisa melayani di satu upacara dan dimuliakan di upacara lain.', 'dalihanCore') },
    ],
  },
  {
    id: 'ulos', title: 'Kain yang membawa hubungan', kicker: 'Kain tenun', kind: 'tradition',
    intro: 'Mengapa ulos bermakna lebih daripada benangnya.',
    chapters: [
      { title: 'Di alat tenun', photo: 'ulos-weaving', fact: fact('contemporary', 'Menenun ulos masih menjadi kerajinan yang dikerjakan di kawasan Toba.', 'unescoUlosProject') },
      { title: 'Mangulosi', photo: 'tortor', fact: fact('tradition', 'Menyampirkan ulos kepada seseorang menyampaikan berkat dan kasih sayang. Siapa boleh memberi kain apa kepada siapa mengikuti hubungan kekerabatan.', 'ulosStudy', 'ulosEncyclopedia') },
      { title: 'Beragam kain', photo: 'ulos-museum', fact: fact('tradition', 'Ragidup, ragihotang, dan sibolang termasuk jenis yang dikenal. Keterangan tentang penggunaannya berbeda menurut tempat dan upacara.', 'ulosStudy') },
    ],
  },
  {
    id: 'sound', title: 'Gendang yang mengumpulkan orang', kicker: 'Musik dan upacara', kind: 'tradition',
    intro: 'Dua tradisi gendang yang sering tertukar padahal berbeda.',
    chapters: [
      { title: 'Gondang sabangunan', photo: 'gondang', fact: fact('tradition', 'Ansambel Toba memadukan gendang bernada taganing, gendang besar gordang, gong yang disebut ogung, alat tiup berlidah sarune bolon, dan penjaga tempo hesek. Jumlah pastinya berbeda-beda.', 'gondangRitual', 'taganing') },
      { title: 'Musik dan gerak', photo: 'tortor', fact: fact('tradition', 'Dalam suasana adat, gondang dan tortor terikat erat.', 'gondangRitual') },
      { title: 'Gordang Sambilan', photo: 'gordang-sambilan', fact: fact('tradition', 'Gordang Sambilan Mandailing adalah tradisi tersendiri yang bertumpu pada sembilan gendang bertingkat.', 'gordang') },
    ],
  },
  {
    id: 'nias', title: 'Batu dan kayu di Nias', kicker: 'Warisan Nias', kind: 'history',
    intro: 'Warisan pulau dengan bahasa dan sejarahnya sendiri.',
    chapters: [
      { title: 'Permukiman yang dirancang', photo: 'nias-house', fact: fact('history', 'Di Bawomataluo, karya batu monumental dan rumah-rumah membentuk satu permukiman yang dirancang.', 'unescoBawomataluo') },
      { title: 'Dibangun untuk bergerak', photo: 'nias-house', fact: fact('history', 'Rumah kayu tradisional sebagian besar bertahan baik saat gempa 2004 dan 2005, walaupun ada yang rusak.', 'niasQuake') },
      { title: 'Lompatan', photo: 'nias-hombo', fact: fact('history', 'Sejumlah keterangan mengaitkan lompat batu dengan latihan perang di masa lalu, dan kini menjadi simbol serta peragaan budaya.', 'hombo') },
      { title: 'Seni yang hidup', photo: 'nias-dance', fact: fact('contemporary', 'Tarian, maena, dan seni pertunjukan lain menjadi sasaran upaya pelestarian saat ini di Nias Selatan.', 'niasMinistry') },
    ],
  },
];
