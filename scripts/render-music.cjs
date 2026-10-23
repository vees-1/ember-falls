'use strict';
const fs=require('node:fs'),path=require('node:path');
const {scoreInfo,renderScore,encodeWav}=require('./music-score.cjs');
const destination=path.join(__dirname,'../dist/assets/ashen-crown.wav');
fs.writeFileSync(destination,encodeWav(renderScore()));
console.log(`Rendered ${scoreInfo.title}: ${scoreInfo.seconds}s, ${scoreInfo.bpm} BPM, ${scoreInfo.key} → ${destination}`);
