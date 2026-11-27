/**
 * Synthetic demonstration sounds generated with the Web Audio API.
 * They are NOT recordings, and NOT transcriptions of any traditional repertoire.
 */
export type SampleId = 'drums-metal' | 'graded-drums' | 'lakeside';

export const SAMPLES: { id: SampleId; title: string; note: string }[] = [
  { id: 'drums-metal', title: 'Drum and gong texture', note: 'Shows how tuned drum strokes, low gongs and a steady click can layer.' },
  { id: 'graded-drums', title: 'Nine graded pitches', note: 'Shows how drum size relates to pitch across nine voices.' },
  { id: 'lakeside', title: 'Imagined lakeside air', note: 'A generated wind and water ambience. It was not recorded at Lake Toba.' },
];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer = 0;
let nodes: AudioScheduledSourceNode[] = [];
let current: SampleId | null = null;
let volume = 0.6;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const audioState = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  current: () => current,
  volume: () => volume,
};

function ensure() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.connect(ctx.destination);
  }
  void ctx.resume();
  return { ctx, master: master! };
}

export function setVolume(v: number) {
  volume = v;
  if (ctx && master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.03);
  emit();
}

function tone(out: AudioNode, at: number, freq: number, dur: number, gain: number, type: OscillatorType = 'sine', drop = 1) {
  const c = ctx!;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (drop !== 1) osc.frequency.exponentialRampToValueAtTime(freq * drop, at + Math.min(dur, 0.14));
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(g).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.05);
  nodes.push(osc);
  osc.onended = () => {
    nodes = nodes.filter((n) => n !== osc);
    g.disconnect();
  };
}

/** A single stroke for tapping an instrument pad. */
export function strike(freq: number) {
  const { ctx: c, master: m } = ensure();
  m.gain.value = volume;
  tone(m, c.currentTime + 0.01, freq, 0.55, 0.5, 'sine', 0.72);
  tone(m, c.currentTime + 0.01, freq * 2.31, 0.12, 0.12, 'triangle');
}

let bus: GainNode | null = null;

export function stop() {
  window.clearInterval(timer);
  nodes.forEach((n) => {
    try { n.stop(); } catch { /* already stopped */ }
  });
  nodes = [];
  bus?.disconnect();
  bus = null;
  if (current) {
    current = null;
    emit();
  }
}

export function play(id: SampleId) {
  stop();
  const { ctx: c, master: m } = ensure();
  m.gain.value = volume;
  bus = c.createGain();
  bus.connect(m);
  const out = bus;
  current = id;

  if (id === 'lakeside') {
    const buffer = c.createBuffer(1, c.sampleRate * 4, c.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.2;
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    const swell = c.createOscillator();
    const depth = c.createGain();
    swell.frequency.value = 0.17;
    depth.gain.value = 300;
    swell.connect(depth).connect(filter.frequency);
    src.connect(filter).connect(out);
    src.start();
    swell.start();
    nodes.push(src, swell);
  } else {
    let step = 0;
    let next = c.currentTime + 0.05;
    const interval = id === 'drums-metal' ? 0.19 : 0.24;
    const drumPitches = [196, 220, 247, 294, 330];
    const graded = [70, 82, 96, 112, 130, 152, 176, 205, 238];
    const schedule = () => {
      while (next < c.currentTime + 0.35) {
        if (id === 'drums-metal') {
          const pattern = [0, 2, 1, 3, 0, 4, 2, 1];
          if (step % 2 === 0 || step % 8 === 7) tone(out, next, drumPitches[pattern[step % 8]], 0.28, 0.3, 'sine', 0.75);
          if (step % 8 === 0) tone(out, next, 98, 1.3, 0.32, 'triangle');
          if (step % 8 === 4) tone(out, next, 131, 1, 0.22, 'triangle');
          if (step % 2 === 1) tone(out, next, 1750, 0.045, 0.045, 'square');
        } else {
          const pattern = [0, 4, 2, 6, 1, 5, 3, 7, 8, 6, 4, 2];
          const i = pattern[step % pattern.length];
          tone(out, next, graded[i], 0.55, 0.45, 'sine', 0.68);
          if (step % 6 === 0) tone(out, next, graded[0], 0.8, 0.4, 'sine', 0.6);
        }
        next += interval;
        step++;
      }
    };
    schedule();
    timer = window.setInterval(schedule, 100);
  }
  emit();
}
