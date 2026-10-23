'use strict';
const $=s=>document.querySelector(s), canvas=$('#battle'),ctx=canvas.getContext('2d');
const W=1440,H=650,lanes=[285,418,551];
const bg=new Image(),atlas=new Image(),wilds=new Image();
bg.src='assets/battlefield.png';atlas.src='assets/creatures.png';wilds.src='assets/wilds.png';
atlas.onload=wilds.onload=()=>drawCards();
let state,selected=2,lane=1,speed=1,sound=false,audioContext,last=0,id=0,activeFilter='all';
function reset(){state={running:false,started:false,finished:false,time:0,mana:180,ally:2400,enemy:2400,units:[],particles:[],effects:[],spawnIn:3.5,wave:1,kills:0,evolution:0,fireCD:0,shake:0,cooldowns:creatures.map(()=>0),projectiles:[]};speed=1;$('#speed').textContent='1×';$('#pause').textContent='Ⅱ';$('#start-screen').classList.remove('hidden');$('#result').classList.add('hidden');updateUI()}
function start(){reset();state.running=true;state.started=true;$('#start-screen').classList.add('hidden');tone(180,.15);setTimeout(()=>tone(270,.2),120);for(let l=0;l<3;l++){spawn([5,8,7][l],l,1,220+l*28);spawn([5,8,6][l],l,-1,1070+l*25)}updateUI()}
function tone(freq,duration=.1,type='sine',vol=.04){if(!sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioContext.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.5,audioContext.currentTime+duration);g.gain.setValueAtTime(vol,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration)}catch{}}
function spawn(type,l,team,x,owner=null){
  if(state.units.filter(u=>u.team===team&&u.hp>0).length>=45)return null;
  const c=creatures[type],mult=team===1?1+state.evolution*.25:.78+state.wave*.085;
  const u={id:id++,type,lane:l,team,x:x??(team===1?150:1290),hp:c.hp*mult,maxhp:c.hp*mult,atk:c.atk*mult,cd:.4,phase:Math.random()*10,hit:0,slow:0,owner,summonTimer:c.summon?.interval??0,distance:0,charged:false};
  state.units.push(u);burst(u.x,lanes[l]-20,team===1?'#d5c48b':'#a9bfd1',12);return u;
}
function deploy(){
  if(!state.started||state.finished)return;
  if(!state.running){hint('Resume the battle to summon.');return}
  const c=creatures[selected];
  if(state.cooldowns[selected]>0){hint(c.name+' is gathering strength · '+Math.ceil(state.cooldowns[selected])+' seconds.');return}
  if(state.mana<c.cost){hint('You need '+c.cost+' essence for '+c.name+'.');tone(80);return}
  const unit=spawn(selected,lane,1);if(!unit){hint('Your army is full (45 creatures).');return}
  state.mana-=c.cost;state.cooldowns[selected]=c.cooldown;
  hint(c.name+' summoned to lane '+['I','II','III'][lane]+'.');tone(200+selected*20,.16);updateUI();
}
function select(i){
  if(!summonable.includes(i))return;
  selected=i;document.querySelectorAll('.creature').forEach(el=>{const chosen=+el.dataset.creature===i;el.classList.toggle('selected',chosen);el.setAttribute('aria-pressed',String(chosen))});
  const c=creatures[i];$('#selected-info').textContent=c.name+' · '+c.hp+' HP · '+c.atk+' damage / '+c.rate+'s · '+c.range+' range · '+c.cooldown+'s deploy cooldown. '+c.lore;
  hint(c.name+' selected · click a lane to summon.');
}
function chooseLane(l){lane=l;document.querySelectorAll('[data-lane]').forEach((el,i)=>el.classList.toggle('active',i===l))}
function hint(s){$('#tip').innerHTML=s+'<small>1–9, 0, −, = select · ↑ ↓ lane · Enter deploys · Space pauses</small>'}
function burst(x,y,color,n=8){for(let i=0;i<n;i++)state.particles.push({x,y,vx:(Math.random()-.5)*100,vy:-Math.random()*100,life:.4+Math.random()*.6,max:1,color,size:1+Math.random()*3})}
function fire(){if(!state.running||state.fireCD>0)return;state.fireCD=30;state.effects.push({kind:'fire',lane,life:1.4});state.shake=10;state.units.filter(u=>u.team===-1&&u.lane===lane).forEach(u=>{u.hp-=200;u.hit=.3;burst(u.x,lanes[lane]-30,'#ffb75a',25)});tone(75,.7,'sawtooth',.08);hint('Dragonfire scorched lane '+['I','II','III'][lane]+'.')}
function evolve(){const cost=120+state.evolution*80;if(!state.running||state.evolution>=3)return;if(state.mana<cost){hint('You need '+cost+' essence to evolve your army.');return}state.mana-=cost;state.evolution++;state.units.filter(u=>u.team===1).forEach(u=>{const hp=creatures[u.type].hp*.25;u.hp+=hp;u.maxhp+=hp;u.atk+=creatures[u.type].atk*.25;burst(u.x,lanes[u.lane]-40,'#eddb8b',20)});tone(420,.4,'sine');hint('Evolution '+state.evolution+' · your army grows stronger.');updateUI()}
function togglePause(){if(!state.started||state.finished)return;state.running=!state.running;$('#pause').textContent=state.running?'Ⅱ':'▶';updateUI()}
function damage(target,amount,c){
  if(target.hp<=0)return;
  target.hp-=amount;target.hit=.18;if(c.slow)target.slow=c.slow;
  burst(target.x,lanes[target.lane]-35,c.color,5);
}
function launch(u,target,c){
  state.projectiles.push({x:u.x,y:lanes[u.lane]-c.size*.5,fromX:u.x,fromY:lanes[u.lane]-c.size*.5,target:target.id,team:u.team,damage:u.atk,type:c.projectile,color:c.color,sourceType:u.type,age:0});
}
function update(dt){
  if(!state.running)return;
  dt*=speed;state.time+=dt;state.mana=Math.min(400,state.mana+12*dt);state.fireCD=Math.max(0,state.fireCD-dt);
  state.cooldowns=state.cooldowns.map(t=>Math.max(0,t-dt));state.wave=Math.min(5,1+Math.floor(state.time/26));state.spawnIn-=dt;
  if(state.spawnIn<=0){
    const pools=[[5,5,6,7,8,0],[5,6,7,8,0,1],[6,7,8,0,1,3,4],[7,8,0,1,3,4,2,9],[6,7,8,0,1,3,4,2,9,10,11]];
    const pool=pools[state.wave-1];spawn(pool[Math.floor(Math.random()*pool.length)],Math.floor(Math.random()*3),-1);
    state.spawnIn=Math.max(2.6,5.8-state.wave*.55);
    if(state.wave===5&&Math.random()>.55)spawn(5,Math.floor(Math.random()*3),-1);
  }
  // Snapshot prevents newly summoned wolves from being updated twice in their birth frame.
  for(const u of [...state.units]){
    if(u.hp<=0)continue;
    const c=creatures[u.type];u.cd-=dt;u.hit=Math.max(0,u.hit-dt);u.slow=Math.max(0,u.slow-dt);u.phase+=dt*(u.slow>0?3:7);
    if(c.summon){
      u.summonTimer-=dt;
      if(u.summonTimer<=0){
        const children=state.units.filter(e=>e.owner===u.id&&e.hp>0).length;
        if(children<c.summon.cap){const child=spawn(c.summon.type,u.lane,u.team,Math.max(150,Math.min(1290,u.x+u.team*24)),u.id);if(child){state.effects.push({kind:'summon',x:u.x,y:lanes[u.lane]-30,life:.6,color:c.color});u.summonTimer=c.summon.interval}else u.summonTimer=1}
        else u.summonTimer=1;
      }
    }
    const enemies=state.units.filter(e=>e.hp>0&&e.team!==u.team&&e.lane===u.lane&&(e.x-u.x)*u.team>-25).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x));
    const target=enemies[0],dist=target?Math.abs(target.x-u.x):Infinity,baseDist=u.team===1?1300-u.x:u.x-140;
    if(dist<c.range||baseDist<c.range){
      if(u.cd<=0){
        u.cd=c.rate;
        if(dist<c.range){
          if(c.projectile)launch(u,target,c);
          else{
            const bonus=c.charge&&!u.charged&&u.distance>=80?c.charge:0;
            if(bonus){u.charged=true;burst(target.x,lanes[u.lane]-30,'#f6d08a',15)}
            damage(target,u.atk+bonus,c);
            if(c.splash){for(const e of enemies.slice(1))if(Math.abs(e.x-target.x)<95)damage(e,u.atk*c.splash,c);state.effects.push({kind:'breath',x:u.x+u.team*45,y:lanes[u.lane]-48,team:u.team,life:.4,color:u.team===1?'#e89645':'#92b7d1'})}
          }
        }else{if(u.team===1)state.enemy=Math.max(0,state.enemy-u.atk);else state.ally=Math.max(0,state.ally-u.atk);state.shake=3;burst(u.team===1?1300:140,lanes[u.lane]-50,'#dfac68',10)}
        tone(90+u.type*12,.05,'triangle',.01);
      }
    }else{const step=c.speed*(u.slow>0?.5:1)*dt;u.x+=u.team*step;u.distance+=step}
  }
  state.projectiles=state.projectiles.filter(p=>{
    const target=state.units.find(u=>u.id===p.target&&u.hp>0);if(!target)return false;
    p.age+=dt;const tx=target.x,ty=lanes[target.lane]-creatures[target.type].size*.45,dx=tx-p.x,dy=ty-p.y,dist=Math.hypot(dx,dy),step=(p.type==='arrow'?550:380)*dt;
    if(dist<=step+5){damage(target,p.damage,creatures[p.sourceType]);return false}
    p.x+=dx/dist*step;p.y+=dy/dist*step;return p.age<3;
  });
  state.units=state.units.filter(u=>{if(u.hp<=0){burst(u.x,lanes[u.lane]-30,creatures[u.type].color,10);if(u.team===-1){state.kills++;if(u.owner===null)state.mana=Math.min(400,state.mana+Math.max(4,Math.round(creatures[u.type].cost*.16)))}return false}return true});
  state.particles=state.particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;return p.life>0});
  state.effects=state.effects.filter(e=>(e.life-=dt)>0);state.shake=Math.max(0,state.shake-dt*25);
  if(state.ally<=0||state.enemy<=0)finish(state.enemy<=0);updateUI();
}
function finish(win){state.running=false;state.finished=true;$('#result').classList.remove('hidden');$('#result-kicker').textContent=win?'BLACKTHORN HAS FALLEN':'THE EMBERS WILL RISE AGAIN';$('#result-title').textContent=win?'The crown is yours.':'Your stronghold has fallen.';$('#result-copy').textContent=(win?'A new legend begins. ':'Regroup and choose your lanes carefully. ')+state.kills+' enemies defeated · '+Math.floor(state.time)+' seconds · evolution '+state.evolution;tone(win?500:100,.6)}
function updateUI(){$('#mana').textContent=Math.floor(state.mana);$('#ally-hp').textContent=Math.ceil(state.ally).toLocaleString()+' / 2,400';$('#enemy-hp').textContent=Math.ceil(state.enemy).toLocaleString()+' / 2,400';$('#ally-bar').style.width=state.ally/24+'%';$('#enemy-bar').style.width=state.enemy/24+'%';$('#wave').innerHTML='WAVE 0'+state.wave+' <em>/ 05</em>';$('#timer').textContent=String(Math.floor(state.time/60)).padStart(2,'0')+':'+String(Math.floor(state.time%60)).padStart(2,'0');$('#battle-state').textContent=state.finished?'BATTLE ENDED':state.running?'SIEGE IN PROGRESS':state.started?'BATTLE PAUSED':'AWAITING YOUR COMMAND';$('#fire').disabled=!state.running||state.fireCD>0;$('#fire-status').textContent=state.fireCD>0?'Recharging · '+Math.ceil(state.fireCD)+' sec':'Scorch a lane · ready';$('#evolve').disabled=!state.running||state.evolution>=3;$('#evolve-tier').textContent=['I','II','III','IV'][state.evolution];$('#evolve-cost').textContent=state.evolution>=3?'Maximum evolution reached':(120+state.evolution*80)+' essence · +25% strength';document.querySelectorAll('.creature').forEach(el=>{const i=+el.dataset.creature;el.classList.toggle('unaffordable',state.mana<creatures[i].cost);el.classList.toggle('recharging',state.cooldowns[i]>0);el.querySelector('.card-status').textContent=state.cooldowns[i]>0?'↻ '+Math.ceil(state.cooldowns[i])+'s':creatures[i].tier.toUpperCase()})}
function fallbackCreature(g,type,x,y,size,team,phase){g.save();g.translate(x,y);g.scale(team*size/100,size/100);const c=creatures[type];g.fillStyle=c.color;g.strokeStyle='#182321';g.lineWidth=2;if(type===3){for(let j=0;j<5;j++){g.fillStyle=j%2?'#819186':'#5f7368';g.fillRect(-25+j%2*14,-65+j*10,40,24)}g.fillStyle='#9bdbb9';g.fillRect(13,-60,8,5)}else{g.beginPath();g.ellipse(0,-24,30,16,0,0,7);g.fill();g.beginPath();g.moveTo(20,-30);g.lineTo(38,-49);g.lineTo(57,-30);g.lineTo(31,-25);g.closePath();g.fill();for(let j=0;j<4;j++){let xx=-20+j*13;g.fillRect(xx,-18,6,20+Math.sin(phase+j)*5)}g.beginPath();g.moveTo(-20,-27);g.quadraticCurveTo(-65,-55,-50,-4);g.lineTo(-13,-20);g.fill();if(type===1||type===2||type===4){const flap=Math.sin(phase)*13;g.globalAlpha=.9;g.beginPath();g.moveTo(-10,-30);g.lineTo(-45,-95+flap);g.lineTo(12,-65+flap);g.lineTo(32,-28);g.closePath();g.fill();g.stroke()}g.fillStyle='#ffdc97';g.fillRect(38,-38,5,4)}g.restore()}
function sprite(g,type,x,y,size,team,phase,hit=false){
  const c=creatures[type],sheet=c.atlas==='wilds'?wilds:atlas;
  if(!sheet.complete||!sheet.naturalWidth){fallbackCreature(g,type,x,y,size,team,phase);return}
  const cols=c.atlas==='wilds'?4:3,cw=sheet.width/cols,ch=sheet.height/2;
  g.save();g.translate(x,y+Math.sin(phase)*2);g.scale(team,1);if(hit)g.filter='brightness(1.8)';
  const crop=c.crop?.map((v,i)=>v*(i%2===0?sheet.width/1536:sheet.height/1024))??[(c.cell%cols)*cw,Math.floor(c.cell/cols)*ch,cw,ch];
  const width=c.atlas==='wilds'?size*crop[2]/crop[3]:size*1.3;
  g.drawImage(sheet,...crop,-width/2,-size*.89,width,size);g.restore();
}
function draw(){ctx.clearRect(0,0,W,H);if(bg.complete&&bg.naturalWidth){ctx.drawImage(bg,0,0,W,H)}else{ctx.fillStyle='#26342d';ctx.fillRect(0,0,W,H)}const shade=ctx.createLinearGradient(0,0,0,H);shade.addColorStop(0,'#06100e30');shade.addColorStop(.4,'#121d1722');shade.addColorStop(1,'#07100be0');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);ctx.save();if(state.shake)ctx.translate((Math.random()-.5)*state.shake,(Math.random()-.5)*state.shake);
for(let i=0;i<3;i++){ctx.fillStyle=i===lane?'#c9af6620':'#5e79680a';ctx.fillRect(170,lanes[i]-74,1100,112);ctx.strokeStyle=i===lane?'#cbb57855':'#bdc6a319';ctx.setLineDash([6,13]);ctx.beginPath();ctx.moveTo(175,lanes[i]+38);ctx.lineTo(1265,lanes[i]+38);ctx.stroke();ctx.setLineDash([])}
for(const u of [...state.units].sort((a,b)=>a.lane-b.lane)){const c=creatures[u.type],y=lanes[u.lane];ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(u.x,y+8,c.size*.28,7,0,0,7);ctx.fill();sprite(ctx,u.type,u.x,y,c.size,u.team,u.phase,u.hit>0);const bw=Math.min(64,c.size*.6);ctx.fillStyle='#0a110dbb';ctx.fillRect(u.x-bw/2,y-c.size*.88-6,bw,4);ctx.fillStyle=u.team===1?'#9cc6ad':'#d59a7a';ctx.fillRect(u.x-bw/2,y-c.size*.88-6,bw*Math.max(0,u.hp/u.maxhp),4);if(u.team===1&&state.evolution){ctx.fillStyle='#d7b96c';ctx.font='11px serif';ctx.fillText('✧'.repeat(state.evolution),u.x-10,y+28)}}
for(const e of state.effects){if(e.kind==='summon'){ctx.save();ctx.globalAlpha=e.life;ctx.strokeStyle=e.color;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(e.x,e.y,50*(1-e.life),22*(1-e.life),0,0,Math.PI*2);ctx.stroke();ctx.restore()}else if(e.kind==='fire'){const y=lanes[e.lane];const grad=ctx.createLinearGradient(200,y,1250,y);grad.addColorStop(0,'#ffc76b00');grad.addColorStop(.5,'#ffb137aa');grad.addColorStop(1,'#ff542a33');ctx.globalAlpha=Math.min(1,e.life);ctx.fillStyle=grad;ctx.fillRect(180,y-90,1080,105);for(let j=0;j<30;j++){ctx.fillStyle=j%2?'#ffce75':'#f97b38';ctx.beginPath();ctx.arc(220+j*34,y-25-Math.random()*65,6+Math.random()*12,0,7);ctx.fill()}ctx.globalAlpha=1}else{ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.team,1);ctx.globalAlpha=e.life*2;const grad=ctx.createLinearGradient(0,0,125,0);grad.addColorStop(0,e.color);grad.addColorStop(1,'#ffb94a00');ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(140,-35);ctx.lineTo(140,35);ctx.closePath();ctx.fill();ctx.restore()}}
for(const p of state.projectiles){ctx.strokeStyle=p.color;ctx.lineWidth=p.type==='arrow'?2:4;ctx.beginPath();ctx.moveTo(p.x-p.team*17,p.y+3);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.type==='arrow'?2:4,0,Math.PI*2);ctx.fill()}
for(const p of state.particles){ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size)}ctx.globalAlpha=1;ctx.restore();const t=performance.now()/1000;for(let i=0;i<28;i++){ctx.globalAlpha=.2+.3*Math.sin(t+i);ctx.fillStyle=i%3?'#dfa263':'#e4c78a';ctx.fillRect((i*173+t*(8+i%5))%W,H-((i*79+t*(13+i%7))%H),1.5,1.5)}ctx.globalAlpha=1;if(state.started&&!state.running&&!state.finished){ctx.fillStyle='#06100d80';ctx.fillRect(0,0,W,H);ctx.fillStyle='#e0d4b7';ctx.textAlign='center';ctx.font='30px Georgia';ctx.fillText('BATTLE PAUSED',W/2,H/2);ctx.textAlign='left'}}
function drawCards(){document.querySelectorAll('.portrait canvas').forEach(c=>{const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);sprite(g,+c.dataset.type,c.width/2,105,125,1,0)})}
function renderRoster(){
  $('#roster').innerHTML=summonable.map(i=>{const c=creatures[i],visible=activeFilter==='all'||c.tags.includes(activeFilter)||c.tier===activeFilter;return `<button class="creature ${c.tier} ${i===selected?'selected':''} ${visible?'':'hidden'}" data-creature="${i}" aria-pressed="${i===selected}" aria-label="Select ${c.name}, ${c.cost} essence" title="${c.hp} HP · ${c.atk} damage · ${c.range} range"><div class="portrait"><canvas width="260" height="120" data-type="${i}"></canvas></div><span class="key">${selectionKeys[i]}</span><span class="cost">${c.cost}</span><span class="name">${c.name}</span><span class="role">${c.role}</span><span class="card-meta"><span>${c.hp} HP · ${c.range} RNG</span><span class="card-status">${c.tier.toUpperCase()}</span></span><span class="rarity"></span></button>`}).join('');
  document.querySelectorAll('[data-creature]').forEach(el=>el.onclick=()=>select(+el.dataset.creature));drawCards();if(state)updateUI();
}
document.querySelectorAll('[data-filter]').forEach(el=>el.onclick=()=>{activeFilter=el.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===el;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});renderRoster()});
renderRoster();document.querySelectorAll('[data-lane]').forEach(el=>el.onclick=()=>chooseLane(+el.dataset.lane));canvas.onclick=e=>{if(!state.running)return;const r=canvas.getBoundingClientRect(),y=(e.clientY-r.top)/r.height*H;chooseLane(lanes.reduce((best,v,i)=>Math.abs(v-y)<Math.abs(lanes[best]-y)?i:best,0));deploy()};$('#start').onclick=start;$('#restart').onclick=start;$('#pause').onclick=togglePause;$('#speed').onclick=()=>{speed=speed===1?2:1;$('#speed').textContent=speed+'×'};$('#fire').onclick=fire;$('#evolve').onclick=evolve;$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'♫':'♪';$('#sound').style.color=sound?'#d9ba7a':'#adb2a9';tone(300)};
function modal(codex){$('#modal-title').textContent=codex?'The ancient bestiary':'How to conquer';$('#modal-content').innerHTML=codex?creatures.map(c=>`<div class="codex-entry"><b>${c.name}</b><p>${c.lore}<br>${c.hidden?'Summoned only':c.cost+' essence · '+c.tier} · ${c.hp} health · ${c.atk} damage / ${c.rate}s · ${c.range} range</p></div>`).join(''):'<p><strong>1. Choose your creature.</strong> Select a card below the battlefield. Keys 1–9, 0, minus, and equals select the twelve creatures. Filter by role or rarity; the detail row explains each creature.</p><p><strong>2. Command a lane.</strong> Click any of the three lanes to summon. Your creatures march and attack automatically. Essence regenerates at 12 per second; defeated enemies award essence based on their cost. Summoned minions grant no essence. Ranged units have low health: screen them with melee troops. Legendary deployments have long cooldowns. Each Morrigan calls one wolf every 10 seconds, up to three living wolves per caller.</p><p><strong>3. Turn the tide.</strong> Evolve your entire army for extra health and damage. Press F to unleash dragonfire on your selected lane.</p><p><strong>4. Claim the crown.</strong> Destroy the enemy citadel before your stronghold falls. Space pauses; the 1× button changes battle speed.</p>';$('#modal').showModal()}$('#help').onclick=()=>modal(false);$('#codex').onclick=()=>modal(true);$('#close-modal').onclick=()=>$('#modal').close();$('#modal').onclick=e=>{if(e.target===$('#modal'))$('#modal').close()};document.addEventListener('keydown',e=>{if($('#modal').open)return;const index=selectionKeys.indexOf(e.key);if(index>=0)select(index);if(['ArrowUp','ArrowDown','Enter',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowUp')chooseLane((lane+2)%3);if(e.key==='ArrowDown')chooseLane((lane+1)%3);if(e.key==='Enter')state.started?deploy():start();if(e.key===' ')togglePause();if(e.key.toLowerCase()==='f')fire()});
reset();select(selected);drawCards();function frame(t){const dt=Math.min((t-last)/1000,.05);last=t;update(dt);draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
window.emberfall={getState:()=>structuredClone(state),select,chooseLane,deploy,start,fire,evolve,togglePause};
