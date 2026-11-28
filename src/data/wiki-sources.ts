/**
 * Indonesian Wikipedia articles whose text was retrieved and read while writing the area content.
 * They are secondary sources: good for orientation, and each article's own references deserve a check.
 */
import type { Source } from './sources';

const w = (title: string, path = title.replace(/ /g, '_')): Source => ({
  title,
  publisher: `Wikipedia bahasa Indonesia: ${title}`,
  url: `https://id.wikipedia.org/wiki/${path}`,
  type: 'Ensiklopedia',
});

export const WIKI_SOURCES = {
  wAsahan: w('Kabupaten Asahan'), wBatuBara: w('Kabupaten Batu Bara'), wDairi: w('Kabupaten Dairi'), wDeliSerdang: w('Kabupaten Deli Serdang'),
  wHumbahas: w('Kabupaten Humbang Hasundutan'), wKaro: w('Kabupaten Karo'), wLabuhanbatu: w('Kabupaten Labuhanbatu'), wLabusel: w('Kabupaten Labuhanbatu Selatan'),
  wLabura: w('Kabupaten Labuhanbatu Utara'), wLangkat: w('Kabupaten Langkat'), wMadina: w('Kabupaten Mandailing Natal'), wNias: w('Kabupaten Nias'),
  wNisel: w('Kabupaten Nias Selatan'), wNiut: w('Kabupaten Nias Utara'), wNibar: w('Kabupaten Nias Barat'), wPalas: w('Kabupaten Padang Lawas'),
  wPaluta: w('Kabupaten Padang Lawas Utara'), wPakpak: w('Kabupaten Pakpak Bharat'), wSamosir: w('Kabupaten Samosir'), wSergai: w('Kabupaten Serdang Bedagai'),
  wSimalungun: w('Kabupaten Simalungun'), wTapsel: w('Kabupaten Tapanuli Selatan'), wTapteng: w('Kabupaten Tapanuli Tengah'), wTaput: w('Kabupaten Tapanuli Utara'),
  wToba: w('Kabupaten Toba'), wBinjai: w('Kota Binjai'), wMedanKota: w('Kota Medan'), wSidimpuan: w('Kota Padangsidimpuan'), wSiantar: w('Kota Pematangsiantar'),
  wSibolga: w('Kota Sibolga'), wTanjungbalai: w('Kota Tanjungbalai'), wTebing: w('Kota Tebing Tinggi'), wGunungsitoli: w('Kota Gunungsitoli'),

  wArsik: w('Arsik'), wNaniura: w('Dengke mas naniura'), wMiGomak: w('Mi gomak'), wLampet: w('Lampet'), wOmbus: w('Ombus ombus'), wDali: w('Dali ni horbo'),
  wHolat: w('Holat'), wPakkat: w('Pakkat'), wPelleng: w('Pelleng'), wCimpa: w('Cimpa'), wBika: w('Bika Ambon'), wSoto: w('Soto Medan'),
  wNapinadar: w('Manuk napinadar'), wLemang: w('Lemang'), wBubur: w('Bubur pedas'), wBabae: w('Babae'), wHarinake: w('Harinake'),

  wGordang: w('Gordang Sambilan'), wTaganing: w('Taganing'), wHasapi: w('Hasapi'), wGarantung: w('Garantung'), wKulcapi: w('Kulcapi'),
  wKeteng: w('Keteng-Keteng', 'Keteng-Keteng'), wAramba: w('Aramba'), wGondra: w('Gondra'), wDoli: w('Doli-doli'),

  wHoli: w('Mangongkal holi'), wKerjaTahun: w('Kerja Tahun'), wMarsialapari: w('Marsialapari'), wFahombo: w('Fahombo'), wMoyo: w('Tari Moyo'),
  wMaena: w('Maena'), wTortor: w('Tortor'), wUlos: w('Ulos'), wDalihan: w('Dalihan Na Tolu'), wGubang: w('Tari Gubang'), wTapai: w('Pesta Tapai'),
  wRondang: w('Rondang Bintang'), wOwasa: w('Owasa'),
};
