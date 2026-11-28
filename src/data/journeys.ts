/**
 * Guided learning journeys. Each station shows researched material, then asks the visitor to do something
 * with it. A journey connects related topics; it never claims the cultures in it are one and the same.
 */
import type { Ask } from '../components/learn/questions';
import { mapAsk } from '../lib/quizBuilder';
import { AREAS } from './area-content';
import { CUSTOMS, FOODS, type Custom, type CustomId, type FoodId } from './heritage';
import { LANDMARKS } from './landmarks';
import { AREA_PHOTOS, HERITAGE_PHOTOS, type MediaItem } from './media';
import { photo, type PhotoId } from './photos';

export interface Side {
  title: string;
  points: string[];
  photo?: MediaItem;
}

export interface Station {
  title: string;
  /** Why this stop matters in the journey. */
  why: string;
  text: string[];
  photo?: MediaItem;
  compare?: [Side, Side];
  ask: Ask;
  more: { label: string; path: string; params?: Record<string, string> };
}

export interface Journey {
  id: string;
  title: string;
  promise: string;
  cover: MediaItem;
  stations: Station[];
}

const area = (id: string, n = 0) => AREA_PHOTOS[id][n];
const heritage = (id: string) => HERITAGE_PHOTOS[id];
const community = (id: PhotoId): MediaItem => ({ ...photo(id), relation: 'komunitas', verification: 'keterangan' });
const choice = (q: string, options: string[], answer: number, why: string): Ask => {
  const k = q.length % options.length;
  return { type: 'choice', q, options: options.map((_, i) => options[(i + k) % options.length]), answer: (answer - k + options.length) % options.length, why };
};
const steps = (q: string, id: CustomId, why: string): Ask => ({ type: 'order', q, items: (CUSTOMS[id] as Custom).practice!.map((label, i) => ({ label, when: `Tahap ${i + 1}` })), why });
const page = (id: string, label: string) => ({ label, path: '/wilayah', params: { id } });
const room = (id: string, label: string) => ({ label, path: '/alat-musik', params: { id } });
const foodText = (id: FoodId) => [FOODS[id].about, ('context' in FOODS[id] ? (FOODS[id] as { context: string }).context : '')].filter(Boolean);
const customText = (id: CustomId) => {
  const c = CUSTOMS[id] as Custom;
  return [c.about, c.meaning ?? ''].filter(Boolean);
};
const moment = (areaId: string, title: string) => AREAS[areaId].timeline.find((m) => m.title === title)!;

