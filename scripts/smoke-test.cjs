const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map();const noop=()=>{};const element=()=>({textContent:'',innerHTML:'',style:{},classList:{add:noop,remove:noop,toggle:noop},getContext:()=>new Proxy({},{get:()=>noop}),showModal:noop,close:noop});const document={querySelector:s=>{if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll:()=>[],addEventListener:noop};const context=vm.createContext({document,window:{},Image:class{},performance:{now:()=>0},requestAnimationFrame:noop,setTimeout:noop,console,Math,structuredClone});vm.runInContext(fs.readFileSync('dist/game.js','utf8'),context);const run=s=>vm.runInContext(s,context);
run('start()');assert.equal(run('state.units.length'),6);assert.equal(run('state.running'),true);
run('select(2);chooseLane(0);deploy()');assert.equal(run('state.mana'),70);assert.equal(run('state.units.at(-1).type'),2);assert.equal(run('state.units.at(-1).lane'),0);
run('state.mana=200;evolve()');assert.equal(run('state.evolution'),1);assert.equal(run('state.mana'),80);
run('chooseLane(1);fire()');assert.equal(run('state.fireCD'),30);assert.ok(run('state.units.filter(u=>u.team===-1&&u.lane===1).every(u=>u.hp<u.maxhp)'));
run('togglePause()');const time=run('state.time');run('update(.5)');assert.equal(run('state.time'),time);run('togglePause()');
run('for(let i=0;i<10000&&!state.finished;i++)update(.05)');assert.equal(run('state.finished'),true);assert.ok(run('state.ally===0||state.enemy===0'));run('start()');assert.equal(run('state.finished'),false);assert.equal(run('state.ally'),2400);assert.equal(run('state.evolution'),0);
console.log('PASS: start, dragon deployment and cost, army evolution, dragonfire, pause, full combat to fort destruction, restart.');
