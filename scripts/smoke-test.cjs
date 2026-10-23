const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map(),noop=()=>{};
const element=()=>({textContent:'',innerHTML:'',style:{},classList:{add:noop,remove:noop,toggle:noop},getContext:()=>new Proxy({},{get:()=>noop}),showModal:noop,close:noop,setAttribute:noop});
const document={querySelector:s=>{if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll:()=>[],addEventListener:noop};
const seededMath=Object.create(Math);let seed=2123;seededMath.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const context=vm.createContext({document,window:{},Image:class{},performance:{now:()=>0},requestAnimationFrame:noop,setTimeout:noop,console,Math:seededMath,structuredClone});
for(const file of ['dist/creatures.js','dist/game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const run=s=>vm.runInContext(s,context);
const clean=()=>run('reset();state.started=true;state.running=true;state.units=[];state.spawnIn=100000;state.mana=300');
assert.equal(run('summonable.length'),12);assert.equal(run("creatures.filter(c=>c.tier==='legendary').length"),3);
assert.equal(run("creatures.filter(c=>c.tier==='common'&&!c.hidden).length"),4);
run('start()');assert.equal(run('state.units.length'),6);assert.equal(run('state.running'),true);
clean();run('select(2);chooseLane(0);deploy()');assert.equal(run('state.mana'),120);assert.equal(run('state.units.at(-1).type'),2);assert.equal(run('state.units.at(-1).lane'),0);
run('deploy()');assert.equal(run('state.units.length'),1,'deployment cooldown must block repeat summons');assert.equal(run('state.mana'),120);
run('state.mana=400;evolve()');assert.equal(run('state.evolution'),1);assert.equal(run('state.mana'),280);assert.equal(run('state.units[0].maxhp'),375);
clean();run('spawn(8,1,-1,600);chooseLane(1);fire()');assert.equal(run('state.fireCD'),30);assert.ok(run('state.units[0].hp<state.units[0].maxhp'));
run('togglePause()');const time=run('state.time');run('update(.5)');assert.equal(run('state.time'),time);run('togglePause()');
// Arrows travel before doing damage; the frail archer shoots beyond melee range.
clean();run('spawn(6,0,1,400);spawn(8,0,-1,580);state.units[0].cd=0;update(.01)');
assert.equal(run('state.projectiles.length'),1);const before=run('state.units[1].hp');run('for(let i=0;i<45;i++)update(.01)');assert.ok(run('state.units[1].hp')<before,'projectile must hit');
// Summons are timed, capped per owner, never themselves summoners, and release slots on death.
clean();run('spawn(10,0,1,400);state.units[0].summonTimer=0;update(.05)');assert.equal(run('state.units.filter(u=>u.owner!==null).length'),1);assert.equal(run('state.units.at(-1).type'),12);
run('for(let i=0;i<900;i++)update(.05)');assert.equal(run('state.units.filter(u=>u.owner!==null).length'),3);
run('state.units.find(u=>u.owner!==null).hp=0;state.units[0].summonTimer=0;update(.05)');assert.equal(run('state.units.filter(u=>u.owner!==null).length'),3);
clean();run('spawn(12,0,-1,500,999);state.units[0].hp=0;state.mana=100;update(.05)');assert.ok(Math.abs(run('state.mana')-100.6)<.001,'summoned minions grant no essence');
// Charge only happens once, after travel; fresh melee contact cannot claim the bonus.
clean();run('spawn(8,0,1,400);spawn(3,0,-1,430);state.units[0].cd=0;state.units[0].distance=80;state.units[1].cd=100');const tankHP=run('state.units[1].hp');run('update(.01)');assert.equal(run('state.units[1].hp'),tankHP-32);assert.equal(run('state.units[0].charged'),true);run('state.units[0].cd=0;update(.01)');assert.equal(run('state.units[1].hp'),tankHP-46);
clean();run('spawn(4,0,1,400);spawn(8,0,-1,520);state.units[0].cd=0;for(let i=0;i<40;i++)update(.01)');assert.ok(run('state.units[1].slow')>0,'frost projectiles slow enemies');
// Healing is lane-specific, bounded by max HP, paid once, and cannot revive dead units.
clean();run('spawn(8,0,1,400);spawn(0,0,1,450);spawn(7,1,1,400);state.units[0].hp=100;state.units[1].hp=110;state.units[2].hp=70;chooseLane(0);heal()');
assert.equal(run('state.mana'),210);assert.equal(run('state.healCD'),35);assert.equal(run('state.units[0].hp'),190);assert.equal(run('state.units[1].hp'),120);assert.equal(run('state.units[2].hp'),70);run('heal()');assert.equal(run('state.mana'),210);
clean();run('spawn(8,0,1,400);chooseLane(0);heal()');assert.equal(run('state.mana'),300);assert.equal(run('state.healCD'),0);
run('state.units[0].hp=0;heal()');assert.equal(run('state.units[0].hp'),0);assert.equal(run('state.mana'),300);
clean();run('spawn(8,0,1,400);state.units[0].hp=100;state.mana=80;chooseLane(0);heal()');assert.equal(run('state.mana'),80);assert.equal(run('state.units[0].hp'),100);
// Legendary costs/cooldowns and weak ranged health are meaningful tradeoffs.
assert.ok(run('creatures[9].range>creatures[6].range'));assert.ok(run('creatures[9].hp<creatures[8].hp'));assert.ok(run('creatures[10].atk<creatures[7].atk'));assert.ok(run('creatures[11].cost>creatures[8].cost*3'));
clean();run('for(let i=0;i<46;i++)spawn(5,0,1,200)');assert.equal(run('state.units.length'),45);
run('start();for(let i=0;i<20000&&!state.finished;i++)update(.05)');assert.equal(run('state.finished'),true);assert.ok(run('state.ally===0||state.enemy===0'));run('start()');assert.equal(run('state.finished'),false);assert.equal(run('state.ally'),2400);assert.equal(run('state.evolution'),0);assert.equal(run('state.cooldowns.every(t=>t===0)'),true);
console.log('PASS: 12-unit roster, tiers, deployment cost/cooldown, evolution, dragonfire, pause, ranged projectiles, summon timing/cap/replacement, no summon farming, one-time charge, frost slow, unit limit, lane healing/cost/cooldown/health caps, full battle, restart.');
