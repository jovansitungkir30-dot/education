/**
 * Editorial content for each of the 25 regencies and 8 cities.
 * A food or tradition link always says why it appears here. `daerah` means the source ties it to this
 * place; `komunitas` means the source ties it to a community that the area's sources say lives here,
 * which does NOT make it exclusive to, or typical of, the whole area.
 */
import type { CustomId, FoodId } from './heritage';
import type { SourceId } from './sources';
import type { Knowledge } from './types';

export interface Moment {
  when: string;
  title: string;
  text: string;
  kind: Knowledge;
  sources: SourceId[];
}

export type Basis = 'daerah' | 'komunitas';
export type Link<T> = [id: T, basis: Basis, why: string];

export interface Sight {
  name: string;
  text: string;
  sources: SourceId[];
}

export interface AreaContent {
  /** What makes this area worth opening, in its own words. */
  lead: string;
  people: { text: string; sources: SourceId[] };
  timeline: Moment[];
  traditions: Link<CustomId>[];
  foods: Link<FoodId>[];
  places: Sight[];
}

const m = (when: string, title: string, text: string, kind: Knowledge, ...sources: SourceId[]): Moment => ({ when, title, text, kind, sources });
const people = (text: string, ...sources: SourceId[]) => ({ text, sources });
const sight = (name: string, text: string, ...sources: SourceId[]): Sight => ({ name, text, sources });

