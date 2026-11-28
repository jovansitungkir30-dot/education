/**
 * Shared catalogues of food and of cultural practices. An area links to an entry with the reason for the
 * link, so the same food or tradition is written once and never silently claimed by a single area.
 */
import type { SourceId } from './sources';
import type { Knowledge } from './types';

export interface Food {
  name: string;
  /** Community or place the material associates it with. */
  from: string;
  about: string;
  /** Main ingredients named by the source. Not a complete recipe. */
  ingredients: string[];
  /** Broad preparation steps, only where the source describes them. */
  steps?: string[];
  /** Serving customs, variations or history. */
  context?: string;
  sources: SourceId[];
}

export const FOODS = {
  arsik: {
    name: 'Arsik', from: 'Masyarakat Batak, lekat dengan kawasan Danau Toba',
    about: 'Ikan berbumbu kuning yang dimasak sampai hampir kering. Namanya dikaitkan dengan “mangarsik”, yaitu mengguyur ikan dengan kuah selagi dimasak.',
    ingredients: ['Ikan mas (sisiknya dibiarkan)', 'Andaliman', 'Asam cikala (buah kecombrang)', 'Lengkuas', 'Serai'],
    steps: ['Bumbu dihaluskan', 'Bumbu dilumurkan pada ikan dan didiamkan', 'Dimasak dengan api kecil sampai kuahnya hampir habis'],
    context: 'Hadir dalam acara adat seperti pernikahan dan kelahiran. Dalam upacara tertentu ikan disajikan utuh dari kepala sampai ekor. Ikan mujair dan nila juga dimasak dengan cara ini.',
    sources: ['wArsik'],
  },
  naniura: {
    name: 'Dengke naniura', from: 'Batak Toba',
    about: 'Ikan yang tidak dimasak dengan api. Bumbu bersifat asam yang “mematangkan” dagingnya.',
    ingredients: ['Ikan mas', 'Asam jungga atau kecombrang', 'Andaliman', 'Bumbu sangrai yang digiling'],
    steps: ['Bumbu disangrai lalu digiling', 'Dilumurkan ke ikan', 'Didiamkan sampai asam meresap'],
    context: 'Dahulu disebut dikhususkan bagi raja. Aslinya memakai ikan ihan (semah) dari Danau Toba, yang kini sulit didapat.',
    sources: ['wNaniura'],
  },
  miGomak: {
    name: 'Mi gomak', from: 'Batak Toba, dari sekitar Danau Toba hingga Tapanuli Selatan',
    about: 'Mi lidi berukuran besar dan kenyal, disajikan berkuah santan dengan sayuran dan andaliman.',
    ingredients: ['Mi lidi', 'Santan', 'Andaliman', 'Labu siam, wortel, atau buncis'],
    context: 'Penyebarannya luas, antara lain Balige, Porsea, Tarutung, Parapat, Pematangsiantar, Sibolga, Labuhanbatu, Deli Serdang, dan Medan.',
    sources: ['wMiGomak'],
  },
  ombus: {
    name: 'Ombus-ombus', from: 'Siborongborong, Tapanuli Utara',
    about: 'Kue tepung beras dan ketan dengan kelapa parut dan gula merah di tengahnya. Namanya berarti “tiup-tiup” karena dimakan selagi panas.',
    ingredients: ['Tepung beras', 'Tepung ketan', 'Kelapa parut', 'Gula merah'],
    context: 'Termasuk keluarga lampet.',
    sources: ['wOmbus'],
  },
  lampet: {
    name: 'Lampet', from: 'Masyarakat Batak',
    about: 'Kue kukus berbentuk mirip limas dari tepung beras, kelapa, dan gula, dibungkus daun pisang.',
    ingredients: ['Tepung beras atau ketan', 'Kelapa parut', 'Gula', 'Daun pisang'],
    steps: ['Adonan dicampur', 'Dibungkus daun pisang berbentuk limas', 'Dikukus sampai matang'],
    context: 'Sering hadir dalam upacara adat.',
    sources: ['wLampet'],
  },
  dali: {
    name: 'Dali ni horbo', from: 'Batak Toba di Tapanuli',
    about: 'Olahan susu kerbau yang dibuat secara tradisional tanpa bahan kimia.',
    ingredients: ['Susu kerbau'],
    context: 'Disebut diperdagangkan di onan (pasar) di Tapanuli. Pemerahannya memperhatikan kebutuhan anak kerbau.',
    sources: ['wDali'],
  },
  napinadar: {
    name: 'Manuk napinadar', from: 'Masyarakat Batak',
    about: 'Ayam panggang berbumbu andaliman. Versi tradisionalnya memakai darah ayam sebagai bagian kuah, sehingga tidak halal bagi muslim.',
    ingredients: ['Ayam kampung jantan', 'Andaliman', 'Bawang putih', 'Darah ayam (versi tradisional)'],
    steps: ['Ayam dipanggang', 'Disiram dan dimasak dengan campuran bumbu'],
    context: 'Disajikan pada pesta adat saat sukacita, seperti kelahiran, pernikahan, atau melepas orang merantau.',
    sources: ['wNapinadar'],
  },
  cimpa: {
    name: 'Cimpa', from: 'Karo',
    about: 'Penganan beras ketan merah atau putih dengan isian kelapa dan gula aren, umumnya dikukus dalam daun pisang.',
    ingredients: ['Beras atau tepung ketan', 'Kelapa parut', 'Gula aren', 'Daun pisang'],
    steps: ['Tepung ketan dibuat adonan', 'Diisi inti kelapa dan gula', 'Dibungkus lalu dikukus'],
    context: 'Disebut penting dalam pernikahan, kerja tahun, dan upacara kematian. Variannya antara lain cimpa unung, tuang, dan matah.',
    sources: ['wCimpa'],
  },
  pelleng: {
    name: 'Pelleng', from: 'Pakpak',
    about: 'Nasi kuning yang pedas dengan ayam kampung berbumbu.',
    ingredients: ['Beras', 'Kunyit', 'Cabai', 'Ayam kampung'],
    context: 'Dihidangkan saat upacara keluarga, melepas anak merantau, dan menyambut tamu istimewa, disertai nasihat dan doa. Dahulu diberikan kepada orang yang akan berangkat berperang sebagai penambah semangat.',
    sources: ['wPelleng', 'wPakpak'],
  },
  holat: {
    name: 'Holat', from: 'Padang Bolak, Padang Lawas Utara',
    about: 'Ikan panggang berkuah kaldu dari serutan kulit dalam pohon balakka (Phyllanthus emblica).',
    ingredients: ['Ikan mas atau ikan jurung', 'Serutan batang balakka', 'Jahe dan bawang', 'Pakkat', 'Beras sangrai', 'Jeruk nipis dan cabai'],
    steps: ['Serutan balakka direndam air hangat lalu diperas', 'Kaldunya diberi jahe, bawang, dan garam', 'Disiramkan ke ikan yang dipanggang setengah matang'],
    context: 'Disebut sudah menyebar ke Padangsidimpuan, Rantauprapat, Kotapinang, Aek Kanopan, dan Medan.',
    sources: ['wHolat'],
  },
  pakkat: {
    name: 'Pakkat', from: 'Mandailing',
    about: 'Pucuk rotan muda yang dibakar. Rasanya pahit dan pekat.',
    ingredients: ['Pucuk rotan muda'],
    context: 'Ramai dicari pada bulan Ramadan sebagai lalapan berbuka. Dimakan antara lain bersama arsik.',
    sources: ['wPakkat'],
  },
  babae: {
    name: 'Babae', from: 'Nias Selatan',
    about: 'Hidangan berbahan sejenis kacang-kacangan.',
    ingredients: ['Kacang-kacangan setempat'],
    context: 'Dahulu hanya disuguhkan pada pesta adat, kelahiran, pertunangan, dan pernikahan, dan konon untuk keluarga bangsawan. Sebagian warga Desa Hilisataro melestarikannya kembali.',
    sources: ['wBabae'],
  },
  harinake: {
    name: 'Harinake', from: 'Nias bagian utara dan barat',
    about: 'Daging cincang tipis dan kecil. Umumnya daging babi (tidak halal bagi muslim); ada pula versi ikan yang dipepes.',
    ingredients: ['Daging babi atau ikan cincang'],
    context: 'Disajikan sebagai penghormatan dalam kunjungan pertama kepada mertua setelah pernikahan.',
    sources: ['wHarinake'],
  },
  bika: {
    name: 'Bika Ambon', from: 'Kota Medan',
    about: 'Kue kuning berongga dari tapioka, telur, gula, dan santan.',
    ingredients: ['Tepung tapioka', 'Telur', 'Gula', 'Santan', 'Pengembang (dahulu disebut nira enau)'],
    context: 'Asal namanya belum pasti. Salah satu versi dari budayawan menyebut kue ini diilhami bika atau bingka Melayu dan pertama populer di sekitar Jalan Ambon, Medan.',
    sources: ['wBika'],
  },
  sotoMedan: {
    name: 'Soto Medan', from: 'Kota Medan',
    about: 'Soto berkuah santan kental berwarna kuning dengan ayam atau daging sapi.',
    ingredients: ['Santan', 'Kunyit', 'Serai, lengkuas, jahe', 'Ketumbar, jintan, bunga lawang', 'Ayam atau sapi'],
    context: 'Disebut muncul pada awal abad ke-20 dan semula dikenal sebagai soto Medan Batak.',
    sources: ['wSoto'],
  },
  ragamMedan: {
    name: 'Ragam dapur perantau Medan', from: 'Beragam komunitas kota',
    about: 'Meja makan Medan memuat masakan Batak, Minangkabau, Aceh, Tionghoa, dan India.',
    ingredients: ['Mi hokkien dan cheong fan (Tionghoa)', 'Roti canai dan nasi biryani (India)', 'Sate dan soto Padang', 'Mi Aceh'],
    context: 'Dapur-dapur ini dibawa para perantau yang menetap di Medan selama ratusan tahun.',
    sources: ['wMedanKota'],
  },
  buburPedas: {
    name: 'Bubur pedas', from: 'Melayu Langkat dan Melayu Deli (juga Melayu di daerah lain)',
    about: 'Bubur dari beras sangrai dan kelapa dengan banyak rempah dan sayuran. Meski bernama pedas, rasanya tidak selalu menyengat.',
    ingredients: ['Beras sangrai', 'Kelapa parut', 'Kaldu tulang atau ayam', 'Serai, lada, daun kunyit', 'Aneka sayur dan daun pakis'],
    context: 'Dikenal sebagai hidangan buka puasa, antara lain di lingkungan Kesultanan Deli dan di Masjid Al-Osmani, Medan, sejak sekitar 1870-an.',
    sources: ['wBubur'],
  },
  lemang: {
    name: 'Lemang', from: 'Tebing Tinggi (juga dikenal luas di banyak daerah)',
    about: 'Beras ketan bersantan yang dimasak dalam ruas bambu beralas daun pisang.',
    ingredients: ['Beras ketan', 'Santan', 'Garam', 'Bambu dan daun pisang'],
    steps: ['Ketan dicuci dan direndam', 'Bambu dilapisi daun pisang', 'Diisi ketan dan santan', 'Dibakar di tungku panjang sampai matang'],
    context: 'Di Tebing Tinggi lemang dijual berderet di satu ruas jalan dan dinikmati hangat, antara lain dengan selai atau durian.',
    sources: ['wTebing', 'wLemang'],
  },
  kueKacang: {
    name: 'Kue kacang', from: 'Tebing Tinggi',
    about: 'Kue isi kacang yang di tempat lain disebut bakpia.',
    ingredients: ['Kulit kue', 'Isian kacang'],
    context: 'Disebut muncul sekitar 2005 dan menjadi buah tangan kedua kota ini setelah lemang.',
    sources: ['wTebing'],
  },
  halua: {
    name: 'Halua', from: 'Melayu',
    about: 'Manisan khas Melayu dari buah dan pucuk tanaman, sebagian dibentuk atau dianyam.',
    ingredients: ['Pepaya dan pucuknya', 'Pare', 'Cabai', 'Gelugur', 'Gula'],
    context: 'Jarang diproduksi untuk dijual, tetapi tetap hadir dalam upacara.',
    sources: ['wTebing'],
  },
  lautTanjungbalai: {
    name: 'Hidangan laut dan sungai Tanjungbalai', from: 'Kota Tanjungbalai',
    about: 'Kerang dan ikan menjadi andalan kota pelabuhan sungai ini.',
    ingredients: ['Kerang batu dan kerang hijau', 'Ikan asin mayung dan teri', 'Gulai masam', 'Anyang pakis dan anyang kepah', 'Sombam ikan'],
    sources: ['wTanjungbalai'],
  },
  tapaiBatuBara: {
    name: 'Tapai dan lemang Pesta Tapai', from: 'Melayu Batu Bara',
    about: 'Tapai ketan, tapai ubi, dan lemang yang dijajakan di tepi jalan menjelang Ramadan.',
    ingredients: ['Beras ketan', 'Ubi', 'Ragi tapai', 'Santan untuk lemang'],
    context: 'Lihat juga tradisi Pesta Tapai.',
    sources: ['wTapai'],
  },
} satisfies Record<string, Food>;

