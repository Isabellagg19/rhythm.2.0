const input = document.getElementById('input');
const audioCtx = new AudioContext();

function frequency(pitch) {
  const freq = parseFloat(pitch); 
  if (isNaN(freq)) {
    console.log("Not a valid frequency");
    return;
  }

  const gainNode = audioCtx.createGain();
  const oscillator = audioCtx.createOscillator();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
}

function handle() {
  audioCtx.resume();
  frequency(input.value);
}