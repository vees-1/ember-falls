'use strict';
(() => {
  const shell = document.querySelector('#game-shell');
  const button = document.querySelector('#fullscreen');
  const deck = document.querySelector('#roster');
  const status = document.querySelector('#mode-status');
  let immersive = false;
  let nativeEntered = false;
  let previousScroll = 0;
  let pending = false;

  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const requestFrame = fn => requestAnimationFrame(fn);

  function revealSelection() {
    if (!immersive) return;
    const selected = deck.querySelector('.creature.selected:not(.hidden)');
    if (!selected) return;
    // Scroll only the deck; scrolling ancestors could move the battlefield.
    const left = selected.offsetLeft;
    if (left < deck.scrollLeft) deck.scrollLeft = left;
    else if (left + selected.offsetWidth > deck.scrollLeft + deck.clientWidth) {
      deck.scrollLeft = left + selected.offsetWidth - deck.clientWidth;
    }
  }

  function apply(enabled) {
    if (enabled === immersive) return;
    if (enabled) previousScroll = window.scrollY;
    immersive = enabled;
    shell.classList.toggle('is-immersive', enabled);
    document.body.classList.toggle('immersive-open', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Exit fullscreen' : 'Enter fullscreen');
    button.title = enabled ? 'Exit immersive view (Escape or G)' : 'Immersive fullscreen (G)';
    button.innerHTML = enabled ? '⛶ <span>Exit</span>' : '⛶ <span>Fullscreen</span>';
    status.textContent = enabled ? 'Immersive view. Select a creature in the bottom deck, then click a lane.' : 'Returned to page view. Your battle continues.';
    if (enabled) {document.querySelector('[data-filter="all"]').click();requestFrame(revealSelection);}
    else { nativeEntered = false; window.scrollTo(0, previousScroll); }
  }

  async function toggleImmersive() {
    if (pending) return;
    pending = true;
    if (immersive) {
      apply(false);
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      try { if (fullscreenElement() && exit) await exit.call(document); } catch { /* Page view remains usable. */ }
    } else {
      apply(true);
      // Keep the fitted game view usable when the browser or embedding blocks native fullscreen.
      const root = document.documentElement;
      const request = root.requestFullscreen || root.webkitRequestFullscreen;
      if (request) {
        try {
          await request.call(root);
          nativeEntered = Boolean(fullscreenElement());
        } catch {
          status.textContent = 'Immersive window view active. Native fullscreen is unavailable in this browser context. Use Exit or Escape to return.';
        }
      }
    }
    pending = false;
  }

  function onFullscreenChange() {
    if (fullscreenElement()) { nativeEntered = true; apply(true); }
    else if (nativeEntered) apply(false);
  }

  button.addEventListener('click', toggleImmersive);
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (document.querySelector('#modal').open || document.querySelector('#audio-modal').open) return;
    if (event.key.toLowerCase() === 'g') { event.preventDefault(); toggleImmersive(); }
    else if (event.key === 'Escape' && immersive) toggleImmersive();
    else if (immersive) requestFrame(revealSelection);
  });
  document.querySelector('#deck-prev').addEventListener('click', () => deck.scrollBy({left: -Math.max(180, deck.clientWidth * .7), behavior: 'smooth'}));
  document.querySelector('#deck-next').addEventListener('click', () => deck.scrollBy({left: Math.max(180, deck.clientWidth * .7), behavior: 'smooth'}));
  deck.addEventListener('click', () => requestFrame(revealSelection));
})();
