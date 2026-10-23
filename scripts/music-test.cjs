'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {scoreInfo,renderScore,encodeWav}=require('./music-score.cjs');
const track=renderScore();assert.equal(track.length,scoreInfo.sampleRate*48);
let peak=0,energy=0;const barEnergy=[];
for(let b=0;b<16;b++){
  let sum=0;for(let i=b*3*scoreInfo.sampleRate;i<(b+1)*3*scoreInfo.sampleRate;i++){const n=track[i];assert.ok(Number.isFinite(n));peak=Math.max(peak,Math.abs(n));energy+=n*n;sum+=n*n}
  barEnergy.push(Math.sqrt(sum/(3*scoreInfo.sampleRate)));
}
assert.ok(peak>.2&&peak<.72,'music must have usable headroom');assert.ok(Math.sqrt(energy/track.length)>.03,'music must be audible');assert.ok(barEnergy.every(n=>n>.02),'every bar must contain music');assert.ok(new Set(barEnergy.map(n=>n.toFixed(4))).size>8,'the arrangement must develop across bars');assert.ok(Math.abs(track[0])<.001&&Math.abs(track.at(-1))<.001,'loop endpoints must avoid clicks');
const wav=fs.readFileSync(path.join(__dirname,'../dist/assets/ashen-crown.wav'));
assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');assert.equal(wav.readUInt16LE(22),1);assert.equal(wav.readUInt32LE(24),scoreInfo.sampleRate);assert.equal(wav.readUInt32LE(40),track.length*2);assert.deepEqual(wav,encodeWav(track),'committed music must match the source score');
console.log('PASS: original 48-second score, 16 populated/developing bars, finite samples, headroom, audible RMS, smooth loop endpoints, valid WAV, and reproducible asset.');
