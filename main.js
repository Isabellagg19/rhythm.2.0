const input = document.getElementById('input');

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

// Start the oscillator and mute it
oscillator.start();
gainNode.gain.value = 0;


function frequency(pitch) {
    const now = audioCtx.currentTime;
    const freq = Number(pitch);

    if (isNaN(freq)){
        console.log("Please enter a number for the frequency");
        return;
    }
    //start volume rigth away
gainNode.gain.setValueAtTime(1, audioCtx.now);
//set oscillator frequency
oscillator.frequency.setValueAtTime(freq, now);
//stop volume after 1 second
gainNode.gain.setTargetAtTime(0, now + 0.5, 0.1);
}

function handle() {
    audioCtx.resume();
    frequency(input.value);
}