const assert=require('node:assert/strict');
const {synth,ambience,lengths,rate}=require('../dist/audio.js');
const fingerprints=new Set();
for(const kind of Object.keys(lengths)){
  const data=synth(kind);assert.equal(data.length,Math.ceil(lengths[kind]*rate));
  let energy=0,peak=0,crossings=0;
  for(let i=0;i<data.length;i++){assert.ok(Number.isFinite(data[i]),kind+' produced invalid PCM');energy+=data[i]*data[i];peak=Math.max(peak,Math.abs(data[i]));if(i&&data[i]*data[i-1]<0)crossings++}
  const rms=Math.sqrt(energy/data.length);assert.ok(rms>.006,kind+' is silent');assert.ok(peak<=.641,kind+' exceeds peak ceiling');assert.ok(Math.abs(data[0])<.001&&Math.abs(data.at(-1))<.005,kind+' lacks click-free envelope');
  fingerprints.add(data.length+':'+crossings+':'+rms.toFixed(5));
}
assert.equal(fingerprints.size,Object.keys(lengths).length,'sound cues must be distinct');
assert.deepEqual(synth('dragon'),synth('dragon'),'cached cues must render deterministically');
const bed=ambience();assert.equal(bed.length,32*rate);let bedEnergy=0;for(const sample of bed){assert.ok(Number.isFinite(sample));assert.ok(Math.abs(sample)<.65);bedEnergy+=sample*sample}assert.ok(Math.sqrt(bedEnergy/bed.length)>.01);assert.ok(Math.abs(bed[0]-bed.at(-1))<.005,'ambient loop boundary must be smooth');
console.log('PASS: '+Object.keys(lengths).length+' distinct sound cues, finite PCM, non-silence, peak limits, click-free envelopes, deterministic rendering, and seamless 32-second ambience.');
