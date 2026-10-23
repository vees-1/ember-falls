'use strict';
// Original procedural sound design. No external recordings, downloads, or audio dependencies.
(() => {
  const TAU=Math.PI*2, RATE=22050;
  const lengths={select:.08,error:.2,dragon:1.5,beast:.85,wolf:.55,griffin:.75,stone:.65,imp:.3,bone:.25,spear:.3,centaur:.7,summon:1.1,magic:1.4,heal:1.6,fire:1.5,clash:.23,heavy:.4,arrow:.23,frost:.7,impact:.22,start:1.7,win:2.7,lose:2.5};
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function synth(kind,rate=RATE,seed=8317){
    if(!lengths[kind])throw new Error('Unknown sound cue: '+kind);
    const duration=lengths[kind],data=new Float32Array(Math.ceil(duration*rate));
    let noiseState=seed>>>0,low=0,phase=0;
    const rand=()=>{noiseState=(noiseState*1664525+1013904223)>>>0;return noiseState/2147483648-1};
    const bell=(t,f,damp=4)=>t<0?0:(Math.sin(TAU*f*t)+.25*Math.sin(TAU*f*2.003*t)+.09*Math.sin(TAU*f*3.97*t))*Math.exp(-t*damp)*(1-Math.exp(-t*130));
    const arpeggio=(t,notes,spacing,damp)=>notes.reduce((sum,f,j)=>sum+bell(t-j*spacing,f,damp),0)/Math.sqrt(notes.length);
    let peak=0;
    for(let i=0;i<data.length;i++){
      const t=i/rate,n=rand();low+=.12*(n-low);let v=0;
      if(['dragon','beast','wolf','griffin','imp'].includes(kind)){
        const f=kind==='dragon'?42+102*Math.exp(-t*3):kind==='beast'?48+48*Math.exp(-t*6):kind==='wolf'?110+90*Math.exp(-t*10):kind==='griffin'?420+280*Math.exp(-t*5):220+80*Math.sin(t*25);
        phase+=TAU*f*(1+.035*Math.sin(34*t))/rate;
        const throat=Math.sin(phase)+.55*Math.sin(phase*2.01)+.27*Math.sin(phase*3.98);
        const growl=Math.tanh(throat*2.3)*(.68+.2*Math.sin(52*t));
        const env=Math.min(1,t*35)*Math.pow(Math.max(0,1-t/duration),1.4);
        v=(growl*.55+low*1.8+n*.07)*env;
        if(kind==='dragon')v+=(Math.sin(TAU*29*t)*.25+low*.7)*Math.exp(-t*2)*Math.min(1,t*20);
      }else if(kind==='magic'||kind==='summon'||kind==='heal'||kind==='frost'){
        const notes=kind==='heal'?[587.33,739.99,880,1174.66]:kind==='magic'?[293.66,440,587.33,698.46,880]:kind==='summon'?[220,293.66,440,587.33]:[1174.66,880,739.99];
        v=arpeggio(t,notes,kind==='heal'?.13:.1,kind==='heal'?3.2:5)*.62;
        v+=low*.3*Math.sin(Math.PI*t/duration);
        if(kind==='heal')v+=Math.sin(TAU*293.66*t)*.1*Math.sin(Math.PI*t/duration);
      }else if(kind==='fire'){
        phase+=TAU*(65+40*Math.exp(-t*8))/rate;
        v=(low*2.4+n*.23+Math.sin(phase)*.3)*Math.min(1,t*25)*Math.pow(1-t/duration,1.5);
      }else if(['clash','heavy','impact','bone','stone','spear','arrow'].includes(kind)){
        const heavy=kind==='heavy'||kind==='stone';
        const metal=kind==='clash'||kind==='spear';
        const noiseEnv=Math.exp(-t*(heavy?13:30));
        v=n*noiseEnv*(kind==='arrow'?.35:.55)+low*Math.exp(-t*10)*.4;
        if(metal)v+=(Math.sin(TAU*1123*t)+.5*Math.sin(TAU*1737*t)+.24*Math.sin(TAU*2783*t))*Math.exp(-t*32)*.25;
        if(heavy)v+=Math.sin(TAU*(72*t+12*(1-Math.exp(-t*20))))*Math.exp(-t*10)*.7;
        if(kind==='arrow')v+=Math.sin(TAU*(210*t+40*t*t))*Math.exp(-t*23)*.42;
        if(kind==='bone')v+=Math.sin(TAU*810*t)*Math.exp(-t*45)*.32;
      }else if(['start','win','lose','centaur'].includes(kind)){
        const notes=kind==='win'?[293.66,369.99,440,587.33]:kind==='lose'?[220,174.61,146.83]:kind==='centaur'?[293.66,440]:[146.83,220,293.66];
        v=arpeggio(t,notes,.19,kind==='lose'?1.5:2.5)*.55;
        v+=Math.sin(TAU*73.416*t)*.17*Math.sin(Math.PI*t/duration);
      }else v=bell(t,kind==='error'?110:660,kind==='error'?16:50)*.4;
      // Click-free endings, bounded peak, and per-cue envelopes keep rapid combat comfortable.
      v*=Math.min(1,i/Math.max(1,rate*.003),(data.length-i)/Math.max(1,rate*.025));
      data[i]=v;peak=Math.max(peak,Math.abs(v));
    }
    const gain=peak>0?.64/Math.max(.8,peak):0;
    for(let i=0;i<data.length;i++)data[i]*=gain;
    return data;
  }
  function ambience(rate=RATE,seconds=32){
    const data=new Float32Array(rate*seconds);let seed=42,wind=0;
    for(let i=0;i<data.length;i++){
      const t=i/rate;seed=(seed*1664525+1013904223)>>>0;wind=.994*wind+.006*(seed/2147483648-1);
      const air=wind*(2+.6*Math.sin(TAU*t/8));
      // Whole-cycle detuning and chord fades create a seamless dark D-minor sound bed.
      const drone=.105*Math.sin(TAU*73.5*t)+.055*Math.sin(TAU*110*t)+.04*Math.sin(TAU*146.75*t)+.025*Math.sin(TAU*174.5*t);
      const pulse=t%2,drum=.22*Math.sin(TAU*(48*pulse+2*(1-Math.exp(-pulse*28))))*Math.exp(-pulse*11);
      const fade=Math.min(1,t/.25,(seconds-t)/.25);
      data[i]=(air+drone*(.8+.2*Math.sin(TAU*t/16))+drum)*fade*.7;
    }
    return data;
  }
  const design={synth,ambience,lengths,rate:RATE};
  if(typeof module!=='undefined'&&module.exports)module.exports=design;
  if(typeof window==='undefined')return;
  window.EmberSoundDesign=design;
  let settings={enabled:true,master:.6,ambience:.45,effects:.8};
  try{const saved=JSON.parse(localStorage.getItem('emberfall.audio.v1')||'null');if(saved){for(const key of ['master','ambience','effects'])if(Number.isFinite(saved[key]))settings[key]=clamp(saved[key],0,1);if(typeof saved.enabled==='boolean')settings.enabled=saved.enabled}}catch{}
  let context,master,effects,bed,ambientSource,reverb,wet,analyser,levelData,activeBattle=false,lastBattle=false,activeVoices=0,available=true;
  const buffers=new Map(),lastCue=new Map();
  const persist=()=>{try{localStorage.setItem('emberfall.audio.v1',JSON.stringify(settings))}catch{}};
  const notify=()=>document.dispatchEvent(new CustomEvent('emberfall:audio-state',{detail:{...settings,available,unlocked:context?.state==='running'}}));
  function ramp(param,value,time=.08){if(!context)return;param.cancelScheduledValues(context.currentTime);param.setTargetAtTime(value,context.currentTime,time)}
  function mix(){if(!context)return;ramp(master.gain,settings.enabled&&!document.hidden?settings.master:0);ramp(effects.gain,settings.effects);ramp(bed.gain,activeBattle?settings.ambience:0,.35)}
  function makeBuffer(data){const b=context.createBuffer(1,data.length,RATE);b.getChannelData(0).set(data);return b}
  async function unlock(){
    try{
      if(!context){
        const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio){available=false;notify();return false}
        context=new Audio();master=context.createGain();effects=context.createGain();bed=context.createGain();
        const compressor=context.createDynamicsCompressor();compressor.threshold.value=-12;compressor.knee.value=15;compressor.ratio.value=5;
        analyser=context.createAnalyser();analyser.fftSize=256;levelData=new Uint8Array(analyser.fftSize);master.connect(compressor);compressor.connect(analyser);analyser.connect(context.destination);effects.connect(master);bed.connect(master);
        reverb=context.createConvolver();wet=context.createGain();wet.gain.value=.15;
        const impulse=context.createBuffer(2,Math.floor(context.sampleRate*1.25),context.sampleRate);
        for(let ch=0;ch<2;ch++){const channel=impulse.getChannelData(ch);for(let i=0;i<channel.length;i++)channel[i]=(Math.random()*2-1)*Math.pow(1-i/channel.length,3)*.45}
        reverb.buffer=impulse;effects.connect(reverb);reverb.connect(wet);wet.connect(master);
        master.gain.value=0;bed.gain.value=0;
        ambientSource=context.createBufferSource();ambientSource.buffer=makeBuffer(ambience());ambientSource.loop=true;ambientSource.connect(bed);ambientSource.start();
      }
      if(context.state==='suspended')await context.resume();mix();notify();return context.state==='running';
    }catch{available=false;notify();return false}
  }
  function play(kind,position=.5){
    if(!settings.enabled||document.hidden||context?.state!=='running'||!lengths[kind]||settings.effects===0||activeVoices>=20)return false;
    const now=context.currentTime,gap=['clash','impact','heavy','arrow'].includes(kind)?.075:kind==='select'?.06:kind==='fire'?.4:.15;
    if(now-(lastCue.get(kind)??-100)<gap)return false;lastCue.set(kind,now);
    if(!buffers.has(kind))buffers.set(kind,makeBuffer(synth(kind)));
    const source=context.createBufferSource();source.buffer=buffers.get(kind);
    const gain=context.createGain();gain.gain.value=['clash','impact','arrow','bone'].includes(kind)?.4:.7;
    if(['clash','impact','heavy','wolf','bone','spear','arrow'].includes(kind))source.playbackRate.value=.92+Math.random()*.16;
    const pan=context.createStereoPanner?.();
    source.connect(gain);if(pan){pan.pan.value=clamp((position-.5)*1.1,-.6,.6);gain.connect(pan);pan.connect(effects)}else gain.connect(effects);
    activeVoices++;source.onended=()=>{activeVoices--;source.disconnect();gain.disconnect();pan?.disconnect()};source.start();return true;
  }
  async function toggle(){settings.enabled=!settings.enabled;persist();if(settings.enabled)await unlock();mix();notify();if(settings.enabled)play('magic');return settings.enabled}
  function setVolume(channel,value){if(!['master','ambience','effects'].includes(channel))return;settings[channel]=clamp(Number(value)||0,0,1);persist();mix();notify()}
  function setBattleState(running){if(lastBattle===Boolean(running))return;lastBattle=Boolean(running);activeBattle=lastBattle&&!document.hidden;mix()}
  document.addEventListener('visibilitychange',()=>{activeBattle=lastBattle&&!document.hidden;mix();notify()});
  function getLevel(){if(!analyser)return 0;analyser.getByteTimeDomainData(levelData);let energy=0;for(const n of levelData)energy+=((n-128)/128)**2;return Math.min(1,Math.sqrt(energy/levelData.length)*3)}
  window.EmberAudio={unlock,play,toggle,setVolume,setBattleState,getLevel,getSettings:()=>({...settings,available,background:document.hidden,unlocked:context?.state==='running'})};
})();
