'use strict';
// The Ashen Crown: an original 16-bar medieval strategy battle theme.
// All notes, arrangement, instruments, and synthesis are authored for Emberfall.
const scoreInfo={title:'The Ashen Crown',bpm:80,bars:16,beatsPerBar:4,key:'D minor',seconds:48,sampleRate:22050};
const TAU=2*Math.PI;
const hz=midi=>440*2**((midi-69)/12);
function renderScore(rate=scoreInfo.sampleRate){
  const seconds=scoreInfo.seconds,length=Math.round(seconds*rate),mix=new Float64Array(length),beat=60/scoreInfo.bpm,bar=beat*4;
  let seed=42637;
  const noise=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/2147483648-1};
  function add(start,duration,voice,gain){
    const first=Math.round(start*rate),count=Math.round(duration*rate);
    for(let i=0;i<count;i++)mix[(first+i)%length]+=voice(i/rate,duration)*gain;
  }
  function pluck(note){const f=hz(note);return t=>(Math.sin(TAU*f*t)+.3*Math.sin(TAU*f*2*t)+.12*Math.sin(TAU*f*3*t))*Math.exp(-t*7)*(1-Math.exp(-t*500))}
  function strings(note){const f=hz(note);return(t,d)=>{const env=Math.min(1,t/.3,Math.max(0,(d-t)/.7));return(Math.sin(TAU*f*t)+.22*Math.sin(TAU*f*2.002*t)+.11*Math.sin(TAU*f*3*t))*env}}
  function horn(note){const f=hz(note);return(t,d)=>{const phase=TAU*f*t+.06*Math.sin(TAU*4.8*t),env=Math.min(1,t/.055,Math.max(0,(d-t)/.18));return(Math.sin(phase)+.32*Math.sin(phase*2)+.11*Math.sin(phase*3)+.035*Math.sin(phase*4))*env*(.9+.1*Math.exp(-t*6))}}
  const chords=[ [38,50,53,57],[38,50,53,57],[34,46,50,53],[36,48,52,55], [41,53,57,60],[36,48,52,55],[31,43,46,50],[33,45,49,52], [38,50,53,57],[34,46,50,53],[41,53,57,60],[36,48,52,55], [31,43,46,50],[38,50,53,57],[33,45,49,52],[38,50,53,57] ];
  // [offset in beats, MIDI note, duration in beats]; deliberate rests keep combat audible.
  const phrases=[
    [[0,62,1.5],[2,69,.5],[2.5,65,.75],[3.5,64,.4]],
    [[0,62,1],[1.5,60,.5],[2.5,57,1]],
    [[0,65,1],[1.5,62,.5],[2.5,58,1]],
    [[0,64,1.5],[2,67,.75],[3,64,.7]],
    [[0,65,.75],[1,69,.75],[2.5,72,1]],
    [[0,67,1],[1.5,64,.5],[2.5,60,1]],
    [[0,67,1.25],[1.5,65,.75],[3,62,.7]],
    [[0,61,.75],[1,64,.75],[2.5,69,.9]],
    [[0,74,1.3],[1.5,69,.5],[2.5,65,1]],
    [[0,70,1],[1.5,65,.5],[2.5,62,1]],
    [[0,69,1.5],[2,72,.5],[3,69,.7]],
    [[0,67,.75],[1,64,.75],[2.5,60,1]],
    [[0,62,1.25],[1.5,58,.75],[3,55,.7]],
    [[0,65,.75],[1,64,.5],[2,62,1.4]],
    [[0,61,1],[1.5,64,.5],[2.5,69,1]],
    [[0,65,.75],[1,64,.5],[2,62,1.6]]
  ];
  for(let b=0;b<scoreInfo.bars;b++){
    const start=b*bar,chord=chords[b];
    for(const note of chord.slice(1))add(start,bar+.5,strings(note),.037);
    add(start,bar+.25,strings(chord[0]),.07);
    const pattern=[1,3,2,3,1,3,2,3];
    for(let step=0;step<8;step++)add(start+step*beat/2,.75,pluck(chord[pattern[step]]+12),step%2?.045:.062);
    for(const [offset,note,duration] of phrases[b])add(start+offset*beat,duration*beat,horn(note),b>=8?.105:.09);
    for(const offset of [0,2])add(start+offset*beat,.62,t=>Math.sin(TAU*(48*t+2.4*(1-Math.exp(-t*28))))*Math.exp(-t*8)*(1-Math.exp(-t*200)),.17);
    for(const offset of [1,3])add(start+offset*beat,.27,t=>(noise()*.25+Math.sin(TAU*142*t)*.5)*Math.exp(-t*21)*(1-Math.exp(-t*250)),.09);
    if(b%4===3)add(start+3.5*beat,.3,t=>Math.sin(TAU*(93*t+1.8*(1-Math.exp(-t*23))))*Math.exp(-t*16),.07);
    if(b===0||b===8)add(start,1.6,t=>noise()*Math.exp(-t*3)*(1-Math.exp(-t*40)),.035);
  }
  const pcm=new Float32Array(length);
  for(let i=0;i<length;i++){
    const fade=Math.min(1,i/(rate*.015),(length-1-i)/(rate*.015));
    pcm[i]=Math.tanh(mix[i]*1.7)*.72*Math.max(0,fade);
  }
  return pcm;
}
function encodeWav(pcm,rate=scoreInfo.sampleRate){
  const output=Buffer.alloc(44+pcm.length*2);
  output.write('RIFF',0);output.writeUInt32LE(output.length-8,4);output.write('WAVE',8);output.write('fmt ',12);output.writeUInt32LE(16,16);output.writeUInt16LE(1,20);output.writeUInt16LE(1,22);output.writeUInt32LE(rate,24);output.writeUInt32LE(rate*2,28);output.writeUInt16LE(2,32);output.writeUInt16LE(16,34);output.write('data',36);output.writeUInt32LE(pcm.length*2,40);
  for(let i=0;i<pcm.length;i++)output.writeInt16LE(Math.round(Math.max(-1,Math.min(1,pcm[i]))*32767),44+i*2);
  return output;
}
module.exports={scoreInfo,renderScore,encodeWav};
