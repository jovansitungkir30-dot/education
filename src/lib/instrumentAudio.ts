/**
 * Synthesized instrument sounds (Web Audio). Each voice imitates the KIND of sound, such as a skin drum,
 * a wooden bar, a plucked string or a gong. None is a recording or a measurement of a real instrument.
 */
import type { Voice } from '../data/instruments';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let volume = 0.7;

function ensure() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = volume;
    const limiter = ctx.createDynamicsCompressor();
    master.connect(limiter).connect(ctx.destination);
  }
  void ctx.resume();
  return { ctx, out: master! };
}

export function setInstrumentVolume(v: number) {
  volume = v;
  if (ctx && master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

/** One decaying partial, optionally sliding down at the start like a struck skin. */
function partial(freq: number, at: number, decay: number, gain: number, slide = 1, type: OscillatorType = 'sine') {
  const { ctx: c, out } = ensure();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq * slide, at);
  if (slide !== 1) osc.frequency.exponentialRampToValueAtTime(freq, at + 0.06);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  osc.connect(g).connect(out);
  osc.start(at);
  osc.stop(at + decay + 0.05);
  osc.onended = () => g.disconnect();
}

/** The short noise of the beater making contact. */
function click(at: number, centre: number, length: number, gain: number) {
  const { ctx: c, out } = ensure();
  const buffer = c.createBuffer(1, Math.ceil(c.sampleRate * length), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const g = c.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = centre;
  filter.Q.value = 1.1;
  g.gain.value = gain;
  src.buffer = buffer;
  src.connect(filter).connect(g).connect(out);
  src.start(at);
  src.onended = () => g.disconnect();
}

/** Karplus-Strong plucked string. */
function pluck(freq: number, at: number) {
  const { ctx: c, out } = ensure();
  const period = Math.round(c.sampleRate / freq);
  const buffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = i < period ? Math.random() * 2 - 1 : (data[i - period] + data[i - period + 1 > 0 ? i - period + 1 : 0]) * 0.4975;
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = 0.55;
  src.buffer = buffer;
  src.connect(g).connect(out);
  src.start(at);
  src.onended = () => g.disconnect();
}

export function play(voice: Voice, pitch: number) {
  const { ctx: c } = ensure();
  const t = c.currentTime + 0.012;
  const size = Math.min(1.8, 190 / pitch); // lower drums ring longer
  if (voice === 'drum') {
    partial(pitch, t, 0.32 + size * 0.35, 0.8, 1.45);
    partial(pitch * 1.59, t, 0.18, 0.28, 1.2);
    partial(pitch * 2.14, t, 0.1, 0.14);
    click(t, 1500, 0.028, 0.5);
  } else if (voice === 'rim') {
    partial(pitch, t, 0.07, 0.3, 1, 'triangle');
    click(t, 2600, 0.035, 0.7);
  } else if (voice === 'bar') {
    partial(pitch, t, 0.55, 0.6);
    partial(pitch * 3.93, t, 0.12, 0.2);
    partial(pitch * 9.2, t, 0.04, 0.07);
    click(t, 3200, 0.014, 0.25);
  } else if (voice === 'handle') {
    partial(pitch, t, 0.09, 0.4, 1.2, 'triangle');
    click(t, 900, 0.04, 0.8);
  } else if (voice === 'pluck') {
    pluck(pitch, t);
  } else if (voice === 'boss') {
    // Slightly detuned pairs give the slow shimmer of a gong.
    for (const [ratio, gain, decay] of [[1, 0.55, 4.2], [1.008, 0.35, 3.8], [2.01, 0.22, 2.6], [2.43, 0.1, 1.8], [3.02, 0.07, 1.3]]) partial(pitch * ratio, t, decay, gain, 1.015);
    click(t, 500, 0.05, 0.3);
  } else {
    for (const [ratio, gain, decay] of [[1.48, 0.22, 1.1], [2.76, 0.24, 0.9], [3.93, 0.17, 0.7], [5.41, 0.12, 0.5]]) partial(pitch * ratio, t, decay, gain);
    click(t, 2100, 0.05, 0.45);
  }
}
