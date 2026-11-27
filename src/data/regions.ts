import { fact, type Fact } from './types';
import type { PhotoId } from './photos';

export type TopicKey = 'identity' | 'history' | 'architecture' | 'clothing' | 'traditions' | 'crafts' | 'food' | 'stories';

export const TOPICS: Record<TopicKey, string> = {
  identity: 'Identitas budaya',
  history: 'Latar sejarah',
  architecture: 'Arsitektur',
  clothing: 'Busana dan kain',
  traditions: 'Tradisi setempat',
  crafts: 'Seni dan kerajinan',
  food: 'Kuliner',
  stories: 'Cerita budaya',
};

export interface Region {
  id: string;
  name: string;
  category: 'Bentang alam' | 'Komunitas budaya' | 'Kota' | 'Kabupaten';
  /** Representative reference point, not a cultural boundary. */
  coords: [number, number];
  anchor: string;
  summary: string;
  /** A missing topic is a deliberate research gap. */
  topics: Partial<Record<TopicKey, Fact[]>>;
  photos: PhotoId[];
  modules: string[];
}

export const REGIONS: Region[] = [
  {
    id: 'lake-toba', name: 'Danau Toba', category: 'Bentang alam', coords: [2.68, 98.86], anchor: 'Cekungan danau bagian tengah',
    summary: 'Danau kaldera vulkanik yang sangat luas di dataran tinggi, dikelilingi beberapa komunitas budaya.',
    topics: {
      identity: [fact('history', 'Danau Toba adalah bentang alam, bukan satu kebudayaan. Komunitas dengan identitas masing-masing tinggal di sekelilingnya dan di dataran tinggi sekitarnya.')],
      history: [
        fact('history', 'Danau ini menempati kaldera yang terbentuk oleh letusan-letusan sangat besar. Letusan raksasa terakhir umumnya diperkirakan terjadi sekitar 74.000 tahun lalu; perkiraan yang terbit berbeda beberapa ribu tahun.', 'britannicaToba', 'nasaToba'),
        fact('interpretation', 'Seberapa kuat pengaruh letusan itu terhadap iklim dunia dan populasi manusia purba masih diperdebatkan para peneliti.', 'britannicaToba'),
      ],
      stories: [fact('folklore', 'Sebuah legenda yang dikenal luas menjelaskan asal danau lewat seorang laki-laki bernama Toba, seorang perempuan yang semula ikan mas, janji yang dilanggar, dan anak mereka, Samosir. Versinya banyak. Ini cerita rakyat, bukan penjelasan geologi.', 'legendGnfi', 'legendDetik')],
      traditions: [fact('contemporary', 'UNESCO pernah mendukung proyek pemulihan bagi penenun ulos dan pengukir gorga di kawasan Toba setelah pandemi COVID-19. Proyek pelindungan tidak sama dengan pencantuman dalam daftar warisan.', 'unescoUlosProject')],
    },
    photos: ['toba-panorama', 'samosir-ferry'], modules: ['intro'],
  },
  {
    id: 'samosir', name: 'Pulau Samosir', category: 'Bentang alam', coords: [2.58, 98.84], anchor: 'Pedalaman pulau; Tomok, Ambarita, dan Simanindo berada di tepi danau',
    summary: 'Pulau di tengah Danau Toba dan tempat penting untuk mengenal warisan kampung Batak Toba.',
    topics: {
      identity: [fact('tradition', 'Samosir erat kaitannya dengan komunitas, kampung, dan sejarah keluarga Batak Toba.')],
      architecture: [fact('history', 'Rumah Batak Toba berdiri di atas tiang dan beratap lengkung menyerupai pelana, dengan ujung atap yang menjorok.', 'batakArchitecture', 'tobaHouseForm')],
      crafts: [
        fact('contemporary', 'Gorga, seni ukir hias Batak Toba, termasuk dalam proyek pemulihan UNESCO bagi para pelaku kerajinan setempat.', 'unescoUlosProject'),
        fact('tradition', 'Gorga dikenal luas dengan penggunaan warna merah, putih, dan hitam.'),
      ],
      stories: [fact('folklore', 'Dalam sejumlah versi legenda Danau Toba, Samosir sang anak naik ke tempat tinggi ketika air meluap, sehingga namanya terhubung dengan pulau ini.', 'legendGnfi')],
      food: [fact('tradition', 'Arsik, masakan ikan berbumbu yang sering memakai ikan mas, sangat lekat dengan masakan Batak di kawasan Toba.', 'arsik')],
    },
    photos: ['samosir-ferry', 'gorga-house'], modules: ['batak', 'architecture'],
  },
  {
    id: 'toba', name: 'Toba (Batak Toba)', category: 'Komunitas budaya', coords: [2.333, 99.063], anchor: 'Balige, Kabupaten Toba',
    summary: 'Komunitas Batak Toba, dengan kampung halaman di sekitar selatan danau dan perantauan yang luas.',
    topics: {
      identity: [fact('tradition', 'Batak Toba adalah satu komunitas tersendiri di antara komunitas yang sering disebut dengan istilah luas “Batak”. Bahasa, sebutan kekerabatan, dan bentuk upacaranya tidak boleh dianggap otomatis berlaku bagi yang lain. Wilayah budaya Toba lebih luas daripada Kabupaten Toba saat ini.')],
      architecture: [fact('history', 'Rumah adat Toba adalah rumah panggung kayu dengan atap pelana melengkung. Sejumlah kajian meneliti bagaimana bentuk dan bagian dalamnya membawa makna budaya.', 'tobaHouseForm', 'batakArchitecture')],
      clothing: [
        fact('tradition', 'Ulos adalah kain tenun yang dipakai dalam kehidupan sehari-hari dan upacara. Dalam mangulosi, kain diberikan sebagai ungkapan berkat dan kasih sayang, mengikuti hubungan kekerabatan.', 'ulosEncyclopedia', 'ulosStudy'),
        fact('tradition', 'Jenis yang dikenal antara lain ragidup, ragihotang, dan sibolang. Tulisan yang terbit berbeda pendapat tentang siapa yang memberi atau memakai tiap jenis, sehingga petunjuk adat setempat penting.', 'ulosStudy'),
      ],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu menggambarkan tiga kedudukan kekerabatan yang saling bergantung dan mengatur peran dalam upacara. Orang yang sama dapat menempati kedudukan berbeda pada acara yang berbeda.', 'dalihanCore'),
        fact('tradition', 'Tari tortor dan musik gondang berkaitan erat dalam suasana upacara, termasuk upacara seputar kematian.', 'gondangRitual'),
      ],
      crafts: [fact('contemporary', 'Menenun ulos dan mengukir gorga masih menjadi kerajinan yang hidup sekaligus sumber penghidupan.', 'unescoUlosProject')],
      food: [fact('tradition', 'Andaliman, rempah sekeluarga jeruk yang memberi rasa getir menggigit di lidah, adalah bumbu khas banyak masakan Toba, termasuk arsik.', 'andaliman', 'arsik')],
    },
    photos: ['tortor', 'ulos-weaving', 'gondang', 'arsik'], modules: ['batak', 'ulos', 'music', 'culinary'],
  },
  {
    id: 'karo', name: 'Karo', category: 'Komunitas budaya', coords: [3.1, 98.49], anchor: 'Kabanjahe, dataran tinggi Karo',
    summary: 'Komunitas dataran tinggi di utara danau dengan bahasa, arsitektur, dan adat sendiri.',
    topics: {
      identity: [fact('tradition', 'Orang Karo memiliki bahasa dan sistem adat sendiri. Banyak yang menyebut identitasnya secara khusus sebagai Karo, dan pandangan tentang label “Batak” yang lebih luas berbeda-beda.')],
      architecture: [
        fact('history', 'Siwaluh jabu adalah rumah panggung dengan tinggi mencapai sekitar 12 meter dan dinding yang miring ke luar. Namanya merujuk pada delapan rumah tangga di bawah satu atap. Sebuah kajian mendokumentasikan contohnya di Desa Lingga.', 'karoSpace'),
        fact('tradition', 'Secara tradisi, antarruang tidak dibatasi dinding. Adatlah yang menandai batasnya dan menentukan kerabat mana yang menempati tiap dari delapan tempat itu, beserta tanggung jawabnya.', 'karoSpace'),
        fact('contemporary', 'Kajian tahun 2020 di Lingga menemukan adanya sekat tambahan, rumah yang tidak lagi dihuni delapan keluarga, dan penempatan berdasarkan peran yang sudah tidak dijalankan. Kajian itu juga melaporkan perawatan yang menurun.', 'karoSpace'),
      ],
      clothing: [
        fact('tradition', 'Uis nipes adalah kain tenun tipis yang dipakai perempuan Karo pada acara adat. Yang bercorak terang dipakai di pernikahan, yang hitam saat berduka.', 'uisKaro'),
        fact('tradition', 'Beka buluh adalah kain berdasar merah yang lebih besar dan lebih berat. Di pernikahan, kain ini dipakai sebagai penutup kepala oleh pengantin laki-laki dan ayah kedua mempelai, atau dilipat dan disampirkan di bahu.', 'uisKaro'),
        fact('contemporary', 'Sebuah kajian di Barusjahe menggambarkan orang tua mewariskan kain-kain ini dengan mengajak anak ke acara adat, sementara banyak anak muda lebih memilih busana modern.', 'uisKaro'),
      ],
      food: [fact('contemporary', 'Arsik versi Karo disebut memakai bunga dan buah kecombrang, sementara versi lain mengandalkan andaliman.', 'arsik')],
    },
    photos: ['karo-house', 'karo-wedding'], modules: ['batak', 'architecture', 'culinary'],
  },
  {
    id: 'mandailing', name: 'Mandailing', category: 'Komunitas budaya', coords: [0.86, 99.55], anchor: 'Panyabungan, Mandailing Natal',
    summary: 'Komunitas di bagian selatan yang dikenal dengan ansambel gendang Gordang Sambilan dan arsitektur kampung adatnya.',
    topics: {
      identity: [fact('tradition', 'Mandailing adalah komunitas tersendiri di bagian selatan. Islam menjadi bagian penting kehidupan sebagian besar orang Mandailing saat ini, dan banyak yang menyebut diri sebagai Mandailing, bukan dengan label yang lebih luas.', 'dalihanCore')],
      architecture: [
        fact('history', 'Bagas Godang adalah rumah panggung kediaman raja adat. Bangunan ini juga pernah menjadi tempat upacara adat dan tempat berlindung warga.', 'mandailingBuildings'),
        fact('history', 'Sopo Godang adalah balai terbuka tanpa dinding di seberang halaman luas. Balai ini dipakai untuk musyawarah, peradilan adat, pertunjukan, dan belajar.', 'mandailingBuildings'),
      ],
      clothing: [fact('tradition', 'Penutup kepala hampu dan bulang mulanya bagian dari busana raja dan permaisuri. Kini keduanya dipakai pengantin dalam pernikahan adat.', 'mandailingBuildings')],
      traditions: [
        fact('tradition', 'Dalihan Na Tolu mengelompokkan kerabat menjadi suhut beserta kahanggi, anak boru, dan mora. Masing-masing punya peran berbeda dalam upacara dan pengambilan keputusan.', 'mandailingBuildings'),
        fact('tradition', 'Gordang Sambilan adalah ansambel sembilan gendang dengan ukuran bertingkat yang dimainkan pada upacara penting. Penggunaannya diatur adat.', 'gordang'),
      ],
      crafts: [fact('interpretation', 'Ornamen segitiga bernama bindu di bagian depan atap Bagas Godang dan Sopo Godang dimaknai sebagai lambang Dalihan Na Tolu.', 'mandailingBuildings')],
    },
    photos: ['mandailing-house', 'gordang-sambilan'], modules: ['music', 'wisdom'],
  },
  {
    id: 'angkola', name: 'Angkola', category: 'Komunitas budaya', coords: [1.37, 99.27], anchor: 'Kawasan Padangsidimpuan',
    summary: 'Komunitas di kawasan Tapanuli bagian selatan, berkerabat dengan Mandailing tetapi berbeda.',
    topics: {
      identity: [fact('tradition', 'Angkola punya identitas komunitas sendiri. Banyak unsur budayanya mirip dengan tetangganya, Mandailing, dan keduanya sering dikaji bersama, tetapi tidak boleh dianggap sama persis.', 'dalihanCore')],
      history: [fact('history', 'Sebuah kajian tentang raja-raja Mandailing mencatat seorang kepala kampung diangkat menurut adat Angkola pada 1885 dan memimpin hingga 1928.', 'mandailingBuildings')],
      traditions: [
        fact('tradition', 'Hubungan Dalihan Na Tolu menuntun peran dan tutur kata dalam upacara adat.', 'dalihanCore'),
        fact('tradition', 'Di Angkola dan Sipirok, pemimpin yang dihormati disebut dengan ungkapan banir parkolipkolipan, gambaran tentang orang yang memberi naungan.', 'mandailingBuildings'),
      ],
    },
    photos: ['angkola-tortor'], modules: ['wisdom'],
  },
  {
    id: 'pakpak', name: 'Pakpak', category: 'Komunitas budaya', coords: [2.55, 98.32], anchor: 'Salak, Pakpak Bharat',
    summary: 'Komunitas dataran tinggi bagian barat yang tanah asalnya melintasi batas administrasi modern.',
    topics: {
      identity: [
        fact('tradition', 'Silima Suak, lima wilayah adat, mencakup Simsim, Keppas, Pegagan, Kelasen, dan Boang. Perbedaan utamanya ada pada dialek dan marga yang secara historis dominan, dalam satu identitas Pakpak.', 'pakpakSuak'),
        fact('contemporary', 'Komunitas Pakpak tinggal antara lain di Dairi, Pakpak Bharat, Humbang Hasundutan, dan Tapanuli Tengah, serta di Aceh Singkil dan Subulussalam di Aceh.', 'pakpakSuak'),
      ],
      history: [fact('history', 'Pemerintahan masa kolonial membagi wilayah adat Pakpak ke dalam satuan pemerintahan yang terpisah pada awal abad ke-20.', 'pakpakHistory')],
      traditions: [
        fact('tradition', 'Sulang Silima menyatukan lima unsur kekerabatan: garis saudara tertua, tengah, dan bungsu (perisang-isang, pertulan tengah, perekur-ekur), berru, serta puang. Kelimanya terlibat dalam keputusan adat.', 'pakpakSuak'),
        fact('contemporary', 'Himpunan masyarakat HIMPAK menyebut dirinya rumah bersama bagi kelima wilayah dan bergerak di bidang budaya, pembinaan pemuda, dan kesejahteraan.', 'pakpakSuak'),
      ],
      crafts: [fact('contemporary', 'Tatak moccak, seni bela diri Pakpak, dan sanggar tari tradisional termasuk kesenian yang terus diwariskan.', 'pakpakSuak')],
      food: [fact('contemporary', 'Pelleng disebut sebagai makanan khas Pakpak dan menjadi tema sebuah perayaan komunitas pada 2025.', 'pakpakSuak')],
    },
    photos: [], modules: ['intro'],
  },
  {
    id: 'simalungun', name: 'Simalungun', category: 'Komunitas budaya', coords: [2.94, 98.69], anchor: 'Pematang Purba',
    summary: 'Komunitas di timur laut danau dengan bahasa, warisan kerajaan, dan makanan adat sendiri.',
    topics: {
      identity: [
        fact('tradition', 'Simalungun adalah komunitas tersendiri yang dibedakan oleh adat, budaya, dan sejarahnya.', 'simalungunAdat'),
        fact('interpretation', 'Ungkapan habonaron do bona, “kebenaran adalah pokok”, digambarkan sebagai falsafah penuntun orang Simalungun.', 'simalungunAdat'),
      ],
      architecture: [fact('history', 'Kompleks Rumah Bolon di Pematang Purba terkait dengan bekas keluarga raja Purba. Ornamennya pernah dikaji secara semiotika.', 'simalungunOrnament')],
      traditions: [fact('tradition', 'Tolu Sahundulan menyebut tiga kedudukan kerabat dengan peran yang saling melengkapi: tondong memberi nasihat, sanina ikut bermusyawarah, dan boru memberi tenaga. Falsafah ini disebut bersama Lima Saodoran.', 'simalungunAdat')],
      stories: [fact('tradition', 'Hata-hata mambere podah adalah tradisi lisan dalam pernikahan: para tetua dan kerabat memberi nasihat kepada pengantin, sering diawali pantun. Kajian itu mencatat tradisi ini mulai memudar, terutama di perkotaan.', 'simalungunAdat')],
      food: [fact('tradition', 'Dayok binatur adalah ayam yang ditata teratur di atas piring dan disajikan bersama kata-kata nasihat pada acara adat, termasuk pernikahan.', 'simalungunAdat')],
      clothing: [fact('tradition', 'Busana pernikahan mencakup gotong, penutup kepala laki-laki; bulang, penutup kepala perempuan; selendang bahu suri-suri; dan hiou, kain tenun yang dililitkan di tubuh.', 'simalungunAdat')],
    },
    photos: ['simalungun-house'], modules: ['batak', 'culinary', 'wisdom'],
  },
  {
    id: 'nias', name: 'Nias', category: 'Komunitas budaya', coords: [0.62, 97.77], anchor: 'Bawomataluo, Nias Selatan',
    summary: 'Masyarakat pulau di lepas pantai barat dengan bahasa, karya batu monumental, dan arsitektur sendiri. Nias bukan kebudayaan Batak.',
    topics: {
      identity: [fact('history', 'Ono Niha, orang Nias, memiliki bahasa dan warisan sendiri. Adat dan bentuk rumah berbeda antara Nias bagian utara, tengah, dan selatan.')],
      history: [fact('contemporary', 'Permukiman tradisional Bawomataluo tercantum dalam Daftar Sementara (Tentative List) UNESCO milik Indonesia sejak 2009. Statusnya belum ditetapkan sebagai Situs Warisan Dunia.', 'unescoBawomataluo')],
      architecture: [
        fact('history', 'Omo sebua, rumah besar para pemimpin, berdiri di atas tiang kayu yang sangat besar dengan atap yang tinggi dan curam.', 'omoSebua'),
        fact('history', 'Penelitian tentang gempa 2004 dan 2005 menemukan bahwa rumah tradisional Nias bertahan sangat baik, walaupun ada yang miring, roboh, atau rusak.', 'niasQuake'),
      ],
      traditions: [
        fact('history', 'Hombo batu atau fahombo adalah tradisi lompat batu yang terutama terkait dengan Nias Selatan. Sejumlah keterangan mengaitkannya dengan persiapan menghadapi pertikaian antarkampung. Kini tradisi ini menjadi peragaan dan simbol budaya.', 'hombo'),
        fact('tradition', 'Maena adalah pertunjukan bersama yang dikaji dalam konteks upacara pernikahan Falöwa.', 'niasMaena'),
      ],
      crafts: [fact('history', 'Bawomataluo dikenal dengan karya batu monumental yang menyatu dengan tata permukimannya.', 'unescoBawomataluo')],
      clothing: [fact('contemporary', 'Para penampil tari perang mengenakan kostum khas dan membawa perisai sebagai bagian dari pertunjukan budaya.', 'niasMinistry')],
    },
    photos: ['nias-house', 'nias-hombo', 'nias-dance'], modules: ['nias', 'architecture'],
  },
  {
    id: 'medan', name: 'Medan', category: 'Kota', coords: [3.585, 98.675], anchor: 'Pusat kota',
    summary: 'Ibu kota provinsi: kota majemuk dengan akar Melayu Deli yang kuat dan beragam komunitas.',
    topics: {
      identity: [fact('contemporary', 'Medan dihuni banyak komunitas, antara lain Melayu, berbagai kelompok Batak, Jawa, Tionghoa Indonesia, Minangkabau, warga keturunan India, dan lainnya. Tidak ada satu kebudayaan yang mewakili seluruh kota.', 'medanWiki')],
      history: [
        fact('history', 'Sejak 1860-an, lahan di Deli dibuka untuk perkebunan tembakau, dan Medan tumbuh bersama ekonomi perkebunan kolonial ini di wilayah Kesultanan Melayu Deli.', 'medanWiki'),
        fact('tradition', 'Pendirian kota yang lebih awal dikaitkan dengan Guru Patimpus, seorang Karo.', 'medanWiki'),
      ],
      architecture: [
        fact('history', 'Istana Maimun, istana Kesultanan Deli, dibangun sekitar 1887 hingga 1892; tanggalnya sedikit berbeda antarsumber. Rancangannya memadukan beberapa tradisi arsitektur.', 'maimun'),
        fact('history', 'Rumah Tjong A Fie, kediaman seorang saudagar Tionghoa terkemuka, memadukan rancangan bergaya Tionghoa, Melayu, dan pengaruh Eropa. Rumah ini dibuka untuk umum sebagai museum pada 2009.', 'medanSites'),
      ],
    },
    photos: ['maimun', 'tjong-a-fie'], modules: ['intro'],
  },
];

export const regionById = (id: string | null) => REGIONS.find((r) => r.id === id);
