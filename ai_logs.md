# Emberfall: Dragon Siege
## AI-Assisted Development Record and Prompt Register

**Project:** Emberfall: Dragon Siege<br>
**Record date:** 23 October 2026, Asia/Kolkata<br>
**Current implementation:** The Ashen Crown, prototype v0.5<br>
**Technology:** HTML, CSS, Canvas 2D, and Web Audio<br>
**Delivery:** Local Git repository and an owner-private Sites deployment

### Purpose and provenance

This document records the product brief, development decisions, implementation history, validation evidence, and remaining work. The prompt register below contains professionally edited versions of every task-bearing user request in this conversation. These are editorial reconstructions that preserve the original intent and sequence; they are not represented as verbatim transcripts or as prompts that were historically submitted in this exact wording.

Original image-generation prompts are retained separately in [ASSET-PROMPTS.md](ASSET-PROMPTS.md). That file remains the source of truth for the executed artwork prompts. This record documents requirements and observable work; it does not contain private reasoning, credentials, authentication tokens, or unrelated personal information.

## 1. Product brief

Build an original, playable dark fantasy strategy prototype inspired by Fort Conquer's multi-lane creature combat. Players defend a stronghold, summon creatures into three lanes, and destroy an opposing citadel. The experience should combine accessible deployment controls with meaningful choices between inexpensive troops, frontline defenders, ranged specialists, summoners, and costly legendary beasts.

The visual direction uses ancient fortresses, a desolate battlefield, dragons, mythical creatures, and restrained fire-and-frost lighting. Fullscreen play should prioritize the battlefield and keep the complete creature roster immediately accessible. Audio should reinforce creature identity, spell feedback, and combat without overwhelming the player.

### Delivery principles

- Use original branding and generated artwork within the prototype.
- Preserve distinct combat roles and resource tradeoffs; rarity does not eliminate weaknesses.
- Keep gameplay understandable through costs, health, range, cooldown feedback, and concise instructions.
- Maintain a lightweight browser implementation with no runtime package installation.
- Preserve ongoing battle state when entering or leaving immersive mode.
- Validate material combat changes and describe verification limits accurately.

## 2. Professional prompt register

### P01 — Feasibility and initial scope

**Professional brief**

> Assess the feasibility of recreating the gameplay experience of Fort Conquer. Explain the practical implementation approach and any asset requirements. Do not begin development until the reference title and intended scope have been confirmed.

**Outcome:** Discussed a playable adaptation with comparable core mechanics and original visual assets. Implementation was deferred at this stage.

### P02 — Reference identification

**Professional brief**

> Identify the exact Fort Conquer title being referenced, including the developer and representative gameplay footage or screenshots, so that both parties can confirm the same source game.

**Outcome:** Identified Fort Conquer by DroidHen. The user subsequently confirmed the Uptodown reference linked below.

### P03 — First playable prototype

**Professional brief**

> Use the confirmed Fort Conquer reference to develop a playable prototype. Choose an appropriate game engine or browser technology. Include dragons, ancient mythical creatures, fort defense, and lane-based battles, with a cinematic medieval dark fantasy atmosphere. Prioritize a working prototype that can be reviewed immediately.