export const AREAS: Record<string, AreaContent> = {
  asahan: {
    lead: 'Dari air terjun di hulu sampai pesisir Selat Malaka, Asahan tumbuh bersama sungainya: jalur dagang, pusat kesultanan, lalu salah satu kantong perkebunan besar Sumatra Timur.',
    people: people('Orang Melayu disebut sebagai penduduk asli, banyak tinggal di pesisir. Kabupaten ini majemuk: ada berbagai komunitas Batak (termasuk Batak Pardembanan di Bandar Pasir Mandoge), Tionghoa, dan Jawa, yang jumlahnya terbanyak.', 'wAsahan'),
    timeline: [
      m('1612', 'Perjalanan Sultan Iskandar Muda', 'Kisah asal-usul Asahan bermula dari persinggahan Sultan Aceh di hulu sungai dalam perjalanan ke Johor dan Melaka. Di pertemuan Sungai Asahan dan Sungai Silau didirikan “balai” yang dikaitkan dengan nama Tanjungbalai.', 'tradition', 'wAsahan'),
      m('Abad ke-17', 'Kesultanan Asahan', 'Abdul Jalil disebut sebagai sultan pertama. Sumber menyebut 1630 sebagai awal pemerintahannya, sedangkan artikel Kota Tanjungbalai menyebut 1620.', 'interpretation', 'wAsahan', 'wTanjungbalai'),
      m('1865', 'Dikuasai Belanda', 'Pada 22 September 1865 Belanda menguasai kesultanan, lalu menempatkan seorang kontroler.', 'history', 'wAsahan'),
      m('Akhir abad ke-19', 'Era perkebunan', 'Asahan menjadi bagian Keresidenan Sumatera Timur, kawasan yang dipadati perusahaan perkebunan asing.', 'history', 'wAsahan'),
    ],
    traditions: [['gubang', 'daerah', 'Sumber menyebut persebaran Gubang meliputi Asahan dan Tanjungbalai.']],
    foods: [],
    places: [sight('Sungai Asahan', 'Berhulu di Danau Toba dan bermuara di Selat Malaka. Jeramnya dikenal pegiat arung jeram.', 'asahanJeram', 'asahanSungai')],
  },
  'batu-bara': {
    lead: 'Pesisir Melayu dengan ingatan tentang kerajaan, istana kayu, dan pasar tapai yang hidup setiap menjelang Ramadan.',
    people: people('Kabupaten ini berdiri di bekas wilayah Kerajaan Batu Bara. Tradisi Pesta Tapai menandai kuatnya budaya Melayu di pesisirnya; penduduk kabupaten lebih beragam daripada itu.', 'wBatuBara', 'wTapai'),
    timeline: [
      m('Paruh kedua abad ke-17 – 1946', 'Kerajaan Batu Bara', 'Wilayah ini bekas Kerajaan Batu Bara, yang disebut bertahan sampai 1946.', 'history', 'wBatuBara'),
      m('Sekitar 1760-an', 'Awal Pesta Tapai', 'Desa Dahari Selebar dituturkan ramai sebagai pasar daging kerbau menjelang Ramadan, lalu dikenal dengan tapai dan lemangnya.', 'tradition', 'wTapai'),
      m('1912', 'Istana Niat Lima Laras', 'Istana di Tanjung Tiram dibangun oleh Datuk Matyoeda; keterangan lain mencatat keluarga sudah menempatinya sejak 1883.', 'history', 'limaLaras'),
      m('1957 – 2007', 'Menjadi kabupaten sendiri', 'Usulan pemekaran dari Asahan diperjuangkan sejak 1957. Kabupaten Batu Bara diresmikan pada 15 Juni 2007.', 'history', 'wBatuBara'),
    ],
    traditions: [['pestaTapai', 'daerah', 'Berlangsung di Kecamatan Talawi, Batu Bara.']],
    foods: [['tapaiBatuBara', 'daerah', 'Sajian utama Pesta Tapai.']],
    places: [sight('Desa Dahari Selebar', 'Lokasi para pedagang Pesta Tapai berjualan di tepi jalan.', 'wTapai')],
  },
  dairi: {
    lead: 'Dataran tinggi penghasil kopi di sisi barat Danau Toba, rumah bagi orang Pakpak bersama tetangga Toba dan Karo.',
    people: people('Penduduk asli disebut orang Pakpak. Ada pula orang Toba dan Karo serta pendatang Jawa, Tionghoa, Aceh, Minangkabau, dan lainnya. Bahasa Pakpak, Toba, dan Karo dituturkan di samping bahasa Indonesia.', 'wDairi'),
    timeline: [
      m('Awal abad ke-20', 'Wilayah adat dipecah', 'Pemerintahan kolonial membagi wilayah adat Pakpak ke dalam satuan pemerintahan yang terpisah.', 'history', 'pakpakHistory'),
      m('1947', 'Kepala daerah pertama', 'Pada masa Agresi Militer I ditetapkan kepala daerah Dairi yang berkedudukan di Sidikalang. Tanggal 1 Oktober 1947 kemudian dijadikan hari jadi.', 'history', 'wDairi'),
      m('1964', 'Kabupaten Dairi', 'Dairi dibentuk sebagai kabupaten, dimekarkan dari Tapanuli Utara.', 'history', 'wDairi'),
      m('2003', 'Pakpak Bharat berdiri', 'Sebagian wilayah dimekarkan menjadi Kabupaten Pakpak Bharat.', 'history', 'wDairi'),
    ],
    traditions: [['sulangSilima', 'komunitas', 'Adat orang Pakpak, penduduk asli Dairi.']],
    foods: [['pelleng', 'komunitas', 'Makanan khas orang Pakpak.']],
    places: [sight('Perkebunan kopi', 'Data 2020 yang dikutip mencatat sekitar 13.190 hektare kebun kopi, tertinggi di antara komoditas perkebunan kabupaten.', 'wDairi')],
  },
  'deli-serdang': {
    lead: 'Wilayah dua bekas kesultanan, Deli dan Serdang, yang kini mengelilingi Medan dan menampung penduduk dari banyak asal.',
    people: people('Data yang dikutip mencatat penduduk Jawa, Melayu, berbagai komunitas Batak, serta Tionghoa, Minangkabau, Nias, Aceh, India Tamil, dan lainnya.', 'wDeliSerdang'),
    timeline: [
      m('Sebelum 1945', 'Dua kesultanan', 'Wilayah ini berada di bawah Kesultanan Deli yang berpusat di Medan dan Kesultanan Serdang yang berpusat di Perbaungan.', 'history', 'wDeliSerdang'),
      m('1946', 'Hari jadi', 'Hari jadi Deli Serdang ditetapkan pada 1 Juli 1946.', 'history', 'wDeliSerdang'),
      m('1986', 'Ibu kota pindah', 'Pusat pemerintahan dipindahkan dari Medan ke Lubuk Pakam, diresmikan Desember 1986.', 'history', 'wDeliSerdang'),
      m('2003', 'Serdang Bedagai dimekarkan', 'Bagian timur menjadi Kabupaten Serdang Bedagai.', 'history', 'wDeliSerdang'),
      m('2019', 'Benteng Putri Hijau', 'Situs benteng tanah di Deli Tua ditetapkan sebagai cagar budaya tingkat provinsi.', 'contemporary', 'putriHijauBerita'),
    ],
    traditions: [],
    foods: [['buburPedas', 'komunitas', 'Sumber mengaitkannya dengan orang Melayu Deli.'], ['miGomak', 'daerah', 'Artikel mi gomak menyebut Deli Serdang sebagai salah satu daerah persebarannya.']],
    places: [sight('Sibolangit', 'Kecamatan dengan lokasi wisata terbanyak menurut data 2024 yang dikutip.', 'wDeliSerdang')],
  },
  'humbang-hasundutan': {
    lead: 'Dataran tinggi dengan ketinggian lebih dari 2.000 meter, lembah Bakkara yang bersejarah, serta pertemuan komunitas Toba dan Pakpak.',
    people: people('Mayoritas penduduk Batak Toba dan bahasa Toba menjadi bahasa sehari-hari. Di wilayah Pakkat, Parlilitan, dan Tarabintang terdapat komunitas Pakpak yang besar.', 'wHumbahas'),
    timeline: [
      m('Abad ke-19', 'Pusat Sisingamangaraja', 'Bakkara digambarkan sebagai pusat dinasti Sisingamangaraja, tempat Sisingamangaraja XII menyusun perlawanan terhadap Belanda.', 'history', 'bakkara', 'bakkaraMongabay'),
      m('2003', 'Kabupaten baru', 'Humbang Hasundutan dibentuk pada 28 Juli 2003, dimekarkan dari Tapanuli Utara, beribu kota Doloksanggul.', 'history', 'wHumbahas'),
    ],
    traditions: [['tortor', 'daerah', 'Artikel tortor menyebut Humbang Hasundutan dalam daerah persebarannya.'], ['ulos', 'komunitas', 'Adat Batak Toba, komunitas mayoritas.'], ['holi', 'komunitas', 'Upacara keluarga Batak Toba.']],
    foods: [['dali', 'komunitas', 'Olahan Batak Toba di Tapanuli.'], ['arsik', 'komunitas', 'Masakan yang lekat dengan komunitas Batak di kawasan Danau Toba.']],
    places: [sight('Lembah Bakkara', 'Lembah di tepi Danau Toba tempat kompleks istana Sisingamangaraja berada.', 'bakkaraMongabay')],
  },
  karo: {
    lead: 'Tanah tinggi berhawa sejuk di kaki Sinabung dan Sibayak, dengan bahasa, rumah adat, dan pesta tani yang khas Karo.',
    people: people('Orang Karo adalah penduduk asli dan mayoritas, tersebar di semua kecamatan. Ada pula komunitas Batak lain dan pendatang, terutama di Kabanjahe, Berastagi, dan wilayah perbatasan Aceh.', 'wKaro'),
    timeline: [
      m('Masa lalu', 'Bagian Kerajaan Haru', 'Wilayah Karo disebut dahulu menjadi bagian Kerajaan Haru.', 'interpretation', 'wKaro'),
      m('Sebelum masa kolonial berakhir', 'Lima kerajaan Sibayak', 'Disebut ada lima kerajaan Sibayak: Lingga, Sarinembah, Suka, Barusjahe, dan Kutabuluh, yang terhubung dengan sejumlah merga.', 'tradition', 'wKaro'),
      m('2020', 'Siwaluh jabu hari ini', 'Kajian di Desa Lingga mencatat perubahan: sekat tambahan, rumah yang tak lagi dihuni delapan keluarga, dan perawatan yang menurun.', 'contemporary', 'karoSpace'),
    ],
    traditions: [['kerjaTahun', 'daerah', 'Perayaan orang Karo di Kabupaten Karo.']],
    foods: [['cimpa', 'daerah', 'Penganan acara adat Karo.'], ['arsik', 'komunitas', 'Versi Karo disebut memakai bunga dan buah kecombrang.']],
    places: [sight('Gunung Sinabung dan Sibayak', 'Dua gunung yang menjadi penanda Dataran Tinggi Karo.', 'wKaro'), sight('Air Terjun Sipisopiso', 'Termasuk tujuan alam utama, dekat ujung utara Danau Toba.', 'wKaro')],
  },
  labuhanbatu: {
    lead: 'Namanya lahir dari sebuah tempat pendaratan kapal dari batu, di wilayah yang dahulu dibagi empat kesultanan.',
    people: people('Orang Melayu disebut penduduk asli. Menurut sensus 2010, komunitas Batak dan Jawa kini yang terbesar, disusul Melayu yang banyak tinggal di kawasan Panai dan Bilah Hilir.', 'wLabuhanbatu'),
    timeline: [
      m('Sekitar 1630', 'Kesultanan Bilah', 'Berpusat di Negeri Lama. Keterangan tentang leluhur dinastinya tidak seragam.', 'interpretation', 'bilahSejarah'),
      m('1862', 'Asal nama Labuhanbatu', 'Angkatan Laut Belanda membangun tempat pendaratan kapal dari batu di hulu Labuhanbilik. Kampung yang tumbuh di sana disebut “Pelabuhanbatu”, lalu Labuhanbatu.', 'history', 'wLabura'),
      m('Sebelum 1945', 'Empat kesultanan', 'Kotapinang, Kualuh (Tanjung Pasir), Bilah (Negeri Lama), dan Panai (Labuhan Bilik).', 'history', 'wLabura'),
      m('1946', 'Satu kabupaten', 'Keempat wilayah kesultanan menjadi bagian Kabupaten Labuhanbatu.', 'history', 'wLabura'),
      m('2008', 'Dimekarkan', 'Dua kabupaten baru berdiri dari wilayah ini: Labuhanbatu Utara dan Labuhanbatu Selatan.', 'history', 'wLabura'),
    ],
    traditions: [],
    foods: [['holat', 'daerah', 'Artikel holat menyebut Rantauprapat dalam persebarannya.'], ['miGomak', 'daerah', 'Artikel mi gomak menyebut Labuhanbatu.']],
    places: [sight('Air Terjun Linggahara', 'Air terjun di Kecamatan Rantau Selatan.', 'wLabuhanbatu'), sight('Pulau Sikantan', 'Pulau di Desa Tanjung Sarang Elang, Panai Hulu.', 'wLabuhanbatu')],
  },
  'labuhanbatu-selatan': {
    lead: 'Pintu selatan menuju Tabagsel, dengan puing istana Kotapinang sebagai saksi sebuah kesultanan.',
    people: people('Menurut data yang dikutip, orang Jawa dan berbagai komunitas Batak (terutama Angkola dan Mandailing) merupakan bagian terbesar penduduk, disusul Melayu dan lainnya.', 'wLabusel'),
    timeline: [
      m('Sebelum 1945', 'Kesultanan Kotapinang', 'Salah satu dari empat kesultanan di wilayah Labuhanbatu, berkedudukan di Kotapinang.', 'history', 'wLabura'),
      m('Sekitar 1927 – 1934', 'Istana Bahran', 'Istana kesultanan dibangun; tahunnya berbeda antarsumber.', 'interpretation', 'bahran'),
      m('1946', 'Revolusi sosial', 'Istana hancur dalam pergolakan, dan wilayah kesultanan masuk Kabupaten Labuhanbatu.', 'history', 'bahran', 'wLabura'),
      m('2008', 'Kabupaten sendiri', 'Labuhanbatu Selatan dimekarkan dengan ibu kota di Kotapinang.', 'history', 'wLabusel', 'wLabura'),
    ],
    traditions: [],
    foods: [['holat', 'daerah', 'Artikel holat menyebut Kotapinang dalam persebarannya.']],
    places: [sight('Sampuran Pandayangan', 'Pemandian alam di Desa Ulumahuam, Silangkitang.', 'wLabusel')],
  },
  'labuhanbatu-utara': {
    lead: 'Bekas pusat Kesultanan Kualuh, dengan perbukitan berair terjun dan gua di bagian pedalamannya.',
    people: people('Penduduk kabupaten ini beragam. Rincian komunitas belum kami baca dari sumber yang memadai.', 'wLabura'),
    timeline: [
      m('Sebelum 1945', 'Kesultanan Kualuh', 'Berkedudukan di Tanjung Pasir, satu dari empat kesultanan di wilayah Labuhanbatu.', 'history', 'wLabura'),
      m('1934 – 1937', 'Masjid Tanjung Pasir', 'Masjid peninggalan Kualuh dibangun; sumber lain menyebut tahun berbeda.', 'interpretation', 'kualuh'),
      m('1946', 'Masuk Labuhanbatu', 'Wilayah kesultanan menjadi bagian kabupaten.', 'history', 'wLabura'),
      m('2008', 'Kabupaten sendiri', 'Labuhanbatu Utara dibentuk dengan ibu kota Aek Kanopan.', 'history', 'wLabura'),
    ],
    traditions: [],
    foods: [['holat', 'daerah', 'Artikel holat menyebut Aek Kanopan dalam persebarannya.']],
    places: [sight('Air terjun Na IX-X', 'Kecamatan Na IX-X memiliki sejumlah air terjun, antara lain Tombak Tampayan, Padang Nabidang, dan Matoga.', 'wLabura'), sight('Gua Tapak Tilas', 'Gua di Desa Kuala Beringin, Kualuh Hulu.', 'wLabura')],
  },
  langkat: {
    lead: 'Tanah Kesultanan Langkat di ujung barat laut provinsi, dengan masjid berkubah hitam di Tanjung Pura sebagai wajah warisannya.',
    people: people('Nama kabupaten diambil dari Kesultanan Langkat. Wilayah ini luas dan dihuni beragam komunitas, termasuk orang Melayu.', 'wLangkat'),
    timeline: [
      m('1568', 'Daftar penguasa dimulai', 'Silsilah Kesultanan Langkat yang dikutip diawali Panglima Dewa Shahdan (1568–1580).', 'tradition', 'wLangkat'),
      m('1840 – 1893', 'Sultan Musa', 'Masa pemerintahan Sultan Musa; pembangunan Masjid Azizi dikaitkan dengan prakarsanya.', 'history', 'wLangkat', 'azizi'),
      m('1902', 'Masjid Azizi diresmikan', 'Masjid diresmikan pada masa Sultan Abdul Aziz (1893–1927).', 'history', 'azizi', 'aziziWiki'),
      m('1942 – 1945', 'Pendudukan Jepang', 'Susunan pemerintahan dipertahankan dengan sebutan Jepang.', 'history', 'wLangkat'),
      m('1947 – 1949', 'Dua pemerintahan', 'Saat agresi militer, Langkat terbagi antara Negara Sumatera Timur di Binjai dan Republik di Pangkalan Brandan.', 'history', 'wLangkat'),
    ],
    traditions: [],
    foods: [['buburPedas', 'komunitas', 'Sumber mengaitkannya dengan orang Melayu Langkat.']],
    places: [sight('Tanjung Pura', 'Kota tempat Masjid Azizi berada.', 'azizi')],
  },
  'mandailing-natal': {
    lead: 'Tanah gordang sembilan: huta Mandailing di pedalaman, pesisir Natal di barat, dan bahasa serta adat yang dekat dengan Angkola namun berbeda.',
    people: people('Orang Mandailing mayoritas, dengan marga seperti Nasution, Lubis, Pulungan, Rangkuti, dan Daulay. Orang Pesisir dan Minangkabau banyak di pesisir dan perbatasan Sumatera Barat; ada pula Melayu dan Nias.', 'wMadina'),
    timeline: [
      m('Sekitar 1475 (perkiraan)', 'Gordang Sambilan', 'Sebuah keterangan memperkirakan kesenian ini muncul sejak abad ke-15. Angka ini belum pasti.', 'tradition', 'wGordang'),
      m('1824', 'Belanda masuk', 'Pemerintah Hindia Belanda mulai masuk ke wilayah ini.', 'history', 'wMadina'),
      m('1852', 'Dua afdeling', 'Wilayah dibagi menjadi Afdeling Mandailing dan Afdeling Natal.', 'history', 'wMadina'),
      m('1998', 'Kabupaten Mandailing Natal', 'Dimekarkan dari Tapanuli Selatan, diresmikan 23 November 1998.', 'history', 'wMadina'),
    ],
    traditions: [['marsialapari', 'daerah', 'Sumber menyebutnya kearifan lokal masyarakat di Mandailing Natal.'], ['tortor', 'daerah', 'Artikel tortor menyebut Mandailing Natal.'], ['dalihan', 'komunitas', 'Kerangka kekerabatan yang juga dikenal Mandailing.']],
    foods: [['pakkat', 'komunitas', 'Makanan khas Mandailing.'], ['holat', 'komunitas', 'Artikel holat menyebut orang Mandailing mengenalnya.']],
    places: [sight('Mandailing Julu', 'Kawasan hulu tempat banyak ditemukan bekas penambangan emas.', 'wMadina')],
  },
  nias: {
    lead: 'Kabupaten di Pulau Nias yang telah melahirkan beberapa daerah otonom baru, dengan tarian elang sebagai salah satu wajah budaya pulaunya.',
    people: people('Ono Niha (orang Nias) memiliki bahasa dan warisan sendiri. Nias bukan bagian dari kebudayaan Batak.', 'museumNias'),
    timeline: [
      m('Hingga sekitar 1950', 'Pesta owasa', 'Pesta besar penaik kedudukan sosial, ditandai batu megalit, disebut bertahan sampai masa ini.', 'history', 'wOwasa'),
      m('2003 – 2008', 'Pemekaran bertahap', 'Dari Kabupaten Nias berdiri Nias Selatan (2003), lalu Nias Utara, Nias Barat, dan Kota Gunungsitoli (2008).', 'history', 'wNisel', 'wNiut', 'wNibar', 'wGunungsitoli'),
      m('2016', 'Ibu kota di Gido', 'Pusat pemerintahan kabupaten berada di Gido; sebelumnya di Gunungsitoli.', 'history', 'wNias'),
    ],
    traditions: [['moyo', 'komunitas', 'Tarian Nias yang punya versi di berbagai daerah pulau.'], ['maena', 'komunitas', 'Tarian bersama orang Nias.'], ['owasa', 'komunitas', 'Pesta adat orang Nias pada masa lalu.']],
    foods: [],
    places: [sight('Pulau Nias', 'Pulau besar di lepas pantai barat Sumatra yang kini terbagi atas empat kabupaten dan satu kota.', 'wNias')],
  },
  'nias-barat': {
    lead: 'Sisi barat Nias yang menghadap Samudra Hindia: batu-batu megalit di darat dan gugus Kepulauan Hinako di laut.',
    people: people('Ono Niha, dengan tradisi yang punya ciri daerah.', 'museumNias'),
    timeline: [
      m('Hingga sekitar 1950', 'Batu dan owasa', 'Pendirian megalit di Nias terkait pesta owasa yang disebut bertahan sampai masa ini.', 'history', 'wOwasa'),
      m('2008', 'Kabupaten dibentuk', 'Undang-undang pembentukan ditetapkan; Nias Barat berdiri 26 November 2008.', 'history', 'wNibar'),
      m('2009', 'Diresmikan', 'Menteri Dalam Negeri meresmikan daerah otonom baru pada 26 Mei 2009.', 'history', 'wNibar'),
    ],
    traditions: [['owasa', 'komunitas', 'Tradisi Nias yang meninggalkan batu-batu megalit.'], ['moyo', 'komunitas', 'Tarian Nias dengan versi antardaerah.']],
    foods: [['harinake', 'daerah', 'Sumber menyebut Nias bagian barat.']],
    places: [sight('Kepulauan Hinako', 'Delapan pulau kecil di Kecamatan Sirombu, berpantai pasir putih, berterumbu karang, dan berkebun kelapa; Pulau Asu dan Bawa dikenal peselancar.', 'wNibar')],
  },
  'nias-selatan': {
    lead: 'Permukiman batu, rumah beratap curam, dan lompat batu yang membuat Nias dikenal dunia.',
    people: people('Ono Niha, dengan arsitektur dan tradisi khas Nias bagian selatan.', 'museumNias', 'unescoBawomataluo'),
    timeline: [
      m('Masa lalu', 'Kedewasaan di atas batu', 'Melompati batu dahulu menjadi penanda kedewasaan dan kesiapan menjadi prajurit.', 'tradition', 'wFahombo'),
      m('2003', 'Kabupaten sendiri', 'Nias Selatan menjadi daerah otonom, beribu kota Teluk Dalam.', 'history', 'wNisel'),
      m('2004 – 2005', 'Ujian gempa', 'Penelitian sesudah gempa mendapati rumah tradisional Nias umumnya bertahan baik.', 'history', 'niasQuake'),
      m('2009', 'Daftar tentatif UNESCO', 'Permukiman Bawomataluo masuk Daftar Sementara Indonesia. Statusnya belum Situs Warisan Dunia.', 'contemporary', 'unescoBawomataluo'),
    ],
    traditions: [['fahombo', 'daerah', 'Tradisi yang terutama dikenal di Nias Selatan.'], ['moyo', 'daerah', 'Sumber menggambarkan busana penari versi Nias Selatan.'], ['maena', 'komunitas', 'Tarian bersama orang Nias.']],
    foods: [['babae', 'daerah', 'Makanan khas Nias Selatan.']],
    places: [sight('Bawomataluo', 'Desa dengan jalan berlapis batu, deretan rumah, dan karya batu monumental.', 'unescoBawomataluo')],
  },
  'nias-utara': {
    lead: 'Pesisir dan pedalaman Nias bagian utara: pantai berkarang, danau di Alasa, dan rumah panggung yang bertumpu di atas batu.',
    people: people('Ono Niha, dengan bahasa Nias dialek utara.', 'wNiut', 'museumNias'),
    timeline: [
      m('2004 – 2005', 'Ujian gempa', 'Rumah tradisional Nias yang tanpa paku umumnya bertahan baik saat gempa besar.', 'history', 'niasQuake'),
      m('2008', 'Kabupaten diresmikan', 'Nias Utara diresmikan pada 29 Oktober 2008 sebagai pemekaran Kabupaten Nias, beribu kota Lotu.', 'history', 'wNiut'),
    ],
    traditions: [['moyo', 'komunitas', 'Tarian Nias dengan versi antardaerah.'], ['maena', 'komunitas', 'Tarian bersama orang Nias.']],
    foods: [['harinake', 'daerah', 'Sumber menyebut Nias bagian utara.']],
    places: [
      sight('Danau Megoto', 'Danau di Desa Ononamolo Tumula, Alasa, berair jernih yang warnanya disebut dapat berubah.', 'wNiut'),
      sight('Pantai Turedawola', 'Pantai di Afulu yang dipakai berselancar.', 'wNiut'),
      sight('Pantai Tureloto', 'Pantai berkarang di Lahewa dengan laut yang tenang dan jernih.', 'wNiut'),
    ],
  },
  'padang-lawas': {
    lead: 'Hamparan percandian bata di lembah Barumun, jejak masa ketika agama Buddha meninggalkan bangunan besar di pedalaman Sumatra.',
    people: people('Penduduk kabupaten ini beragam. Rincian komunitas belum kami baca dari sumber yang memadai; kabupaten ini dahulu bagian Tapanuli Selatan.', 'wPalas'),
    timeline: [
      m('Sekitar abad ke-11', 'Biaro-biaro Padang Lawas', 'Biaro Sipamutung diperkirakan berasal dari masa ini dan dikaitkan dengan Kerajaan Pannai.', 'interpretation', 'sipamutung'),
      m('2007', 'Kabupaten sendiri', 'Padang Lawas dibentuk pada 10 Agustus 2007, dimekarkan dari Tapanuli Selatan, beribu kota Sibuhuan.', 'history', 'wPalas'),
    ],
    traditions: [],
    foods: [],
    places: [
      sight('Kawasan arkeologi Padang Lawas', 'Sekitar 1.500 km² yang mencakup Barumun, Barumun Tengah, dan Sosopan sampai Padang Lawas Utara.', 'wPalas'),
      sight('Candi Tandihat dan Sisangkilon', 'Candi lain di kabupaten ini, di Barumun Tengah dan Lubuk Barumun.', 'wPalas'),
    ],
  },
  'padang-lawas-utara': {
    lead: 'Candi bata merah Bahal berdiri di padang Portibi, tak jauh dari dapur yang melahirkan holat.',
    people: people('Mayoritas Batak Angkola, dengan marga seperti Harahap, Siregar, Hasibuan, Rambe, dan Daulay. Ada pula Batak Toba, Nias, dan Jawa.', 'wPaluta'),
    timeline: [
      m('Sekitar abad ke-11 – 12', 'Candi Bahal', 'Kompleks biaro bercorak Buddha Vajrayana; perkiraan usianya berbeda antarsumber.', 'interpretation', 'bahalWiki', 'bahalSpasial'),
      m('2007', 'Kabupaten sendiri', 'Dibentuk dari pemekaran Tapanuli Selatan, beribu kota Gunungtua.', 'history', 'wPaluta'),
    ],
    traditions: [['marsialapari', 'komunitas', 'Gotong royong yang dikenal masyarakat Angkola.'], ['dalihan', 'komunitas', 'Kerangka kekerabatan yang juga dikenal Angkola.']],
    foods: [['holat', 'daerah', 'Holat disebut berasal dari Padang Bolak.']],
    places: [sight('Candi Bahal I–III', 'Tiga candi di Desa Bahal, Kecamatan Portibi.', 'wPaluta'), sight('Suaka Barumun', 'Barumun Nagari Wildlife Sanctuary di Desa Batu Nanggar.', 'wPaluta')],
  },
  'pakpak-bharat': {
    lead: 'Kabupaten berpenduduk paling sedikit di provinsi, di kaki Bukit Barisan, tempat adat lima suak Pakpak dan patung mejan dirawat.',
    people: people('Umumnya orang Pakpak. Banyak wilayahnya tanah ulayat suak Simsim; ada pula marga dari suak lain, serta Toba, Karo, Melayu, Nias, dan lainnya.', 'wPakpak'),
    timeline: [
      m('Sebelum masa Belanda', 'Pemerintahan adat', 'Tiap suak dipimpin raja ekuten atau takal aur. Kampung (kuta) dipimpin pertaki, dibantu sulang silima.', 'history', 'wPakpak'),
      m('Awal abad ke-20', 'Wilayah adat terbagi', 'Pemerintahan kolonial memecah wilayah adat Pakpak.', 'history', 'pakpakHistory'),
      m('2003', 'Pakpak Bharat', 'Dimekarkan dari Dairi pada 28 Juli 2003, memakai nama sub-wilayah Pakpak, beribu kota Salak.', 'history', 'wPakpak'),
    ],
    traditions: [['sulangSilima', 'daerah', 'Adat Pakpak yang dahulu menjadi pembantu pemimpin kampung.']],
    foods: [['pelleng', 'daerah', 'Makanan khas masyarakat Pakpak.']],
    places: [sight('Pegunungan Bukit Barisan', 'Kabupaten ini berada di kakinya; ekonominya bertumpu pada pertanian dan perkebunan.', 'wPakpak')],
  },
  samosir: {
    lead: 'Pulau di tengah danau kaldera dan tepian di seberangnya: kampung Batak Toba, rumah beratap pelana, ulos, dan tortor.',
    people: people('Mayoritas dan penduduk asli Batak Toba; bahasa Toba menjadi bahasa sehari-hari. Ada sebagian kecil komunitas lain dan pendatang.', 'wSamosir'),
    timeline: [
      m('1956', 'Bagian Tapanuli Utara', 'Samosir menjadi salah satu dari lima kewedanaan Tapanuli Utara.', 'history', 'wSamosir'),
      m('2003', 'Undang-undang pembentukan', 'Kabupaten Samosir dibentuk dari Toba Samosir.', 'history', 'wSamosir'),
      m('2004', 'Diresmikan', 'Pemerintahan kabupaten diresmikan pada 7 Januari 2004, beribu kota Pangururan.', 'history', 'wSamosir'),
    ],
    traditions: [['tortor', 'daerah', 'Pertunjukan tortor disebut dalam wisata adat Samosir.'], ['ulos', 'daerah', 'Samosir disebut memiliki tempat pembuatan ulos.'], ['holi', 'komunitas', 'Upacara keluarga Batak Toba.'], ['dalihan', 'komunitas', 'Kerangka kekerabatan Batak Toba.']],
    foods: [['arsik', 'komunitas', 'Masakan yang lekat dengan kawasan Danau Toba.'], ['naniura', 'komunitas', 'Hidangan Batak Toba.']],
    places: [sight('Museum Huta Bolon Simanindo', 'Museum di Simanindo yang mengenalkan warisan Batak Toba.', 'wSamosir')],
  },
  'serdang-bedagai': {
    lead: 'Bekas tanah Kesultanan Serdang yang kini berjajar kampung budaya Melayu, Jawa, dan Banjar, sampai pantai-pantai Selat Malaka.',
    people: people('Keberadaan kampung budaya Melayu, Jawa, dan Banjar menunjukkan keragaman warganya.', 'wSergai'),
    timeline: [
      m('1894', 'Perbaungan dan masjidnya', 'Pusat Kesultanan Serdang dipindahkan ke Perbaungan, dan Masjid Raya Sulaimaniyah didirikan.', 'interpretation', 'sulaimaniyah'),
      m('2002 – 2003', 'Usulan pemekaran', 'DPRD provinsi dan kabupaten induk menyetujui pemekaran Deli Serdang.', 'history', 'wSergai'),
      m('2003', 'Kabupaten sendiri', 'Serdang Bedagai dibentuk lewat undang-undang 18 Desember 2003, beribu kota Sei Rampah.', 'history', 'wSergai'),
    ],
    traditions: [],
    foods: [],
    places: [
      sight('Replika Istana Kesultanan Serdang', 'Replika istana di Perbaungan.', 'wSergai'),
      sight('Kampung budaya', 'Kampung Budaya Melayu (Tanjung Beringin), Jawa (Kampung Ibus), dan Banjar (Lubuk Cemara).', 'wSergai'),
      sight('Pulau Berhala dan pantai timur', 'Pulau dan deretan pantai termasuk tujuan wisata alam.', 'wSergai'),
    ],
  },
  simalungun: {
    lead: 'Kabupaten luas dari tepi Danau Toba di Parapat sampai perkebunan di dataran rendah, tanah asal orang Simalungun dan kerajaan-kerajaannya.',
    people: people('Dikenal sebagai wilayah asal orang Batak Simalungun. Ada pula komunitas Batak lain dan banyak warga Jawa, serta Minangkabau, Aceh, Tionghoa, Melayu, Nias, Sunda, dan lainnya.', 'wSimalungun'),
    timeline: [
      m('Sebelum kemerdekaan', 'Tujuh kerajaan', 'Simalungun memiliki tujuh kerajaan, salah satunya Kerajaan Siantar.', 'history', 'wSiantar'),
      m('1907', 'Berakhirnya kekuasaan raja', 'Di bawah kekuasaan Belanda, pemerintahan raja-raja disebut berakhir.', 'history', 'wSiantar'),
    ],
    traditions: [['rondang', 'daerah', 'Tradisi masyarakat adat Simalungun.'], ['tortor', 'daerah', 'Artikel tortor menyebut Simalungun.']],
    foods: [['miGomak', 'daerah', 'Artikel mi gomak menyebut Parapat.']],
    places: [sight('Parapat', 'Gerbang ke Danau Toba di Kecamatan Girsang Sipangan Bolon, kecamatan dengan objek wisata terbanyak.', 'wSimalungun')],
  },
  'tapanuli-selatan': {
    lead: 'Tanah Angkola: Sipirok yang sejuk, tenun adat, rumah besar beratap ijuk, dan sawah yang digarap bergiliran.',
    people: people('Penduduk asli Batak Angkola, berbahasa Angkola, dengan garis marga dari ayah. Meski sering disamakan, Angkola dan Mandailing berbeda. Ada pula Toba dan Mandailing.', 'wTapsel'),
    timeline: [
      m('Masa lalu', 'Ibu kota di Padangsidimpuan', 'Kabupaten ini dahulu sangat luas dengan ibu kota Padangsidimpuan.', 'history', 'wTapsel'),
      m('1998 – 2007', 'Pemekaran', 'Mandailing Natal, Kota Padangsidimpuan, Padang Lawas Utara, dan Padang Lawas berdiri dari wilayah ini. Ibu kota kini di Sipirok.', 'history', 'wTapsel', 'wMadina'),
    ],
    traditions: [['marsialapari', 'komunitas', 'Gotong royong khas orang Angkola.'], ['dalihan', 'komunitas', 'Kerangka kekerabatan yang juga dikenal Angkola.'], ['tortor', 'daerah', 'Artikel tortor menyebut Tapanuli Selatan.']],
    foods: [['miGomak', 'daerah', 'Persebaran mi gomak disebut sampai Tapanuli Selatan.']],
    places: [sight('Sipirok', 'Ibu kota yang berhawa sejuk, dikenal dengan kerajinan tenun.', 'wTapsel'), sight('Aek Sijorni', 'Pemandian alam di Tapanuli Selatan.', 'wTapsel')],
  },
  'tapanuli-tengah': {
    lead: 'Pesisir barat dengan Barus, nama pelabuhan tua yang berabad-abad dikaitkan dengan kapur barus, dan budaya Pesisir berbahasa dialek Minang.',
    people: people('Mayoritas orang Batak, khususnya Toba, serta Orang Pesisir yang menuturkan bahasa berdialek Minangkabau. Ada pula komunitas Batak lain, Nias, Jawa, Aceh, Tionghoa, dan lainnya.', 'wTapteng'),
    timeline: [
      m('Berabad-abad lalu', 'Barus dan kompleks makam', 'Makam-makam tua berinskripsi di Barus menjadi bahan kajian sejarah; sebagian tafsirnya masih diperdebatkan.', 'interpretation', 'mahligai'),
      m('1956', 'Daerah otonom', 'Status Tapanuli Tengah dipertegas lewat Undang-Undang No. 7 Tahun 1956.', 'history', 'wTapteng'),
    ],
    traditions: [['sikambang', 'komunitas', 'Kesenian masyarakat Pesisir pantai barat.'], ['tortor', 'daerah', 'Artikel tortor menyebut Tapanuli Tengah.']],
    foods: [],
    places: [sight('Barus', 'Kawasan bersejarah tempat Kompleks Makam Mahligai berada.', 'mahligai')],
  },
  'tapanuli-utara': {
    lead: 'Lembah Silindung dan dataran Humbang: Tarutung sang kota wisata rohani, ombus-ombus hangat Siborongborong, dan tenun ulos.',
    people: people('Mayoritas Batak Toba.', 'wTaput'),
    timeline: [
      m('Masa Hindia Belanda', 'Afdeling Batak Landen', 'Tarutung menjadi ibu kota afdeling yang meliputi Silindung, Humbang, Toba, Samosir, dan Dairi dalam Keresidenan Tapanuli.', 'history', 'wTaput'),
      m('1945 – 1947', 'Awal Republik', 'Pada 1946 Kabupaten Tanah Batak terdiri atas lima wilayah; saat agresi militer 1947 ia dibagi menjadi empat kabupaten.', 'history', 'wTaput'),
      m('1964 – 2003', 'Pemekaran', 'Dairi, lalu Toba Samosir dan Humbang Hasundutan, berdiri dari wilayah yang semula sangat luas ini.', 'history', 'wTaput', 'wDairi', 'wHumbahas'),
      m('1993 – 1997', 'Salib Kasih', 'Monumen peringatan bagi Nommensen dibangun di bukit Siatas Barita.', 'history', 'salibKasihWiki'),
    ],
    traditions: [['tortor', 'daerah', 'Artikel tortor menyebut Tapanuli Utara.'], ['ulos', 'daerah', 'Ulos dipromosikan pemerintah daerah sebagai identitas budaya.'], ['holi', 'komunitas', 'Upacara keluarga Batak Toba.']],
    foods: [['ombus', 'daerah', 'Populer di Siborongborong.'], ['dali', 'komunitas', 'Olahan Batak Toba di Tapanuli.'], ['miGomak', 'daerah', 'Artikel mi gomak menyebut Tarutung.']],
    places: [sight('Huta Ginjang, Muara', 'Titik pandang di ketinggian sekitar 1.550 meter ke arah Danau Toba.', 'salibKasih'), sight('Aek Rangat dan air soda Parbubu', 'Pemandian air panas dan air soda di sekitar Tarutung.', 'salibKasih', 'tarutungWiki')],
  },
  toba: {
    lead: 'Tepi selatan danau terluas di Asia Tenggara: Balige dengan pasar beratap runcingnya dan kampung-kampung berbagai kelompok marga Toba.',
    people: people('Penduduk asli umumnya Batak Toba, dengan kelompok-kelompok marga yang menempati bagian wilayah berbeda. Ada pula komunitas lain.', 'wToba'),
    timeline: [
      m('1928', 'Balerong Balige', 'Los pasar berornamen dibangun pada masa kolonial.', 'history', 'balerong'),
      m('1998', 'Toba Samosir', 'Kabupaten Toba Samosir dibentuk, dimekarkan dari Tapanuli Utara.', 'history', 'wToba'),
      m('2003', 'Samosir berpisah', 'Kabupaten Samosir dimekarkan dari Toba Samosir.', 'history', 'wToba', 'wSamosir'),
      m('Setelahnya', 'Nama menjadi Toba', 'Nama kabupaten diubah menjadi Kabupaten Toba.', 'history', 'wToba'),
    ],
    traditions: [['ulos', 'komunitas', 'Adat Batak Toba.'], ['dalihan', 'komunitas', 'Kerangka kekerabatan Batak Toba.'], ['tortor', 'daerah', 'Artikel tortor menyebut Toba.'], ['holi', 'komunitas', 'Upacara keluarga Batak Toba.']],
    foods: [['miGomak', 'daerah', 'Persebarannya disebut meliputi Porsea, Balige, dan Laguboti.'], ['naniura', 'komunitas', 'Hidangan Batak Toba.'], ['arsik', 'komunitas', 'Masakan yang lekat dengan kawasan Danau Toba.']],
    places: [sight('Museum Batak TB Silalahi Center', 'Museum budaya Batak di Kabupaten Toba.', 'wToba'), sight('Bukit Tarabunga', 'Titik pandang ke Danau Toba.', 'wToba')],
  },
  'kota-binjai': {
    lead: 'Dari kampung di tepi Sungai Bingai yang dibuka di bawah pohon binjai, menjadi kota kereta dan kota rambutan di barat Medan.',
    people: people('Kota majemuk di antara bekas wilayah Kesultanan Deli dan Langkat.', 'wBinjai'),
    timeline: [
      m('Masa awal', 'Kampung di bawah pohon binjai', 'Menurut penuturan, upacara membuka kampung diadakan di bawah pohon binjai di tepi Sungai Bingai; namanya melekat pada kota. Kampung itu tumbuh menjadi bandar sungai. Ada pula versi lain tentang asal nama.', 'tradition', 'wBinjai'),
      m('1872', 'Perlawanan para datuk', 'Pertempuran melawan Belanda pada 17 Mei 1872 dijadikan hari jadi Kota Binjai. Beberapa datuk ditangkap pada Oktober tahun itu.', 'history', 'wBinjai'),
      m('1887', 'Kereta api datang', 'Stasiun Timbang Langkat dibuka oleh Deli Spoorweg Maatschappij.', 'history', 'binjaiStasiun'),
      m('2021', 'Lima cagar budaya', 'Wali kota menetapkan masjid raya, gedung pengadilan lama, stasiun, kuil, dan vihara sebagai cagar budaya.', 'contemporary', 'binjaiCagar'),
    ],
    traditions: [],
    foods: [],
    places: [sight('Lima bangunan cagar budaya', 'Masjid Raya, Gedung Kerapatan lama, Stasiun Binjai, Kuil Sri Mariamman, dan Vihara Setia Buddha.', 'binjaiCagar')],
  },
  'kota-gunungsitoli': {
    lead: 'Gerbang Pulau Nias: bandar tua di muara Sungai Nou yang kini menjadi rumah museum pusaka Nias.',
    people: people('Pada masa awal bandar Luaha disebut dihuni terutama oleh tiga marga: Harefa, Zebua, dan Telaumbanua (Sitölu Tua).', 'wGunungsitoli'),
    timeline: [
      m('Abad ke-16', 'Bandar Luaha', 'Gunungsitoli, yang juga disebut Luaha, disebut sudah dikenal dan dikunjungi di muara Sungai Nou.', 'history', 'wGunungsitoli'),
      m('1995', 'Museum Pusaka Nias', 'Museum didirikan untuk merawat warisan Nias.', 'history', 'wGunungsitoli'),
      m('2005', 'Gempa', 'Gempa merusak sebagian pajangan dan koleksi museum.', 'history', 'museumNiasRri'),
      m('2008', 'Kota otonom', 'Gunungsitoli diresmikan sebagai kota pada 26 November 2008.', 'history', 'wGunungsitoli'),
    ],
    traditions: [['maena', 'komunitas', 'Tarian bersama orang Nias.'], ['moyo', 'komunitas', 'Tarian Nias dengan versi antardaerah.']],
    foods: [],
    places: [sight('Gua Tögi Ndrawa', 'Gua kuno sekitar 3 km dari pusat kota.', 'wGunungsitoli'), sight('Muara Indah', 'Muara danau di Desa Afia, Gunungsitoli Utara.', 'wGunungsitoli')],
  },
  'kota-medan': {
    lead: 'Kota terbesar di Sumatra: istana Melayu, rumah saudagar Tionghoa, Kampung Keling, dan meja makan dari banyak perantauan.',
    people: people('Batak Karo pesisir dan Melayu disebut etnis asli. Kini kota dihuni berbagai komunitas Batak, Jawa, Tionghoa, Minangkabau, Melayu, Aceh, India, Nias, dan lainnya.', 'wMedanKota', 'medanWiki'),
    timeline: [
      m('1590 (diperingati)', 'Guru Patimpus', 'Pendirian awal kampung Medan dikaitkan dengan Guru Patimpus, seorang Karo.', 'tradition', 'medanWiki'),
      m('1860-an', 'Tembakau Deli', 'Perkebunan tembakau dibuka dan Medan tumbuh bersama ekonomi kolonial.', 'history', 'medanWiki'),
      m('1887 – 1892', 'Istana Maimun', 'Istana Kesultanan Deli dibangun.', 'history', 'maimun'),
      m('1909 (pernah)', 'Perdebatan hari jadi', 'Tanggal 1 April 1909 sempat diperingati sebagai hari jadi, lalu dikaji ulang oleh panitia sejarah pada 1971.', 'history', 'wMedanKota'),
    ],
    traditions: [],
    foods: [['sotoMedan', 'daerah', 'Hidangan yang membawa nama kota.'], ['bika', 'daerah', 'Kue khas Medan.'], ['ragamMedan', 'daerah', 'Gambaran dapur perantau di Medan.'], ['buburPedas', 'daerah', 'Disebut dihidangkan di Masjid Al-Osmani sejak 1870-an.'], ['napinadar', 'daerah', 'Disebut banyak dijumpai di Medan.']],
    places: [sight('Kampung Keling', 'Kawasan sekitar Jalan Zainul Arifin yang dikenal sebagai permukiman warga keturunan India.', 'wMedanKota')],
  },
  'kota-padangsidimpuan': {
    lead: 'Persinggahan pedagang ikan dan garam yang menjadi kota salak, dikelilingi perbukitan Tapanuli Selatan.',
    people: people('Penduduk asli Batak Angkola dan bahasa sehari-harinya Angkola. Kota ini juga dihuni berbagai komunitas Batak, Nias, Minangkabau, Jawa, dan Tionghoa.', 'wSidimpuan'),
    timeline: [
      m('Asal nama', 'Padang na dimpu', 'Dalam bahasa Angkola, namanya dijelaskan sebagai “hamparan luas di tempat tinggi”. Tempat ini persinggahan dagang antara Sibolga, Padang Bolak, dan Panyabungan.', 'interpretation', 'wSidimpuan'),
      m('Masa Perang Padri', 'Benteng awal', 'Pasukan pimpinan Tuanku Imam Lelo membangun benteng yang menjadi cikal bakal kota.', 'history', 'wSidimpuan'),
      m('1883 – 1906', 'Ibu kota keresidenan', 'Padangsidimpuan menjadi ibu kota Keresidenan Tapanuli sebelum pindah ke Sibolga.', 'history', 'wSidimpuan'),
      m('1948', 'Kunjungan Soekarno', 'Setahun setelah kunjungan Hatta, Presiden Soekarno berpidato di kota ini.', 'history', 'wSidimpuan'),
      m('2001', 'Kota otonom', 'Kota ini sebelumnya ibu kota Tapanuli Selatan (1948–2001).', 'history', 'wSidimpuan'),
    ],
    traditions: [['marsialapari', 'komunitas', 'Gotong royong yang dikenal masyarakat Angkola.']],
    foods: [['holat', 'daerah', 'Artikel holat menyebut Padangsidimpuan.']],
    places: [sight('Tugu Salak', 'Tugu yang menegaskan julukan Kota Salak.', 'wSidimpuan')],
  },
  'kota-pematangsiantar': {
    lead: 'Bekas pusat Kerajaan Siantar yang tumbuh menjadi kota lintasan menuju Danau Toba, dengan deru becak BSA.',
    people: people('Dihuni berbagai komunitas Batak termasuk Simalungun, serta Melayu, Jawa, Minangkabau, Tionghoa, dan lainnya.', 'wSiantar'),
    timeline: [
      m('1889 – 1904', 'Sang Naualuh Damanik', 'Raja terakhir dinasti Siantar yang disebut memerintah dari kawasan Pulau Holing.', 'history', 'wSiantar'),
      m('1907', 'Kontrolir pindah', 'Kontrolir Belanda dipindahkan ke Pematangsiantar dan pendatang bertambah.', 'history', 'wSiantar'),
      m('1917', 'Berstatus gemeente', 'Pada 1 Juli 1917 kota mendapat otonomi sebagai gemeente.', 'history', 'wSiantar'),
      m('1957', 'Kotapraja', 'Menjadi kotapraja penuh, terpisah dari rangkapan jabatan dengan Simalungun.', 'history', 'wSiantar'),
    ],
    traditions: [],
    foods: [['miGomak', 'daerah', 'Artikel mi gomak menyebut Pematangsiantar.']],
    places: [sight('Jalur ke Parapat', 'Kota berjarak sekitar 50 km dari Parapat di tepi Danau Toba.', 'wSiantar')],
  },
  'kota-sibolga': {
    lead: 'Kota sempit di Teluk Tapian Nauli, berawal dari bandar di pulau kecil, tempat bahasa Pesisir mempertemukan unsur Melayu, Batak, dan Minang.',
    people: people('Kota majemuk: berbagai komunitas Batak, Nias, Minangkabau, Jawa, dan Tionghoa. Bahasa sehari-harinya bahasa Pesisir (bahaso Baiko), ragam Melayu dengan pengaruh Batak dan Minangkabau.', 'wSibolga'),
    timeline: [
      m('Sekitar abad ke-18', 'Bandar Poncan Ketek', 'Bandar kecil di pulau selatan Sibolga, dirintis perantau Minangkabau. Orang Batak dari Silindung juga menetap di Sibolga pada abad ini.', 'history', 'wSibolga'),
      m('1837', 'Diambil alih Belanda', 'Poncan Ketek, yang sebelumnya di bawah pengawasan Inggris, diambil alih Belanda.', 'history', 'wSibolga'),
      m('1841', 'Pindah ke daratan', 'Belanda membangun bandar baru di lokasi Sibolga sekarang, dan penduduk pulau berpindah.', 'history', 'wSibolga'),
      m('1929', 'Bangunan air di bukit', 'Bangunan perusahaan air di puncak Tangga Seratus berasal dari tahun ini.', 'history', 'tanggaDetik', 'tanggaGnfi'),
    ],
    traditions: [['sikambang', 'daerah', 'Diteliti sebagai penanda identitas budaya Pesisir Sibolga.']],
    foods: [['miGomak', 'daerah', 'Artikel mi gomak menyebut Sibolga.']],
    places: [sight('Teluk Tapian Nauli', 'Teluk tempat kota ini membujur di pantai barat.', 'wSibolga')],
  },
  'kota-tanjungbalai': {
    lead: 'Balai di ujung tanjung tempat Sungai Silau bertemu Sungai Asahan, yang menjadi bandar dan pusat kesultanan.',
    people: people('Kota dagang yang multietnis. Orang Melayu disebut penduduk asli; komunitas Batak, Jawa, Tionghoa, dan lainnya juga lama menetap.', 'wTanjungbalai'),
    timeline: [
      m('Cerita nama', 'Balai di tanjung', 'Menurut cerita rakyat, namanya bermula dari sebuah balai di ujung tanjung yang ramai disinggahi orang yang hendak ke hulu sungai.', 'folklore', 'wTanjungbalai'),
      m('1620', 'Penobatan sultan pertama', 'Artikel kota menyebut Sultan Abdul Jalil dinobatkan di Kampung Tanjung pada 1620; artikel Asahan menyebut 1630.', 'interpretation', 'wTanjungbalai', 'wAsahan'),
      m('1883', 'Masjid Raya Sultan Ahmadsyah', 'Pembangunan masjid kesultanan dimulai.', 'history', 'ahmadsyah'),
      m('1946', 'Revolusi sosial', 'Pergolakan mengakhiri kekuasaan kesultanan-kesultanan Sumatra Timur.', 'history', 'ahmadsyah'),
    ],
    traditions: [['gubang', 'daerah', 'Sumber menyebut persebaran Gubang meliputi Tanjungbalai.']],
    foods: [['lautTanjungbalai', 'daerah', 'Daftar makanan khas kota.']],
    places: [sight('Pertemuan Sungai Silau dan Asahan', 'Titik asal kota di tepi sungai terpanjang di Sumatera Utara.', 'wTanjungbalai')],
  },
  'kota-tebing-tinggi': {
    lead: 'Dahulu bagian Kerajaan Padang dengan bandar sungai, kini kota persimpangan yang harum oleh lemang bakar.',
    people: people('Kota persimpangan yang majemuk di tengah wilayah Serdang Bedagai.', 'wTebing'),
    timeline: [
      m('Sebelum kota ada', 'Kerajaan Padang', 'Menurut penuturan seorang tetua, aliran Sungai Padang adalah wilayah Kerajaan Padang di bawah Kesultanan Deli, berpusat di Bandar Sakti yang menjadi pelabuhan sungai.', 'tradition', 'wTebing'),
      m('1887', 'Kota pemerintahan', 'Belanda menetapkan Tebing Tinggi sebagai kota pemerintahan, bersamaan dengan pembukaan perkebunan besar di sekitarnya.', 'history', 'wTebing'),
      m('1903', 'Daerah otonom', 'Ditetapkan sebagai kota kecil otonom.', 'history', 'wTebing'),
      m('13 Desember 1945', 'Peristiwa berdarah', 'Pertempuran melawan militer Jepang, yang masih diperingati.', 'history', 'wTebing'),
    ],
    traditions: [],
    foods: [['lemang', 'daerah', 'Identitas kuliner kota.'], ['kueKacang', 'daerah', 'Buah tangan kota.'], ['halua', 'komunitas', 'Manisan Melayu yang diuraikan dalam artikel kota ini.']],
    places: [sight('Deretan penjual lemang', 'Satu ruas jalan menjadi pusat penjualan lemang.', 'wTebing')],
  },
};
