export type PinIcon = 'house' | 'lake' | 'drum' | 'stone' | 'cloth' | 'bowl' | 'city' | 'people' | 'leaf';

export interface Pin {
  /** Administrative area id. */
  id: string;
  label: string;
  icon: PinIcon;
  /** Pixel nudge that keeps neighbouring markers from covering each other. */
  shift?: [number, number];
  /** Stop number on the exploration trail. Only areas with a diorama are stops. */
  stop?: number;
}

export const PINS: Pin[] = [
  { id: 'karo', label: 'Rumah Karo', icon: 'house', stop: 1 },
  { id: 'samosir', label: 'Samosir', icon: 'lake', stop: 2 },
  { id: 'mandailing-natal', label: 'Huta Mandailing', icon: 'drum', stop: 3 },
  { id: 'nias-selatan', label: 'Nias Selatan', icon: 'stone', stop: 4 },
  { id: 'kota-medan', label: 'Medan', icon: 'city', shift: [58, 4] },
  { id: 'simalungun', label: 'Simalungun', icon: 'bowl' },
  { id: 'toba', label: 'Toba', icon: 'cloth' },
  { id: 'pakpak-bharat', label: 'Pakpak', icon: 'leaf' },
  { id: 'tapanuli-selatan', label: 'Angkola', icon: 'people' },
];

export const STOPS = PINS.filter((p) => p.stop).sort((a, b) => a.stop! - b.stop!);
