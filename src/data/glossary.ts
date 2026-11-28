/** Local terms that appear in an area's material. Each rests on the same references as the facts. */
import type { SourceId } from './sources';

export interface Term {
  term: string;
  meaning: string;
  sources: SourceId[];
}

const t = (term: string, meaning: string, ...sources: SourceId[]): Term => ({ term, meaning, sources });

const BIARO = t('Biaro', 'Sebutan setempat untuk candi di kawasan Padang Lawas.', 'sipamutung', 'bahalWiki');
const ULOS = t('Ulos', 'Kain tenun yang dipakai sehari-hari dan dalam upacara komunitas Batak Toba.', 'ulosEncyclopedia', 'ulosStudy');
const DALIHAN = t('Dalihan Na Tolu', 'Tiga kedudukan kekerabatan yang saling bergantung dan mengatur peran dalam upacara.', 'dalihanCore');
const SUAK = t('Silima Suak', 'Lima wilayah adat Pakpak: Simsim, Keppas, Pegagan, Kelasen, dan Boang.', 'pakpakSuak');

export const GLOSSARY: Record<string, Term[]> = {
  'batu-bara': [t('Nazar', 'Janji yang dipenuhi bila suatu harapan terkabul. Pembangunan istana dikisahkan sebagai pemenuhan nazar.', 'limaLaras')],
  dairi: [SUAK, t('Pelleng', 'Makanan yang disebut khas Pakpak.', 'pakpakSuak')],
  karo: [
    t('Siwaluh jabu', 'Rumah adat Karo; namanya merujuk pada delapan rumah tangga di bawah satu atap.', 'karoSpace'),
    t('Uis nipes', 'Kain tenun tipis yang dipakai perempuan Karo pada acara adat.', 'uisKaro'),
    t('Beka buluh', 'Kain berdasar merah yang antara lain dipakai sebagai penutup kepala pengantin laki-laki.', 'uisKaro'),
  ],
  'kota-gunungsitoli': [t('Ono Niha', 'Sebutan orang Nias untuk diri mereka.', 'museumNias')],
  'kota-sibolga': [t('Sikambang', 'Kesenian yang diteliti sebagai penanda identitas budaya Pesisir.', 'sikambang')],
  'kota-tanjungbalai': [t('Pucuk rebung', 'Motif berbentuk tunas bambu; pada masjid ini diukirkan di tepi atap.', 'ahmadsyah')],
  'kota-tebing-tinggi': [t('Lemang', 'Ketan bersantan yang dimasak dalam ruas bambu beralas daun pisang.', 'lemangStudi')],
  'mandailing-natal': [
    t('Bagas Godang', 'Rumah panggung kediaman raja adat Mandailing.', 'mandailingBuildings'),
    t('Sopo Godang', 'Balai terbuka tempat musyawarah, peradilan adat, pertunjukan, dan belajar.', 'mandailingBuildings'),
    t('Bindu', 'Ornamen segitiga di muka atap yang dimaknai sebagai lambang Dalihan Na Tolu.', 'mandailingBuildings'),
    t('Gordang Sambilan', 'Ansambel sembilan gendang berukuran bertingkat yang penggunaannya diatur adat.', 'gordang'),
  ],
  nias: [t('Moyo', 'Elang. Tari Moyo meniru kepak sayapnya.', 'tariMoyo'), t('Gondra', 'Alat musik yang termasuk pengiring Tari Moyo.', 'tariMoyo')],
  'nias-barat': [t('Behu', 'Salah satu jenis batu tegak megalitik di Nias.', 'baladano'), t('Daro-daro', 'Salah satu jenis batu datar megalitik di Nias.', 'baladano')],
  'nias-selatan': [
    t('Omo sebua', 'Rumah besar para pemimpin, bertiang kayu sangat besar dan beratap curam.', 'omoSebua'),
    t('Fahombo (hombo batu)', 'Tradisi lompat batu yang terutama terkait dengan Nias Selatan.', 'hombo'),
    t('Maena', 'Pertunjukan bersama yang dikaji dalam upacara pernikahan Falöwa.', 'niasMaena'),
  ],
  'nias-utara': [t('Omo hada', 'Rumah tradisional warga, berbeda dari omo sebua milik pemimpin.', 'omoHada', 'omoSebua')],
  'padang-lawas': [BIARO],
  'padang-lawas-utara': [BIARO, t('Portibi', 'Nama kawasan candi; dikaitkan dengan kata prithivi yang berarti bumi. Ini penafsiran.', 'bahalWiki')],
  'pakpak-bharat': [t('Mejan', 'Patung batu berwujud orang menunggang gajah atau kuda.', 'mejanUgm'), SUAK, t('Sulang Silima', 'Lima unsur kekerabatan Pakpak yang terlibat dalam keputusan adat.', 'pakpakSuak')],
  samosir: [t('Gorga', 'Seni ukir hias Batak Toba.', 'unescoUlosProject'), ULOS],
  simalungun: [
    t('Habonaron do bona', '“Kebenaran adalah pokok”, ungkapan yang digambarkan sebagai falsafah penuntun.', 'simalungunAdat'),
    t('Tolu Sahundulan', 'Tiga kedudukan kerabat: tondong, sanina, dan boru.', 'simalungunAdat'),
    t('Dayok binatur', 'Ayam yang ditata teratur dan disajikan bersama nasihat pada acara adat.', 'simalungunAdat'),
  ],
  'tapanuli-selatan': [
    t('Abit godang', 'Kain adat tenunan Sipirok yang dipakai dalam upacara.', 'sipirokTenun'),
    t('Parompa sadun', 'Kain adat Sipirok berhias benang warna dan manik-manik.', 'sipirokTenun'),
  ],
  'tapanuli-utara': [ULOS],
  toba: [ULOS, DALIHAN, t('Mangulosi', 'Memberikan ulos sebagai ungkapan berkat dan kasih sayang menurut hubungan kekerabatan.', 'ulosEncyclopedia', 'ulosStudy')],
};
