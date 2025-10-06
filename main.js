const input = document.getElementById('input');
var amplitude = 40;
var interval = null;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter =0;
function drawWave() {
  ctx.clearRect(0, 0, width, height);
  x = 0
  y = height/2;
  ctx.moveTo(x, y);
  ctx.beginPath()
       counter = 0;
       interval = setInterval(line, 20);
}
function line() {
  freq = pitch / 10000;
  y= height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
   ctx.lineTo(x, y);
   ctx.stroke();
   x = x + 1;
   //increase counter by 1 to show how long interval has been run
   counter++;
   if (counter > 50) {
           clearInterval(interval);
   }
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notenames = new Map
notenames.set("A", 261.63);
notenames.set("B", 293.66);
notenames.set("C", 329.63);
notenames.set("D", 349.23);
notenames.set("E", 392.00);
notenames.set("F", 440.00);
notenames.set("G", 493.88);

function frequency(pitch) {
  if (!pitch) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1);
}

function handle() {
  audioCtx.resume();
  const usernote = input.value.trim().toUpperCase();
  const pitch = notenames.get(usernote);
  if (!pitch) {
    alert('Please enter a note between A and G');
    return;
  }
  frequency(pitch);
  drawWave(pitch); 
}