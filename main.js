const input = document.getElementById('input');

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";


function frequency(pitch) {
    oscillator.start();
gainNode.gain.value = 0;

gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
oscillator.frequency.setValueAtTime(pitch.audioCtx, currentTime);
gainNode.gain.setTargetAtTime(0,audioCtx+1);

}

function handle() {
    frequency(input.value);
}