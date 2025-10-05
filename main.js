const input = document.getElementById('input');

const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = 'sine';

oscillator.start();
gainNode.gain.value = 0;

const notenames = new Map();
notenames.set('A', 261.63);
notenames.set('B',293.66);
notenames.set('C', 329.63);
notenames.set('D', 349.23);
notenames.set('E', 392.00);
notenames.set('F', 440.00);
notenames.set('G', 493.88);

function frequency(pitch) {
  if (!pitch) return;
    const freq = Number(pitch);
  if (isNaN(freq)) return;
  
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);
}

function handle() {
  audioCtx.resume();
  var usernotes = String(input.value.toUpperCase());
  const pitch = notenames.get(usernotes);
  frequency(pitch);
}