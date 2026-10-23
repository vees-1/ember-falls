# AI development log

## 2026-10-23 — Initial playable prototype

### Request
Create a playable prototype inspired by Fort Conquer, with dragons, ancient mythical creatures, and a dark fantasy atmosphere.

### Implemented
- Emberfall: Dragon Siege, a browser game using HTML, CSS, and Canvas 2D.
- Three combat lanes and two destructible strongholds.
- Five selectable creatures: Frostfang, Sunclaw, Emberwing, Runestone, and Rimewraith.
- Essence regeneration, summon costs, enemy kill rewards, and escalating enemy waves.
- Army evolution, dragonfire, pause, speed control, keyboard shortcuts, and restart.
- Original generated battlefield and creature artwork.
- Creature codex, instructions, optional synthesized sound, and responsive layout.
- Private hosted preview through Sites.

### Verification
- JavaScript syntax check passed: `node --check dist/game.js`.
- Simulation smoke test passed: `node scripts/smoke-test.cjs`.
- Smoke test covers starting, dragon deployment and cost, army evolution, dragonfire damage, pause, fort destruction, and restarting.
- Local browser playtest and visual inspection completed; screenshot saved as `playtest.png`.
- Hosted deployment reported success. Its private access gate requires ChatGPT sign-in; authenticated hosted gameplay was not separately verified.

### Current limits
- One battlefield; no campaign persistence, multiplayer, or breeding system.
- Illustrated sprites with simple movement rather than full animation frame sets.
- Prototype balance still needs player feedback.

## 2026-10-23 — Repository documentation

- Confirmed that `emberfall/` already contains a Git repository with the initial game commit.
- Added this development log, `agent.md` project guidance, and an `AGENTS.md` entry point.
- No GitHub repository or remote has been created for this request.

### Maintaining this log
Append a dated entry for meaningful changes. Record the request, implementation, verification actually performed, and remaining limitations. Never include credentials, access tokens, or private authentication data.

## 2026-10-23 — Expanded and rebalanced bestiary

### Request
Add ordinary mythical troops, melee and long-range roles, summoners, beasts, minions, and three legendaries including a centaur and the Beast of Gévaudan.

### Implemented
- Four common troops: Cinder Imp, Bone Archer, Thornhoof the satyr, and Bramble Boar.
- Three legendaries: Asterion the centaur marksman, Morrigan the spirit summoner, and the Beast of Gévaudan.
- Twelve selectable creatures plus a summoned spirit wolf, with original new atlas artwork.
- Rebalanced the original five creatures: reduced damage/health where appropriate and increased dragon cost.
- Traveling ranged projectiles, slowing frost bolts, and a one-time charge bonus after travel for boars and the Beast.
- Timed summoning with three living wolves per caller, no recursive summons, no essence reward from summoned wolves, and a 45-unit limit per side.
- Deployment cooldowns, longer legendary cooldowns, role filters, visible HP/range/rarity, cooldown feedback, and selected-creature descriptions.
- Shared stats moved to dist/creatures.js; twelve keyboard selection shortcuts added.

### Verification
- JavaScript syntax checks and expanded deterministic smoke tests passed.
- Tests cover all new combat mechanics, summon slot replacement, cooldowns, and full battle completion/restart.
- Browser playtest verified role filtering, selecting/deploying Morrigan, cooldown feedback, and visible summoned spirit wolves.
- Artwork and creature-card layout visually inspected and atlas source regions adjusted for readability.

### Limits
Illustrated sprites still use simple movement; costs and combat values are a first balance pass rather than a completed competitive balance study.

## 2026-10-23 — Immersive fullscreen and bottom creature deck

### Request
Add an immersive fullscreen play mode with creature selection from a bottom deck.

### Implemented
- Fullscreen/Exit control in the battlefield toolbar and G keyboard shortcut.
- Native Fullscreen API support with a prefixed Safari path and a fitted browser-window fallback.
- Screen-filling battlefield with a compact horizontal twelve-creature deck, role filters, essence, evolution, and dragonfire controls.
- Deck navigation arrows, horizontal scrolling, and automatic reveal of selected creatures.
- Exit/Escape handling that restores page view without resetting battle state.
- Responsive portrait and short landscape layouts, safe-area padding, and accessible mode status.
- Kept keyboard activation of ordinary controls from accidentally deploying troops or pausing the game.

### Verification
- Native fullscreen visually verified in desktop Safari, including live bottom-deck selection and deployment.
- Browser playtest verified deck navigation, selecting the Beast of Gévaudan, exiting without resetting the timer, and G/Escape shortcuts.
- No runtime errors reported in the browser playtest.
- Existing combat smoke tests passed; JavaScript syntax checks passed.
- Safari fullscreen screenshot saved as fullscreen-playtest.png.

### Limits
Native fullscreen depends on browser/context support; the fitted immersive window remains available when it cannot be entered. Mobile layout rules are implemented but have not been verified on physical mobile devices.