export type FoodId = keyof typeof FOODS;

export interface Custom {
  name: string;
  community: string;
  kind: Knowledge;
  about: string;
  /** How it proceeds, only where the source describes it. */
  practice?: string[];
  /** What it is for or what it is said to mean. */
  meaning?: string;
  today?: string;
  /** Instrument or dance entries connected to it. */
  related?: string[];
  sources: SourceId[];
}

export const CUSTOMS = {
  tortor: {
    name: 'Tortor', community: 'Berbagai komunitas Batak', kind: 'tradition',
    about: 'Tarian seremonial yang ditarikan bersama musik gondang atau gordang. Menarikannya disebut manortor, dan gerakannya menjadi cara berkomunikasi antarpeserta upacara.',
    practice: ['Tuan rumah (hasuhutan) lebih dulu meminta berkat atas gondang', 'Peserta menari sesuai kedudukan dalam acara'],
    meaning: 'Menyampaikan harapan, doa, dan suasana hati yang sesuai dengan acaranya.',
    today: 'Praktik, gerak, dan aturannya berbeda antarkomunitas dan acara.',
    related: ['Taganing', 'Gordang Sambilan'], sources: ['wTortor'],
  },
  ulos: {
    name: 'Mangulosi', community: 'Batak Toba', kind: 'tradition',
    about: 'Memberikan kain ulos kepada seseorang dalam acara adat seperti pernikahan, kelahiran, dan dukacita.',
    meaning: 'Penjelasan tradisional mengaitkan ulos dengan kehangatan yang menopang hidup di dataran tinggi yang dingin. Pemberiannya mengikuti hubungan kekerabatan.',
    today: 'Dikenal banyak jenis ulos, antara lain ragi hotang, sibolang, mangiring, dan bintang maratur. Penggunaannya tidak sama.',
    related: ['Ulos'], sources: ['wUlos'],
  },
  dalihan: {
    name: 'Dalihan Na Tolu', community: 'Batak Toba, Angkola, Mandailing (dengan istilah masing-masing)', kind: 'tradition',
    about: 'Kerangka tiga kedudukan kekerabatan yang dihubungkan oleh darah dan perkawinan, diibaratkan tiga batu tungku.',
    meaning: 'Ungkapan “somba marhula-hula” berarti bersikap hormat kepada keluarga pihak pemberi istri, bukan menyembahnya.',
    today: 'Orang yang sama bisa menempati kedudukan berbeda pada acara yang berbeda.',
    sources: ['wDalihan'],
  },
  holi: {
    name: 'Mangongkal holi', community: 'Batak Toba', kind: 'tradition',
    about: 'Upacara memindahkan tulang-belulang leluhur dari makam ke tugu keluarga (simin). Ini upacara keluarga yang sakral.',
    practice: ['Beberapa keluarga satu keturunan bersepakat', 'Doa bersama menurut agama masing-masing', 'Tulang dikumpulkan, dibersihkan, dan ditata dalam peti baru', 'Peti ditempatkan di tugu, yang bisa bertingkat menurut generasi'],
    today: 'Bentuk upacaranya dipengaruhi agama dan kesepakatan keluarga.',
    related: ['Taganing'], sources: ['wHoli', 'wTaganing'],
  },
  kerjaTahun: {
    name: 'Kerja tahun (merdang merdem)', community: 'Karo', kind: 'tradition',
    about: 'Pesta kampung tahunan yang umumnya digelar setelah menanam padi sebagai ungkapan syukur.',
    practice: ['Persiapan dan perayaan dapat berlangsung beberapa hari, tiap hari dengan namanya sendiri', 'Dimeriahkan gendang guro-guro aron, tarian muda-mudi'],
    meaning: 'Syukur atas masa tanam dan doa agar padi terhindar dari hama dan panennya baik.',
    today: 'Waktu dan cara merayakannya berbeda antardaerah.',
    related: ['Kulcapi', 'Cimpa'], sources: ['wKerjaTahun'],
  },
  marsialapari: {
    name: 'Marsialapari', community: 'Angkola dan Mandailing', kind: 'tradition',
    about: 'Gotong royong bergiliran, terutama di sawah. Namanya berkaitan dengan “saling mengambil hari”.',
    practice: ['Sekelompok orang bekerja di lahan anggota pertama', 'Hari berikutnya pindah ke lahan anggota berikutnya', 'Berlanjut sampai semua mendapat giliran'],
    meaning: 'Menegaskan saling bantu: tenaga yang diterima dibalas dengan tenaga.',
    sources: ['wMarsialapari'],
  },
  sulangSilima: {
    name: 'Sulang Silima', community: 'Pakpak', kind: 'tradition',
    about: 'Lima unsur kekerabatan Pakpak yang terlibat dalam keputusan adat: saudara tertua, tengah, dan bungsu, kelompok berru, serta puang.',
    meaning: 'Keputusan adat tidak diambil oleh satu pihak saja.',
    today: 'Struktur pemerintahan kampung lamanya tidak lagi dipakai, tetapi tetap dirujuk dalam adat.',
    sources: ['pakpakSuak', 'wPakpak'],
  },
  rondang: {
    name: 'Rondang Bintang', community: 'Simalungun', kind: 'tradition',
    about: 'Pesta sukacita dan syukur masyarakat adat Simalungun.',
    practice: ['Diadakan sesudah panen raya (Rondang Bintang Sahuta)', 'Atau sebagai ajang muda-mudi mencari jodoh'],
    meaning: 'Namanya dikaitkan dengan bulan yang terang bersih.',
    sources: ['wRondang'],
  },
  pestaTapai: {
    name: 'Pesta Tapai', community: 'Melayu Batu Bara', kind: 'contemporary',
    about: 'Pasar musiman menyambut Ramadan di Desa Dahari Selebar, Kecamatan Talawi, tempat pedagang menjual tapai, lemang, dan penganan Melayu.',
    practice: ['Dimulai sekitar sebulan sebelum Ramadan', 'Berlangsung sampai sehari sebelum Ramadan'],
    meaning: 'Menurut penuturan, bermula sekitar 1760-an ketika desa ini menjadi tempat jual beli daging kerbau menjelang Ramadan, dan para pendatang biasa mencari tapai dan lemang.',
    sources: ['wTapai'],
  },
  gubang: {
    name: 'Kesenian dan tari Gubang', community: 'Melayu Asahan, terutama nelayan', kind: 'tradition',
    about: 'Pertunjukan musik dan tari yang persebarannya meliputi Kabupaten Asahan dan Kota Tanjungbalai.',
    practice: ['Ada ragam gerak persembahan', 'Penari laki-laki membawakan gerak yang menggambarkan kegagahan, penari perempuan keuletan dan kelembutan'],
    meaning: 'Namanya dikaitkan dengan “gebeng”, perahu dalam bahasa Melayu dialek Asahan. Menurut legenda lisan, tarian ini lahir dari kisah nelayan yang berdoa meminta angin di tengah laut.',
    today: 'Disebut mendapat pengaruh Islam seiring waktu.',
    sources: ['wGubang'],
  },
  sikambang: {
    name: 'Sikambang', community: 'Pesisir pantai barat', kind: 'tradition',
    about: 'Kesenian yang diteliti sebagai penanda identitas budaya Pesisir di lingkungan yang multikultural.',
    sources: ['sikambang'],
  },
  fahombo: {
    name: 'Fahombo (hombo batu)', community: 'Nias, terutama dikenal di Nias Selatan', kind: 'tradition',
    about: 'Melompati susunan batu setinggi sekitar dua meter dengan permukaan atas datar.',
    practice: ['Anak laki-laki berlatih sejak muda', 'Pelompat mengenakan busana prajurit Nias', 'Lompatan dilakukan melewati batu'],
    meaning: 'Dahulu menjadi penanda kedewasaan dan kesiapan menjadi prajurit serta memikul tanggung jawab.',
    today: 'Kini lebih banyak hadir sebagai pertunjukan dan simbol budaya.',
    sources: ['wFahombo', 'hombo'],
  },
  moyo: {
    name: 'Tari Moyo', community: 'Ono Niha (Nias), dengan versi berbeda antardaerah', kind: 'tradition',
    about: 'Tarian yang geraknya terilham elang (moyo) yang mengepakkan sayap.',
    practice: ['Busana mengacu pada busana bangsawan perempuan masa lalu', 'Di Nias Selatan penari perempuan berbusana kuning berselempang merah; di daerah lain umumnya merah, hitam, dan putih'],
    meaning: 'Salah satu penuturan menyebutnya menggambarkan sukacita seorang ibu atas kepulangan anaknya dari perang, juga keuletan mengejar cita-cita.',
    related: ['Gondra'], sources: ['wMoyo', 'tariMoyo'],
  },
  maena: {
    name: 'Maena', community: 'Ono Niha (Nias)', kind: 'tradition',
    about: 'Tarian bersama yang jumlah penarinya tidak dibatasi; siapa pun boleh ikut.',
    practice: ['Lazim dalam pernikahan adat, antara lain saat mempelai laki-laki tiba di rumah mempelai perempuan', 'Syair dipakai untuk memuji pengantin'],
    meaning: 'Dipandang sebagai lambang persatuan dan kebersamaan.',
    today: 'Juga ditampilkan untuk menyambut tamu kehormatan.',
    sources: ['wMaena', 'niasMaena'],
  },
  owasa: {
    name: 'Owasa', community: 'Ono Niha (Nias)', kind: 'history',
    about: 'Pesta besar untuk menaikkan kedudukan sosial penyelenggaranya, ditandai pendirian peninggalan batu.',
    practice: ['Ribuan orang diundang dalam pesta berhari-hari', 'Banyak ternak disembelih', 'Batu megalit didirikan sebagai penanda'],
    meaning: 'Melalui rangkaian owasa seseorang dapat mencapai tingkatan balugu.',
    today: 'Disebut bertahan sampai sekitar 1950.',
    sources: ['wOwasa'],
  },
} satisfies Record<string, Custom>;

export type CustomId = keyof typeof CUSTOMS;
