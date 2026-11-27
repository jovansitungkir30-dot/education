import type { PhotoId } from './photos';
import type { SourceId } from './sources';

export const THEMES = ['Rumah adat', 'Busana dan kain', 'Tari', 'Musik', 'Upacara', 'Kuliner', 'Seni dan kerajinan'] as const;
export type Theme = (typeof THEMES)[number];

export interface GalleryItem {
  id: PhotoId;
  title: string;
  theme: Theme;
  origin: string;
  context: string;
  learn: string;
  related: PhotoId[];
  sources: SourceId[];
}

export const GALLERY: GalleryItem[] = [
  { id: 'gorga-house', title: 'Gorga pada rumah Toba', theme: 'Seni dan kerajinan', origin: 'Batak Toba, Samosir', context: 'Ornamen ukir dan lukis di bagian depan rumah.', learn: 'Perhatikan garis mengalir yang berulang serta warna merah, putih, dan hitam. Makna tiap motif perlu dicek pada pengetahuan setempat.', related: ['simalungun-house', 'mandailing-house'], sources: ['unescoUlosProject'] },
  { id: 'karo-house', title: 'Siwaluh jabu', theme: 'Rumah adat', origin: 'Karo, Lingga', context: 'Rumah besar yang dihuni bersama beberapa rumah tangga.', learn: 'Arsitekturnya dulu juga menjadi peta sosial: adat menentukan tempat tinggal tiap rumah tangga. Kajian tahun 2020 menemukan penempatan ini sudah tidak dijalankan di Lingga.', related: ['gorga-house', 'nias-house'], sources: ['karoSpace'] },
  { id: 'mandailing-house', title: 'Bagas Godang', theme: 'Rumah adat', origin: 'Mandailing, Huta Godang', context: 'Rumah raja adat di lingkungan kampung.', learn: 'Pahami bersama balai Sopo Godang dan halaman terbukanya: ketiganya bekerja sebagai satu pusat kehidupan warga.', related: ['gordang-sambilan', 'simalungun-house'], sources: ['mandailingBuildings'] },
  { id: 'simalungun-house', title: 'Rumah Bolon di Pematang Purba', theme: 'Rumah adat', origin: 'Simalungun', context: 'Bagian dari kompleks bekas keluarga raja.', learn: 'Nama “Rumah Bolon” dipakai lebih dari satu komunitas. Bangunan Simalungun ini berbeda dari contoh di Toba.', related: ['gorga-house', 'karo-house'], sources: ['simalungunOrnament'] },
  { id: 'nias-house', title: 'Rumah di Bawomataluo', theme: 'Rumah adat', origin: 'Nias Selatan', context: 'Arsitektur kayu di permukiman yang dikenal dengan karya batu monumental.', learn: 'Amati tinggi atapnya serta hubungan antara rumah dan pelataran batu.', related: ['nias-hombo', 'nias-dance'], sources: ['unescoBawomataluo', 'niasQuake'] },
  { id: 'ulos-weaving', title: 'Menenun ulos', theme: 'Busana dan kain', origin: 'Tradisi tenun Batak', context: 'Kain terbentuk helai demi helai di alat tenun tradisional.', learn: 'Nilai ulos menyatukan kerja terampil dengan hubungan kekerabatan tempat kain itu kelak diberikan.', related: ['ulos-museum', 'tortor'], sources: ['unescoUlosProject'] },
  { id: 'ulos-museum', title: 'Ulos koleksi museum', theme: 'Busana dan kain', origin: 'Batak, Sumatra bagian utara (abad ke-20)', context: 'Kain upacara koleksi Honolulu Museum of Art.', learn: 'Museum menjaga bendanya, sedangkan makna upacaranya hidup di tengah komunitas.', related: ['ulos-weaving'], sources: ['ulosEncyclopedia'] },
  { id: 'karo-wedding', title: 'Busana pengantin Karo', theme: 'Busana dan kain', origin: 'Karo', context: 'Sepasang pengantin berbusana adat pada pernikahan mereka.', learn: 'Bandingkan penutup kepala dan lapisan kainnya dengan busana komunitas lain, jangan dianggap satu gaya yang sama.', related: ['angkola-tortor', 'ulos-weaving'], sources: ['uisKaro'] },
  { id: 'tortor', title: 'Tortor', theme: 'Tari', origin: 'Tradisi Batak', context: 'Sekelompok penari membawakan tortor.', learn: 'Dalam upacara, tortor bersifat relasional: ditarikan bersama musik dan bersama orang lain, bukan hanya untuk penonton.', related: ['gondang', 'angkola-tortor'], sources: ['gondangRitual'] },
  { id: 'angkola-tortor', title: 'Tortor dalam pernikahan', theme: 'Upacara', origin: 'Tapanuli bagian selatan', context: 'Pengantin menari dalam pernikahan adat. Menurut fotografernya, ini bagian dari perayaan adat terbesar di daerah Tapanuli bagian selatan.', learn: 'Upacara mempertemukan peran kekerabatan, busana, musik, dan gerak.', related: ['tortor', 'mandailing-house'], sources: ['dalihanCore'] },
  { id: 'nias-dance', title: 'Tari perang di Bawomataluo', theme: 'Tari', origin: 'Nias Selatan', context: 'Para penampil berkostum dengan perisai.', learn: 'Kini tarian ini dibawakan sebagai ekspresi budaya. Citra keprajuritannya bagian dari sejarah dan tidak boleh dipakai untuk menggambarkan orang masa kini.', related: ['nias-hombo', 'nias-house'], sources: ['niasMinistry'] },
  { id: 'nias-hombo', title: 'Hombo batu', theme: 'Upacara', origin: 'Nias Selatan', context: 'Seorang pelompat melewati susunan batu yang tinggi.', learn: 'Sebuah tradisi dapat berubah tujuan seiring waktu dan tetap menjadi penanda identitas.', related: ['nias-dance', 'nias-house'], sources: ['hombo'] },
  { id: 'gondang', title: 'Alat musik gondang sabangunan', theme: 'Musik', origin: 'Batak Toba', context: 'Alat musik yang dipamerkan di National Museum of Ethnology, Osaka.', learn: 'Kenali kelompok bunyinya: gendang bernada, gong, dan alat tiup berlidah.', related: ['tortor', 'gordang-sambilan'], sources: ['taganing', 'gondangRitual'] },
  { id: 'gordang-sambilan', title: 'Gordang Sambilan', theme: 'Musik', origin: 'Mandailing', context: 'Sembilan gendang dengan ukuran bertingkat.', learn: 'Berbeda dari gondang sabangunan Toba walaupun sama-sama memakai kata untuk gendang.', related: ['gondang', 'mandailing-house'], sources: ['gordang'] },
  { id: 'arsik', title: 'Arsik', theme: 'Kuliner', origin: 'Tradisi masak Batak', context: 'Ikan berbumbu yang dimasak sampai bumbunya meresap.', learn: 'Resepnya beragam: ada yang menonjolkan andaliman, sedangkan versi Karo disebut memakai kecombrang.', related: ['ulos-weaving'], sources: ['arsik', 'andaliman'] },
  { id: 'maimun', title: 'Istana Maimun', theme: 'Rumah adat', origin: 'Melayu Deli, Medan', context: 'Istana Kesultanan Deli yang terbuka bagi pengunjung.', learn: 'Warisan Medan mencakup budaya istana Melayu di samping banyak komunitas lain.', related: ['tjong-a-fie'], sources: ['maimun'] },
  { id: 'tjong-a-fie', title: 'Rumah Tjong A Fie', theme: 'Rumah adat', origin: 'Warisan Tionghoa Indonesia, Medan', context: 'Kediaman saudagar yang kini menjadi museum.', learn: 'Gaya arsitekturnya yang campuran mencerminkan sejarah kota yang majemuk.', related: ['maimun'], sources: ['medanSites'] },
];