export const JOURNEYS: Journey[] = [
  {
    id: 'sejarah', title: 'Perjalanan sejarah', promise: 'Dari candi bata di pedalaman sampai kota pelabuhan dan jalur kereta.', cover: area('padang-lawas-utara'),
    stations: [
      { title: 'Candi di Padang Lawas', why: 'Menunjukkan bahwa sejarah provinsi ini berlapis, jauh sebelum batas kabupaten ada.', text: [moment('padang-lawas', 'Biaro-biaro Padang Lawas').text, moment('padang-lawas-utara', 'Candi Bahal').text], photo: area('padang-lawas'), ask: choice('Mengapa perkiraan usia candi diberi label penafsiran?', ['Masih kesimpulan peneliti yang berbeda antarsumber', 'Candinya belum dibangun', 'Karena candi hanyalah dongeng'], 0, 'Penafsiran bertumpu pada bukti, tetapi belum final.'), more: page('padang-lawas-utara', 'Jelajahi Candi Bahal') },
      { title: 'Bandar di muara Pulau Nias', why: 'Pelabuhan mempertemukan pulau dengan dunia luar.', text: [moment('kota-gunungsitoli', 'Bandar Luaha').text, 'Pada masa itu tiga marga disebut dominan: Harefa, Zebua, dan Telaumbanua.'], photo: area('kota-gunungsitoli'), ask: mapAsk('kota-gunungsitoli'), more: page('kota-gunungsitoli', 'Buka Gunungsitoli') },
      { title: 'Bandar yang berpindah', why: 'Satu keputusan kolonial mengubah letak sebuah kota.', text: [moment('kota-sibolga', 'Bandar Poncan Ketek').text, moment('kota-sibolga', 'Pindah ke daratan').text], photo: area('kota-sibolga'), ask: { type: 'order', q: 'Urutkan perjalanan bandar Sibolga.', items: [{ label: 'Bandar kecil di Pulau Poncan Ketek', when: 'Sekitar abad ke-18' }, { label: 'Diambil alih Belanda', when: '1837' }, { label: 'Bandar baru dibangun di daratan', when: '1841' }], why: 'Bandar pulau diambil alih dulu, baru kemudian dipindahkan ke daratan.' }, more: page('kota-sibolga', 'Naik ke Tangga Seratus') },
      { title: 'Tembakau, perlawanan, dan rel', why: 'Ekonomi kolonial membawa kota, kereta, sekaligus perlawanan.', text: [moment('kota-medan', 'Tembakau Deli').text, moment('kota-binjai', 'Perlawanan para datuk').text, moment('kota-binjai', 'Kereta api datang').text], photo: area('kota-binjai', 3), ask: { type: 'order', q: 'Mana yang lebih dulu? Urutkan.', items: [{ label: 'Perkebunan tembakau Deli dibuka', when: '1860-an' }, { label: 'Pertempuran para datuk di Binjai', when: '1872' }, { label: 'Stasiun Timbang Langkat dibuka', when: '1887' }], why: 'Perkebunan dibuka lebih dulu, lalu perlawanan 1872, kemudian kereta pada 1887.' }, more: page('kota-binjai', 'Buka Stasiun Binjai') },
    ],
  },
  {
    id: 'arsitektur', title: 'Arsitektur dan bangunan', promise: 'Bandingkan rumah adat, balai, dan bangunan kota.', cover: community('karo-house'),
    stations: [
      { title: 'Rumah delapan rumah tangga', why: 'Bentuk rumah bisa mengatur cara hidup bersama.', text: ['Siwaluh jabu adalah rumah panggung Karo dengan dinding miring ke luar. Namanya merujuk pada delapan rumah tangga di bawah satu atap; adat menandai batas ruang yang secara tradisi tidak berdinding.'], photo: community('karo-house'), ask: choice('Apa yang secara tradisi menandai batas ruang di siwaluh jabu?', ['Adat', 'Dinding beton', 'Pagar besi'], 0, 'Penempatan keluarga diatur adat.'), more: page('karo', 'Masuk ke diorama Karo') },
      { title: 'Rumah raja dan balai warga', why: 'Dua bangunan berseberangan, dua peran.', text: ['Di Mandailing, Bagas Godang adalah kediaman raja adat yang juga menjadi tempat upacara dan perlindungan. Sopo Godang, balai tanpa dinding di seberang halaman, dipakai untuk musyawarah, peradilan adat, pertunjukan, dan belajar.'], compare: [{ title: 'Bagas Godang', points: ['Kediaman raja adat', 'Bisa menjadi tempat berlindung warga'] }, { title: 'Sopo Godang', points: ['Terbuka tanpa dinding', 'Tempat musyawarah dan belajar'] }], ask: choice('Rapat warga paling sesuai diadakan di…', ['Sopo Godang', 'Bagas Godang', 'Hombo batu'], 0, 'Sopo Godang adalah balai musyawarah.'), more: page('mandailing-natal', 'Buka huta Mandailing') },
      { title: 'Rumah yang menghadapi gempa', why: 'Pengetahuan membangun lahir dari tempat tinggal.', text: ['Rumah tradisional Nias bertumpu pada tiang tegak dan miring tanpa paku. Sesudah gempa 2004–2005, penelitian mendapati rumah-rumah itu umumnya bertahan baik.'], photo: community('nias-house'), compare: [{ title: 'Omo sebua', points: ['Rumah besar pemimpin', 'Tiang sangat besar, atap tinggi'] }, { title: 'Omo hada', points: ['Rumah warga', 'Alas tiang bertumpu di atas batu'] }], ask: choice('Apa yang membantu rumah Nias saat gempa menurut penelitian?', ['Tiang tegak dan miring tanpa paku', 'Dinding bata tebal', 'Atap beton'], 0, 'Susunan tiang memberi kelenturan.'), more: page('nias-utara', 'Lihat omo hada') },
      { title: 'Stasiun bergaya Indis', why: 'Arsitektur juga menyimpan sejarah kota modern.', text: [LANDMARKS['kota-binjai'].why, 'Gayanya digambarkan sebagai arsitektur Indis, perpaduan unsur Eropa dan setempat.'], photo: area('kota-binjai'), ask: { type: 'photo', q: 'Foto mana yang memperlihatkan stasiun?', photos: [area('kota-binjai'), area('langkat'), area('padang-lawas-utara')].map((p) => ({ file: p.file, alt: p.alt })), answer: 0, why: 'Kanopi, jendela berkisi, dan halaman ramai adalah wajah Stasiun Binjai.' }, more: page('kota-binjai', 'Buka Binjai') },
    ],
  },
  {
    id: 'kuliner', title: 'Ragam kuliner', promise: 'Cicipi lewat bahan dan cara masak, dari tepi danau sampai pesisir.', cover: heritage('arsik'),
    stations: [
      { title: 'Dua ikan, dua cara', why: 'Bahan serupa bisa diperlakukan sangat berbeda.', text: ['Arsik dan naniura sama-sama sering memakai ikan mas dan andaliman.'], compare: [{ title: 'Arsik', points: FOODS.arsik.steps, photo: heritage('arsik') }, { title: 'Naniura', points: FOODS.naniura.steps }], ask: choice('Hidangan mana yang tidak dimasak dengan api?', ['Naniura', 'Arsik', 'Dua-duanya direbus'], 0, 'Naniura “dimatangkan” bumbu asam.'), more: page('samosir', 'Jelajahi Samosir') },
      { title: 'Kaldu dari kulit pohon', why: 'Dapur setempat mengenal bahan dari lingkungannya.', text: foodText('holat'), ask: { type: 'order', q: 'Urutkan pembuatan kuah holat.', items: FOODS.holat.steps.map((label, i) => ({ label, when: `Langkah ${i + 1}` })), why: 'Kaldu dibuat dulu, dibumbui, lalu disiramkan ke ikan.' }, more: page('padang-lawas-utara', 'Buka Padang Lawas Utara') },
      { title: 'Makanan yang membawa doa', why: 'Makanan bisa menjadi cara menyampaikan harapan.', text: foodText('pelleng'), photo: heritage('pelleng'), ask: choice('Pelleng dihidangkan antara lain saat…', ['Melepas anak merantau', 'Lomba balap', 'Panen garam'], 0, 'Disertai nasihat dan doa.'), more: page('pakpak-bharat', 'Buka Pakpak Bharat') },
      { title: 'Pasar menjelang Ramadan', why: 'Kuliner juga berupa waktu dan tempat berkumpul.', text: customText('pestaTapai'), photo: area('batu-bara'), ask: mapAsk('batu-bara'), more: page('batu-bara', 'Buka Batu Bara') },
      { title: 'Meja makan kota perantau', why: 'Kota majemuk punya dapur majemuk.', text: [...foodText('ragamMedan'), ...foodText('sotoMedan')], photo: heritage('sotoMedan'), ask: choice('Mengapa kuliner Medan begitu beragam?', ['Dibawa perantau dari banyak komunitas', 'Hanya ada satu komunitas', 'Semua resepnya baru dibuat kemarin'], 0, 'Para perantau membawa dapurnya.'), more: page('kota-medan', 'Buka Medan') },
    ],
  },
  {
    id: 'musik', title: 'Alat musik tradisional', promise: 'Pelajari cara memukul dan memetik, lalu praktikkan di ruang 3D.', cover: heritage('i_gordang'),
    stations: [
      { title: 'Sembilan gendang', why: 'Ukuran menentukan nada.', text: ['Gordang Sambilan Mandailing terdiri atas sembilan gendang bertingkat yang dipukul dengan pemukul kayu, biasanya oleh enam pemain.'], photo: heritage('i_gordang'), ask: choice('Mengapa nada tiap gendang berbeda?', ['Panjang dan diameternya berbeda', 'Warnanya berbeda', 'Dimainkan pada hari berbeda'], 0, 'Ukuran bertingkat menghasilkan nada bertingkat.'), more: room('gordang', 'Pukul Gordang Sambilan') },
      { title: 'Memukul atau memetik?', why: 'Cara menghasilkan bunyi membedakan keluarga alat musik.', text: ['Taganing dipukul dengan dua stik. Hasapi, lute dua senar, dipetik.'], compare: [{ title: 'Taganing', points: ['Lima gendang', 'Dipukul palu-palu', 'Membawa melodi'] }, { title: 'Hasapi', points: ['Dua senar', 'Dipetik', 'Ende melodi, doal ritme'], photo: heritage('i_hasapi') }], ask: choice('Alat yang dimainkan dengan dipetik adalah…', ['Hasapi', 'Taganing', 'Göndra'], 0, 'Hasapi adalah alat dawai.'), more: room('hasapi', 'Petik Hasapi') },
      { title: 'Satu gong, dua warna bunyi', why: 'Titik pukul mengubah suara.', text: ['Aramba, gong dari Nias, umumnya dipukul pada tonjolan tengah. Memukul sisinya menghasilkan bunyi yang berbeda.'], ask: choice('Bagian aramba yang umumnya dipukul adalah…', ['Tonjolan tengah', 'Tali gantung', 'Tiang rangka'], 0, 'Sisinya memberi bunyi lain.'), more: room('aramba', 'Pukul Aramba') },
      { title: 'Gendang yang digantung', why: 'Sikap tubuh pemain bagian dari cara bermain.', text: ['Göndra Nias adalah gendang dua sisi yang digantung setinggi sekitar 150–180 cm dan dipukul dengan dua bilah bambu. Ia mengiringi aramba, antara lain pada pesta pernikahan.'], ask: choice('Pemukul göndra dibuat dari…', ['Bilah bambu', 'Besi', 'Tanduk'], 0, 'Namanya bözibözi göndra.'), more: room('gondra', 'Mainkan Göndra') },
    ],
  },
  {
    id: 'tradisi', title: 'Tradisi dan kehidupan bersama', promise: 'Gotong royong, upacara keluarga, dan pesta tani, langkah demi langkah.', cover: heritage('ulos'),
    stations: [
      { title: 'Bergiliran di sawah', why: 'Tenaga yang diterima dibalas dengan tenaga.', text: customText('marsialapari'), ask: steps('Urutkan jalannya marsialapari.', 'marsialapari', 'Giliran berpindah sampai semua anggota terbantu.'), more: page('mandailing-natal', 'Buka Mandailing Natal') },
      { title: 'Memberi ulos', why: 'Benda menjadi bahasa kasih dan hubungan kerabat.', text: customText('ulos'), photo: heritage('ulos'), ask: choice('Apa yang menentukan cara pemberian ulos?', ['Hubungan kekerabatan', 'Harga kain di pasar', 'Cuaca hari itu'], 0, 'Mangulosi mengikuti hubungan kekerabatan.'), more: page('toba', 'Buka Toba') },
      { title: 'Menghormati leluhur', why: 'Upacara keluarga yang sakral perlu dipahami dengan hormat.', text: customText('holi'), photo: heritage('holi'), ask: steps('Urutkan garis besar mangongkal holi.', 'holi', 'Musyawarah dan doa mendahului pemindahan tulang ke tugu.'), more: page('samosir', 'Buka Samosir') },
      { title: 'Syukur sesudah menanam', why: 'Kalender tani melahirkan pesta.', text: [...customText('kerjaTahun'), ...customText('rondang')], compare: [{ title: 'Kerja tahun (Karo)', points: ['Umumnya sesudah menanam padi', 'Dimeriahkan guro-guro aron'] }, { title: 'Rondang Bintang (Simalungun)', points: ['Antara lain sesudah panen raya', 'Juga ajang muda-mudi'] }], ask: choice('Rondang Bintang adalah tradisi masyarakat…', ['Simalungun', 'Karo', 'Nias'], 0, 'Dua pesta ini milik komunitas yang berbeda.'), more: page('simalungun', 'Buka Simalungun') },
    ],
  },
  {
    id: 'nias', title: 'Jelajah Kepulauan Nias', promise: 'Batu, rumah, tari, dan pantai dari lima daerah di Nias.', cover: heritage('fahombo'),
    stations: [
      { title: 'Lima daerah, satu pulau induk', why: 'Mengenal letak sebelum mengenal budaya.', text: ['Pulau Nias dan sekitarnya terbagi atas Kabupaten Nias, Nias Selatan, Nias Utara, Nias Barat, dan Kota Gunungsitoli. Orang Nias, Ono Niha, punya bahasa dan warisan sendiri.'], ask: mapAsk('nias-selatan'), more: page('nias', 'Buka Kabupaten Nias') },
      { title: 'Lompat batu', why: 'Tradisi bisa berubah fungsi seiring zaman.', text: customText('fahombo'), photo: heritage('fahombo'), ask: choice('Dahulu fahombo menjadi penanda…', ['Kedewasaan dan kesiapan menjadi prajurit', 'Awal musim durian', 'Pembukaan pasar'], 0, 'Kini lebih banyak hadir sebagai pertunjukan.'), more: page('nias-selatan', 'Masuk permukiman batu') },
      { title: 'Elang yang menari', why: 'Alam menjadi sumber gerak.', text: customText('moyo'), photo: heritage('moyo') ?? area('nias'), ask: choice('Gerak Tari Moyo terilham dari…', ['Elang', 'Ikan', 'Kerbau'], 0, 'Moyo berarti elang.'), more: page('nias', 'Lihat Tari Moyo') },
      { title: 'Menari bersama', why: 'Ada tarian yang mengundang semua orang.', text: customText('maena'), photo: heritage('maena'), ask: choice('Siapa yang boleh ikut Maena?', ['Siapa saja, tanpa batas jumlah', 'Hanya sembilan orang', 'Hanya anak-anak'], 0, 'Ia melambangkan kebersamaan.'), more: page('kota-gunungsitoli', 'Buka Gunungsitoli') },
      { title: 'Batu yang menandai kedudukan', why: 'Peninggalan batu terkait pesta besar masa lalu.', text: customText('owasa'), photo: heritage('owasa'), ask: choice('Mengapa pendataan megalit penting?', ['Agar yang rusak atau hilang bisa diketahui dan dicegah', 'Agar batu bisa dijual', 'Agar batu bisa dipindah sesukanya'], 0, 'Pendataan adalah dasar pelindungan.'), more: page('nias-barat', 'Buka megalit Baladano') },
    ],
  },
  {
    id: 'kerajinan', title: 'Kerajinan dan karya tangan', promise: 'Kain, ukiran, dan batu, beserta orang yang merawatnya.', cover: community('ulos-weaving'),
    stations: [
      { title: 'Tenun Sipirok', why: 'Alat bukan mesin menghasilkan kain adat.', text: ['Penenun Sipirok menghasilkan antara lain abit godang dan parompa sadun dengan alat tenun bukan mesin. Keduanya dipakai dalam upacara adat.'], ask: choice('Kain adat dari tenun Sipirok antara lain…', ['Abit godang', 'Kain sutra Tiongkok', 'Kain wol'], 0, 'Abit godang dan parompa sadun.'), more: page('tapanuli-selatan', 'Lihat alat tenun 3D') },
      { title: 'Gorga', why: 'Ukiran menghidupi rumah dan pengukirnya.', text: ['Gorga adalah seni ukir hias Batak Toba yang dikenal dengan warna merah, putih, dan hitam. Pengukir gorga dan penenun ulos pernah didukung proyek pemulihan UNESCO sesudah pandemi; itu bukan pencantuman warisan dunia.'], photo: community('gorga-house'), ask: choice('Dukungan proyek UNESCO tersebut berarti…', ['Proyek pemulihan, bukan pencantuman dalam daftar warisan', 'Gorga resmi Situs Warisan Dunia', 'Gorga dilarang dibuat'], 0, 'Pelindungan proyek berbeda dari pencantuman.'), more: page('samosir', 'Buka Samosir') },
      { title: 'Patung mejan', why: 'Karya batu menyimpan identitas dan perlu dilindungi.', text: ['Mejan adalah patung batu berwujud penunggang gajah atau kuda, dimaknai sebagai lambang kepahlawanan. Banyak yang dilaporkan rusak atau hilang.'], photo: area('pakpak-bharat'), ask: { type: 'photo', q: 'Foto mana yang memperlihatkan mejan?', photos: [area('tapanuli-tengah'), area('pakpak-bharat'), area('padang-lawas-utara')].map((p) => ({ file: p.file, alt: p.alt })), answer: 1, why: 'Mejan adalah arca batu; dua foto lain memperlihatkan nisan dan candi.' }, more: page('pakpak-bharat', 'Buka Pakpak Bharat') },
    ],
  },
  {
    id: 'cerita', title: 'Cerita dan sejarah, jangan tertukar', promise: 'Latih membedakan cerita tutur, penafsiran, dan catatan.', cover: community('toba-panorama'),
    stations: [
      { title: 'Asal Danau Toba', why: 'Legenda dan geologi menjawab pertanyaan yang berbeda.', text: ['Sebuah legenda menceritakan lelaki bernama Toba, perempuan yang semula ikan, janji yang dilanggar, dan anak bernama Samosir. Geologi menjelaskan danau ini menempati kaldera akibat letusan sangat besar.'], photo: community('toba-panorama'), ask: choice('Penjelasan tentang kaldera tergolong…', ['Sejarah alam yang didukung penelitian', 'Cerita rakyat', 'Resep'], 0, 'Legenda tetap bernilai sebagai budaya, bukan penjelasan geologi.'), more: page('samosir', 'Buka Samosir') },
      { title: 'Balai di ujung tanjung', why: 'Nama tempat sering dibawa cerita.', text: [moment('kota-tanjungbalai', 'Balai di tanjung').text], photo: area('kota-tanjungbalai'), ask: choice('Cerita asal nama Tanjungbalai diberi label…', ['Cerita rakyat', 'Hasil ukur satelit', 'Peraturan pemerintah'], 0, 'Sumbernya sendiri menyebutnya cerita rakyat.'), more: page('kota-tanjungbalai', 'Buka Tanjungbalai') },
      { title: 'Nelayan dan angin', why: 'Seni sering punya kisah kelahiran.', text: customText('gubang'), photo: heritage('gubang'), ask: choice('Kisah nelayan yang meminta angin sebaiknya dipahami sebagai…', ['Legenda lisan tentang asal tarian', 'Laporan cuaca resmi', 'Data sensus'], 0, 'Itu legenda yang dituturkan.'), more: page('asahan', 'Buka Asahan') },
      { title: 'Pancuran Putri Hijau', why: 'Menghormati kepercayaan tanpa menganggapnya bukti.', text: ['Di Benteng Putri Hijau ada dua pancuran. Sebagian pengunjung percaya airnya berkhasiat; hal itu tidak terbukti secara medis.'], photo: area('deli-serdang'), ask: choice('Sikap yang tepat terhadap kepercayaan ini adalah…', ['Menghormatinya sebagai kepercayaan, bukan fakta medis', 'Menjadikannya resep dokter', 'Mengejek yang percaya'], 0, 'Kepercayaan dan bukti medis berbeda.'), more: page('deli-serdang', 'Buka Deli Serdang') },
    ],
  },
];

export const journeyById = (id: string | null) => JOURNEYS.find((j) => j.id === id);
