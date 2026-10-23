'use strict';
(() => {
  const audio=window.EmberAudio,modal=document.querySelector('#audio-modal');let resumeBattle=false;
  function sync(){
    const s=audio.getSettings();
    for(const id of ['sound','battle-audio']){const button=document.querySelector('#'+id);button.setAttribute('aria-label',s.enabled?'Mute audio':'Enable audio');button.setAttribute('aria-pressed',String(s.enabled));button.title=s.enabled?'Mute battlefield audio':'Enable battlefield audio';button.textContent=s.enabled?'♫':'⊘';button.classList.toggle('audio-enabled',s.enabled)}
    document.querySelector('#audio-toggle').textContent=s.enabled?'MUTE AUDIO':'ENABLE AUDIO';
    document.querySelector('#music-preview-status').textContent=s.musicPreview?'Playing The Ashen Crown · 12-second preview.':'THE ASHEN CROWN · ORIGINAL BATTLE THEME';
    document.querySelector('#preview-music').textContent=s.musicPreview?'↻ Restart theme preview':'▶ Preview battle theme';
    document.querySelector('#audio-state').textContent=!s.available?'Audio is unavailable in this browser.':!s.enabled?'Audio muted.':s.background?'Audio is paused while this tab is in the background.':s.unlocked?'Audio enabled · your mix is ready.':'Audio will begin when you enter the siege or preview a sound.';
    for(const key of ['master','ambience','music','effects']){const value=Math.round(s[key]*100);document.querySelector('#'+key+'-volume').value=value;document.querySelector('#'+key+'-value').textContent=value+'%'}
  }
  for(const id of ['sound','battle-audio','audio-toggle'])document.querySelector('#'+id).addEventListener('click',()=>audio.toggle());
  for(const key of ['master','ambience','music','effects'])document.querySelector('#'+key+'-volume').addEventListener('input',event=>audio.setVolume(key,event.target.value/100));
  document.querySelector('#preview-music').addEventListener('click',async()=>{if(!audio.getSettings().enabled)await audio.toggle();const ok=await audio.previewMusic();document.querySelector('#music-preview-status').textContent=ok?'Playing The Ashen Crown · 12-second preview.':'Theme could not load. Try again when connected.'});
  document.querySelector('#audio-settings').addEventListener('click',()=>{resumeBattle=Boolean(window.emberfall.getState().running);if(resumeBattle)window.emberfall.togglePause();sync();modal.showModal()});
  document.querySelector('#audio-close').addEventListener('click',()=>modal.close());
  modal.addEventListener('close',()=>{if(resumeBattle){const s=window.emberfall.getState();if(s.started&&!s.finished&&!s.running)window.emberfall.togglePause()}resumeBattle=false});
  modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
  document.querySelectorAll('[data-sound]').forEach(button=>button.addEventListener('click',async()=>{if(!audio.getSettings().enabled)await audio.toggle();else await audio.unlock();audio.play(button.dataset.sound)}));
  function meter(){if(modal.open){const level=audio.getLevel();document.querySelector('#audio-meter').value=level;document.querySelector('#audio-level').textContent=Math.round(level*100)+'%'}requestAnimationFrame(meter)}
  document.addEventListener('emberfall:audio-state',sync);sync();requestAnimationFrame(meter);
})();
