const input = document.getElementById('input');
const color_picker = document.getElementById('color');
var timepernote = 0;
var length = 0;
//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var amplitude = 40; //how tall is the wave
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
   y = height / 2 + amplitude * Math.sin(x * 2 * Math.PI * freq * (0.5 * length));
   ctx.lineTo(x, y);
   ctx.stroke();
   ctx.strokeStyle = color_picker.value;
   x = x + 1;
    counter++;

     if (counter > timepernote / 20) {
      clearInterval(interval);
     }
     ctx.stroke();
}


function frequency(pitch) {
  if (!pitch) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (timepernote/1000) - 0.1);

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