**Confirmed reference:** [Fort Conquer on Uptodown](https://fort-conquer.en.uptodown.com/android)

**Delivered:** Emberfall's initial three-lane battle, five creature classes, destructible forts, essence economy, enemy waves, evolution, dragonfire, restart, and original environment and creature artwork.

### P04 — Repository and development documentation

**Professional brief**

> Place the prototype under Git version control and add clear project guidance and an AI development log. Document the structure, local development process, verification commands, and known limitations.

**Delivered:** Confirmed the existing local repository and committed agent guidance, an AGENTS.md entry point, a development log, and ignore rules. This request did not create a GitHub repository.

### P05 — Creature variety and combat balance

**Professional brief**

> Expand the roster with four ordinary mythical troops and three legendary creatures. Include short-range fighters, long-range attackers, beasts, expendable minions, and a unit that summons other creatures. Add a centaur marksman and a fantasy interpretation of the Beast of Gévaudan associated with the Massif Central. Introduce costs, vulnerabilities, and cooldowns that prevent every creature from becoming overpowered.

**Delivered:** Four common troops, three legendaries, a summoned spirit wolf, traveling projectiles, frost slow, one-time charges, capped summoning, deployment cooldowns, and revised original-unit statistics.

### P06 — Desktop Safari handoff

**Professional brief**

> Open the playable game in desktop Safari and make the deployed prototype available for immediate review.

**Delivered:** Opened the deployed game in a new Safari tab. Its owner-private access required ChatGPT sign-in. Later local browser verification also used Safari.

### P07 — Immersive battlefield and bottom deck

**Professional brief**

> Add an immersive fullscreen play mode in which the battlefield occupies the available screen and creature selection remains accessible from a bottom deployment deck. Preserve battle progress while switching views and provide clear entry, exit, and keyboard controls.

**Delivered:** Native fullscreen with an immersive window fallback, a bottom creature deck, deployment controls, G/Escape shortcuts, and exit synchronization. The first iteration used a horizontally scrollable deck; P08 replaces this with an all-visible roster.

### P08 — Professional record, complete deck, and themed audio

**Professional brief**

> Rewrite the AI development record into a professional, reviewable document containing polished versions of all prior project prompts. Improve fullscreen usability so every selectable mythical creature is visible in the deployment deck. Add a coherent dark fantasy soundscape with background ambience, dragon deployment sounds, creature calls, magical activation cues, healing feedback, and combat impacts. Provide player-controlled volume and mute settings, and integrate the sounds with actual gameplay events.

**Implemented in v0.4:** This document; a complete twelve-card fullscreen deck; 23 original procedural sound cues; a looping battlefield ambience; audio controls and previews; and Mending Tide, a lane-healing spell with matching sound and visual feedback.

### P09 — Original battle music and GitHub release polish

**Professional brief**

> Add an original melodic background score with the mood of a medieval creature-strategy battle. Complete the final presentation and documentation polish, remove the inspiration sentence from the README, and push the verified changes to the existing GitHub repository. Preserve the repository owner’s README edits and retain accurate setup, access, and verification instructions.

**Implementation:** Confirmed the configured repository as `vees-1/ember-falls`, fetched and merged the owner’s README commits, separated hosted-preview access from local setup, and replaced the README with a release-oriented overview. Added *The Ashen Crown*, an original 48-second battle composition, independent music volume, an in-game preview, reproducible audio rendering, and composition/asset checks.

## 3. Implementation history

| Version | Scope | Source evidence |
| --- | --- | --- |
| v0.1 | Initial playable battle and generated artwork | Commit `54b33dc` |
| Documentation baseline | Agent guidance and initial AI development log | Commit `73cc7fa` |
| v0.2 | Expanded and rebalanced bestiary | Commit `91fd63f` |
| v0.3 | Immersive fullscreen and bottom deployment deck | Commit `d3bc198` |
| v0.4 | Complete deck, procedural soundscape, healing, and professional documentation | Commit `2cd5fe8` |
| v0.5 | Original melodic battle score, independent music mix, polished README, and GitHub synchronization | Current release; source commit recorded by Git and the publishing workflow |

### Architecture and responsibilities

| File | Responsibility |
| --- | --- |
| `dist/index.html` | Battlefield controls, creature deck, dialogs, and audio settings |
| `dist/style.css` | Standard layout, responsive fullscreen deck, and themed presentation |
| `dist/creatures.js` | Shared creature costs, stats, roles, abilities, and atlas source regions |
| `dist/game.js` | Combat simulation, resource economy, effects, inputs, and UI synchronization |
| `dist/immersive.js` | Native fullscreen, fitted window fallback, entry/exit handling, and deck reset |
| `dist/audio.js` | Deterministic sound synthesis, ambience, playback graph, mixing, and preferences |
| `dist/audio-ui.js` | Volume controls, mute, previews, output meter, and audio-dialog pause/resume |
| `scripts/smoke-test.cjs` | Deterministic gameplay regression checks |
| `scripts/audio-test.cjs` | Audio signal generation and loop-boundary checks |
| `.openai/hosting.json` | Existing Site identity and static deployment configuration |

## 4. Gameplay design and balance

The army contains twelve selectable creatures and one summoned-only minion. Common troops cost 18–65 essence. Mythic specialists have varied costs and roles. The three legendaries cost 180–240 essence and have longer deployment cooldowns.

- **Melee and frontline:** Imps, direwolves, satyrs, boars, golems, and the Beast serve different combinations of speed, durability, and damage.
- **Ranged specialists:** Skeleton archers and the centaur fire arrows; the wyvern slows enemies with frost projectiles; the dragon damages clusters with fire breath.
- **Summoning:** Morrigan calls a spirit wolf every ten seconds, with at most three living wolves per caller. Wolves cannot recursively summon or award essence when defeated.
- **Charge attacks:** Boars and the Beast receive a single bonus strike after sufficient movement.
- **Army limits:** Each side is limited to 45 living creatures.
- **Healing:** Mending Tide restores up to 90 health to each wounded living ally in the selected lane. It costs 90 essence, has a 35-second cooldown, cannot exceed maximum health, and cannot revive dead units. A cast with no valid wounded allies consumes no resources.

These values constitute an initial balance pass. Automated correctness checks do not establish competitive balance; player feedback is still required.

## 5. Fullscreen user experience

The fullscreen deck presents all twelve creatures simultaneously. Wide desktop layouts use one row; narrower layouts use two rows. Role filters remain available in the standard page view and reset to All on entry to immersive mode, preventing a prior filter from hiding creatures.

The battlefield toolbar provides audio mute, audio settings, fullscreen exit, speed, and pause. The bottom command area keeps essence, evolution, healing, and dragonfire visible. The player selects a creature and clicks a lane to deploy it.

| Input | Action |
| --- | --- |
| `1–9`, `0`, `-`, `=` | Select one of twelve creatures |
| Up / Down | Select a lane |
| Enter | Deploy the selected creature |
| Space | Pause or resume |
| G | Toggle immersive fullscreen |
| Escape | Leave immersive view or close an open dialog |
| F | Cast dragonfire |
| H | Cast Mending Tide |

## 6. Sound direction and implementation

### Sound design brief

> Create an original medieval dark fantasy soundscape: low winds through ruined stone, a restrained minor-key drone, distant war drums, and clear event-specific effects. Dragons should have a layered low growl and fiery exhale; beasts should have rough animal calls; magic should use resonant chimes and airy textures; healing should sound warmer and more restorative; combat should combine short metallic, stone, bone, and projectile impacts. Maintain comfortable levels and preserve gameplay clarity when many units fight at once.

This is the production brief for the procedural synthesis implemented in `dist/audio.js`. No third-party recordings, commercial soundtrack excerpts, or generated-audio services are used.

### Cue register

| Category | Cues and gameplay integration |
| --- | --- |
| Creature deployment | Dragon roar, beast growl, wolf call, griffin cry, stone rumble, imp rasp, bone rattle, spear accent, centaur flourish, and summoning chime |
| Spells | Dragonfire burst, frost, arcane evolution, spirit summoning, and restorative healing |
| Combat | Melee clashes, heavy impacts, bow release, and projectile impact feedback |
| Interface and battle flow | Selection, insufficient-resource feedback, siege opening, victory, and defeat |
| Background | A 32-second looping wind, low drone, and distant-drum ambience |

### Playback behavior

- The siege start gesture initializes or resumes the browser audio context.
- Master, ambience, and effects volumes are independently adjustable and saved locally.
- Both standard and fullscreen views provide a mute control.
- A settings dialog offers sound previews and a live output-level meter.
- Opening audio settings pauses the battle; closing the dialog resumes it if it was previously running.
- Background ambience fades on pause; audio is muted while the tab is hidden.
- Combat cues have per-category rate limits and a simultaneous-voice cap.
- Peak-bounded signals, short fade envelopes, a compressor, modest reverb, and stereo positioning control the mix.

### Technical reference

Browser audio initialization and user-control behavior follow the [MDN Web Audio best-practice guidance](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices). Fullscreen entry/exit behavior follows the [Fullscreen API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen).

## 7. Verification and evidence

### Automated checks

```sh
node --check dist/creatures.js
node --check dist/game.js
node --check dist/immersive.js
node --check dist/audio.js
node --check dist/audio-ui.js
node scripts/smoke-test.cjs
node scripts/audio-test.cjs
```

The gameplay suite verifies roster tiers, deployment costs and cooldowns, evolution, dragonfire, pause, projectile impact, summoning intervals and caps, slot replacement, minion reward rules, one-time charges, frost slow, unit limits, healing scope/cost/cooldown/health caps, battle completion, and restart.

The audio suite verifies 23 distinct cues, deterministic synthesis, finite PCM samples, measurable non-silent signals, bounded peaks, click-free envelopes, and a smooth 32-second ambience loop boundary. These are signal-level checks, not a subjective listening review.

### Browser verification performed

- Confirmed twelve of twelve creature cards fit fully within the immersive game bounds, with no horizontal deck overflow at the tested desktop viewport.
- Visually inspected the complete single-row deck in native desktop Safari fullscreen.
- Started the siege and deployed the dragon through the normal UI.
- Observed non-zero output-level readings for dragon and healing previews in the in-app browser.
- Adjusted master volume, verified the displayed setting, and restored it.
- Verified mute/unmute, sound-preview controls, and audio-dialog battle pause/resume.
- Checked the tested in-app browser console: no errors were reported.

### Review artifacts

| Artifact | Evidence |
| --- | --- |
| `playtest.png` | Initial prototype |
| `bestiary-playtest.png` | Expanded twelve-creature roster |
| `fullscreen-playtest.png` | First immersive fullscreen iteration |
| `all-creatures-playtest.png` | Complete deck in native Safari fullscreen |
| `audio-playtest.png` | Audio controls and non-zero preview output |
| `ASSET-PROMPTS.md` | Original image-generation prompts |

## 8. Known limitations and next priorities

- The prototype has one battlefield; campaign progression, saves, breeding, and multiplayer are not implemented.
- Creature artwork uses static illustrations with simple movement rather than full animation frame sets.
- The audio is original procedural sound design rather than recorded creature performances or sampled orchestral instruments.
- Native fullscreen and audio activation remain subject to browser support and user-gesture policies. A fitted immersive window is provided when native fullscreen is unavailable.
- Responsive layouts are implemented; physical mobile-device verification and subjective listening across speakers/headphones remain outstanding.
- Future work should prioritize player balance feedback, richer animation, and a broader campaign before adding more unit complexity.

## 9. Release polish: The Ashen Crown

The new score is an original sixteen-bar composition at 80 BPM in D minor. A plucked ostinato supports a horn-like melody and sustained harmony, with low martial drums and restrained accents. Its 48-second rendered WAV is generated entirely from the source composition in `scripts/music-score.cjs`; no existing game soundtrack is copied or embedded.

Music has its own saved gain control, alongside ambience and effects, and a twelve-second preview in the mixer. The README now leads with the game’s own identity, a hosted-preview link, a correct localhost quick start, controls, roster roles, music information, verification commands, and an architecture map. Historical prompt entries remain intact as provenance.

Repository integration preserves the owner’s commits `ff4fa4f` and `15b9228` through a normal merge. The release uses the existing `main` branch and does not rewrite remote history or change the hosted Site’s access policy.

Music verification includes non-silent output, headroom, populated and developing bars, valid WAV metadata, loop endpoints, and exact reproducibility from source. The procedural effects and gameplay suites remain part of the release checks. The in-app browser decoded the WAV successfully and reported non-zero output during the theme preview; its independent volume control was visible in the mixer. No browser console errors were reported in the checked session.

## 10. Record maintenance

Append a numbered prompt entry when the user provides a new task. Preserve prior intent and distinguish professionally edited prompts from exact executed asset prompts. Record only changes and checks that actually occurred. Keep secrets and unrelated personal data out of the repository. Update limitations when a feature is verified, deferred, or changed; do not silently describe planned work as completed.
