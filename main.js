const input = document.getElementById('input'); 
const color_picker = document.getElementById('color');
const vol_slider = document.getElementById('vol-slider');
const recording_toggle = document.getElementById('record');
var timepernote = 0;
var length = 0;
//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var blob = null;
var recorder = null;
var chunks = [];
var is_recording = false;

var freq; //the frequency value of each note
var x = 0; //x position (it starts in 0)
var y = height / 2; //The middle of the canvas
var counter = 0; //for how long it is draw
var interval = null; //handler
let reset = false;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notenames = new Map
notenames.set("A", 261.63);
notenames.set("B", 293.66);
notenames.set("C", 329.63);
notenames.set("D", 349.23);
notenames.set("E", 392.00);
notenames.set("F", 440.00);
notenames.set("G", 493.88);


function drawWave() {
  //Starting a new interval
  clearInterval(interval);
  counter = 0;
  if (reset) {
  ctx.clearRect(0, 0, width, height);
  x = 0
  y = height/2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  }
  // Run line() every 20s
  interval = setInterval(line, 20);
  reset = false;
}

function line() {
   y = height / 2 + ((vol_slider.value/100) * 40) * Math.sin(x * 2 * Math.PI * freq * (0.5 * length));
   ctx.lineTo(x, y);
   ctx.stroke();
   x = x + 1;
    counter++;

     if (counter > timepernote / 20) {
      clearInterval(interval);
     }
}


function frequency(pitch) {
  if (!pitch) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
  setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  setTimeout(() => { clearInterval(setting);
    gainNode.gain.value = 0}, ((timepernote)-10));

let hue = Math.floor((pitch - 200) / 2); // map pitch range to color hue
let color1 = `hsl(${hue}, 100%, 60%)`;
let color2 = `hsl(${(hue + 60) % 360}, 100%, 60%)`;

// create gradient and assign it to strokeStyle
let gradient = ctx.createLinearGradient(0, 0, width, 0);
gradient.addColorStop(0, color1);
gradient.addColorStop(1, color2);

ctx.strokeStyle = gradient;

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
   freq = pitch / 10000;
}

function handle() {
    reset = true;
  audioCtx.resume();
  var usernotes = String(input.value);
  var noteslist = []; 

for (i = 0; i < usernotes.length; i++) {
  noteslist.push(notenames.get(usernotes.charAt(i)));
}
length = usernotes.length;
timepernote = 6000 / length;

let j = 0;
   repeat = setInterval(() => {
       if (j < noteslist.length) {
           frequency(noteslist[j]);
           drawWave();
       j++
       } else {
           clearInterval(repeat)
       }


   }, timepernote);
}

function startRecording(){
  chunks = [];
  const canvasStream = canvas.captureStream(20);
   const audioDestination = audioCtx.createMediaStreamDestination();
  const combinedStream = new MediaStream();

  canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

gainNode?.connect(audioDestination);
audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
 recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm'});
recorder.ondataavailable = e => {
 if (e.data.size > 0) {
   chunks.push(e.data);
 }
};


recorder.onstop = () => {
   const blob = new Blob(chunks, { type: 'video/webm' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'recording.webm';
   a.click();
   URL.revokeObjectURL(url);
};
recorder.start();
}


function toggle(){
is_recording = !is_recording;
if(is_recording) {
  recording_toggle.innerHTML = "stop Recording";
  startRecording();
} else {
  recording_toggle.innerHTML = "Start recording";
  recorder.stop();
}
}
