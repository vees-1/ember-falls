# Agent guide

## Project
Emberfall: Dragon Siege is a playable dark fantasy lane strategy prototype inspired by Fort Conquer. Preserve its original branding and artwork.

## Structure
- `dist/index.html`: page structure and controls.
- `dist/style.css`: responsive dark fantasy presentation and immersive bottom-deck layout.
- `dist/immersive.js`: native fullscreen/fallback view, deck navigation, and exit synchronization.
- `dist/creatures.js`: shared creature definitions, rarity, costs, stats, abilities, and atlas regions.
- `dist/game.js`: Canvas renderer, combat simulation, projectiles, summoning, inputs, and UI updates.
- `dist/assets/`: original battlefield and creature sprite atlas.
- `scripts/smoke-test.cjs`: headless simulation smoke test using Node's built-in modules.
- `.openai/hosting.json`: existing Sites identity and static deployment configuration.
- `ASSET-PROMPTS.md`: artwork generation prompts.
- `ai logs.md`: dated development history.

## Local development
No package installation or build step is needed.

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173. Do not leave duplicate preview servers running.

## Verification

```sh
node --check dist/game.js
node scripts/smoke-test.cjs
```

For gameplay or UI changes, playtest the relevant controls in a browser and inspect the rendered result. Describe verification limits accurately. Extend the smoke test when changing meaningful combat behavior; avoid tests that merely repeat implementation details.

## Implementation guidance
- Keep creature stats in the shared creature definitions.
- Preserve canvas coordinate conversion when changing battlefield layout.
- Keep summon costs, health bars, evolution, cooldowns, and paused state consistent with the simulation.
- Preserve mouse, touch, and keyboard usability.
- Keep generated art in the project and document its prompts.
- Avoid adding dependencies unless the change justifies them.
- Update `ai logs.md` after substantive work, recording only tests actually performed.
- Keep credentials and tokens out of files, logs, commits, and output.
- Preserve the existing Sites project ID. Follow the Sites workflow for requested hosting changes; do not create a duplicate Site.

## Current scope
One battlefield, three lanes, twelve selectable creatures plus spirit-wolf minions, rarity and role filters, projectiles, capped summoning, charge bonuses, deployment cooldowns, escalating enemy wave tiers, army evolution, and immersive fullscreen with a bottom creature deck. Campaign progression, breeding, multiplayer, saves, and full sprite animation are future work.
