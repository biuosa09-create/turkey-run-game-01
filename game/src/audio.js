// Gobble Dash — tiny WebAudio synth. No audio files: every sound is
// oscillator envelopes made at run time, so the game ships no assets.
let ctx = null;
let musicTimer = null;
let muted = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function blip(freq, dur, type, vol, slideTo) {
  if (muted) return;
  try {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  } catch (e) { /* audio unavailable: the game plays on silently */ }
}

export const sfx = {
  jump() { blip(320, 0.14, 'triangle', 0.14, 640); },
  collect() { blip(880, 0.09, 'sine', 0.14, 1320); blip(1320, 0.12, 'sine', 0.1, 1760); },
  golden() { [660, 880, 1100, 1320].forEach((f, i) => setTimeout(() => blip(f, 0.12, 'sine', 0.12), i * 70)); },
  stumble() { blip(220, 0.25, 'sawtooth', 0.16, 90); },
  caught() { [440, 349, 293, 220].forEach((f, i) => setTimeout(() => blip(f, 0.22, 'sawtooth', 0.14), i * 160)); },
  escaped() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => blip(f, 0.2, 'triangle', 0.13), i * 110)); },
  stageClear() { [784, 988, 1175].forEach((f, i) => setTimeout(() => blip(f, 0.15, 'triangle', 0.12), i * 90)); },
  alarm() { blip(980, 0.12, 'square', 0.07, 740); },
  toggleMute() { muted = !muted; return muted; },
  isMuted() { return muted; },
};

// A plain autumn walking bassline, three notes a bar, looped while playing.
const BASS = [110, 130.8, 98, 110, 146.8, 130.8, 98, 87.3];
export function startMusic() {
  if (musicTimer || muted) return;
  let i = 0;
  musicTimer = setInterval(() => {
    if (!muted) blip(BASS[i % BASS.length], 0.42, 'triangle', 0.05);
    i++;
  }, 430);
}
export function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}
