/** Instruments with the playing method taken from the cited articles. Sounds in the simulation are synthesized. */
import type { SourceId } from './sources';

export type Voice = 'drum' | 'rim' | 'bar' | 'handle' | 'pluck' | 'boss' | 'side';

export interface Part {
  id: string;
  label: string;
  /** Keyboard key that plays this part. */
  key: string;
  voice: Voice;
  /** Pitch in hertz. Illustrative: not measured from a real instrument. */
  pitch: number;
}

export interface Instrument {
  id: 'gordang' | 'taganing' | 'garantung' | 'hasapi' | 'aramba' | 'gondra';
  name: string;
  community: string;
  family: string;
  how: string;
  context: string;
  /** What the visitor can learn by playing with this model. */
  teaches: string;
  /** Where the model or sound is invented. */
  limits: string;
  parts: Part[];
  photo?: string;
  sources: SourceId[];
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const row = (count: number, make: (i: number) => Omit<Part, 'key'>): Part[] => Array.from({ length: count }, (_, i) => ({ ...make(i), key: KEYS[i] }));

/** Role names as listed by the article, counted from the smallest drum. */
const GORDANG_ROLES = ['Taba-taba', 'Taba-taba', 'Tepe-tepe', 'Kudong-kudong', 'Kudong-kudong nabalik', 'Pasilion', 'Jangat', 'Jangat', 'Jangat'];

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'gordang', name: 'Gordang Sambilan', community: 'Mandailing', family: 'Sembilan gendang (membranofon)',
    how: 'Gendang berkulit sapi yang diikat rotan dipukul dengan pemukul kayu. Ukurannya bertingkat sehingga nadanya berbeda. Satu ansambel biasanya dimainkan enam orang, tiap peran punya nama.',
    context: 'Dahulu hanya dimainkan pada acara sakral. Kini juga terdengar pada pernikahan, penyambutan tamu, dan hari besar, dengan penggunaan yang tetap diatur adat.',
    teaches: 'Makin besar gendang, makin rendah nadanya, dan setiap kelompok gendang punya nama peran.',
    limits: 'Nada, jarak, dan hiasan rak bersifat ilustratif. Pola tabuhan adat tidak ditiru.',
    parts: row(9, (i) => ({ id: `g${i}`, label: `Gendang ${i + 1} · ${GORDANG_ROLES[i]}`, voice: 'drum', pitch: Math.round(290 * 0.855 ** i) })),
    photo: 'i_gordang', sources: ['wGordang', 'gordang'],
  },
  {
    id: 'taganing', name: 'Taganing', community: 'Batak Toba', family: 'Lima gendang melodis (membranofon)',
    how: 'Kulit gendang dipukul dengan dua stik (palu-palu) oleh satu atau dua pemain, mengikuti lagu.',
    context: 'Berbeda dari gordang yang cenderung tetap, taganing membawa melodi dan memberi aba-aba kepada pemusik lain dalam ansambel gondang, termasuk dalam upacara.',
    teaches: 'Satu pemain bisa menyusun melodi dari lima gendang yang nadanya berbeda.',
    limits: 'Laras dan susunan rak bersifat ilustratif, bukan laras taganing sebenarnya.',
    parts: row(5, (i) => ({ id: `t${i}`, label: `Taganing ${i + 1}`, voice: 'drum', pitch: [175, 196, 220, 262, 294][i] })),
    sources: ['wTaganing', 'taganing'],
  },
  {
    id: 'garantung', name: 'Garantung', community: 'Batak Toba dan Simalungun', family: 'Xilofon kayu',
    how: 'Bilah kayu yang tergantung di atas kotak resonator dipukul dengan dua pemukul. Tangan kiri juga memukul bagian tangkai sambil membawakan lagu.',
    context: 'Dimainkan sendiri, misalnya saat bersantai di ladang, atau bersama hasapi, sarune, suling, dan taganing dalam ansambel.',
    teaches: 'Bilah memberi nada, sedangkan pukulan pada tangkai memberi bunyi pendek sebagai pengisi ritme.',
    limits: 'Jumlah tujuh bilah mengikuti sumber; larasnya ilustratif.',
    parts: [...row(7, (i) => ({ id: `w${i}`, label: `Bilah ${i + 1}`, voice: 'bar', pitch: [392, 440, 494, 523, 587, 659, 698][i] })), { id: 'wh', label: 'Tangkai', key: '8', voice: 'handle', pitch: 150 }],
    sources: ['wGarantung'],
  },
  {
    id: 'hasapi', name: 'Hasapi', community: 'Batak Toba', family: 'Lute petik dua senar (kordofon)',
    how: 'Dua senarnya dipetik. Hasapi ende membawa melodi, sedangkan hasapi doal yang sedikit lebih besar menjaga ritme.',
    context: 'Instrumen utama dalam ansambel gondang hasapi.',
    teaches: 'Memetik berbeda dari memukul: bunyinya lahir dari senar yang bergetar. Coba petik kedua senar bergantian.',
    limits: 'Model tidak meniru penjarian. Tinggi nada kedua senar hanya ilustrasi.',
    parts: [{ id: 'h1', label: 'Senar 1', key: '1', voice: 'pluck', pitch: 330 }, { id: 'h2', label: 'Senar 2', key: '2', voice: 'pluck', pitch: 262 }],
    photo: 'i_hasapi', sources: ['wHasapi'],
  },
  {
    id: 'aramba', name: 'Aramba', community: 'Nias', family: 'Gong gantung (idiofon)',
    how: 'Gong yang digantung pada palang dipukul dengan alat dari kayu, umumnya pada tonjolan di tengahnya. Memukul bagian sisi menghasilkan bunyi lain.',
    context: 'Dipakai sebagai alat komunikasi dan pengiring kegiatan, antara lain pesta dan pernikahan. Dimainkan selaras dengan alat lain. Asal-usulnya masih diperdebatkan.',
    teaches: 'Tempat memukul mengubah warna bunyi: tonjolan terdengar panjang dan bulat, sisinya lebih tajam dan pendek.',
    limits: 'Warna bunyi hanya gambaran perbedaannya. Ukuran dan rangka ilustratif.',
    parts: [{ id: 'a1', label: 'Tonjolan tengah', key: '1', voice: 'boss', pitch: 110 }, { id: 'a2', label: 'Bagian sisi', key: '2', voice: 'side', pitch: 110 }],
    sources: ['wAramba'],
  },
  {
    id: 'gondra', name: 'Göndra', community: 'Nias', family: 'Gendang dua sisi berbentuk tong (membranofon)',
    how: 'Digantung pada tiang setinggi sekitar 150–180 cm dan dipukul dengan dua bilah bambu tipis panjang yang disebut bözibözi göndra.',
    context: 'Mengiringi aramba, antara lain pada pesta owasa dan pernikahan. Tiang gantungnya berukir ornamen merah dan kuning.',
    teaches: 'Gendang digantung setinggi badan sehingga pemain memukul sambil berdiri, dengan dua pemukul lentur.',
    limits: 'Ukiran tiang diganti pita warna sederhana. Bunyi disintesis.',
    parts: [{ id: 'n1', label: 'Pemukul kiri', key: '1', voice: 'drum', pitch: 98 }, { id: 'n2', label: 'Pemukul kanan', key: '2', voice: 'drum', pitch: 112 }, { id: 'nr', label: 'Tepi kayu', key: '3', voice: 'rim', pitch: 420 }],
    sources: ['wGondra'],
  },
];
