# Emberfall — Dragon Siege

Original dark fantasy lane strategy prototype inspired by Fort Conquer. Built with HTML, CSS, and a custom Canvas 2D game loop. No install or build step is required.

## Play locally

Run `python3 -m http.server 4173 --directory dist` from this folder and open http://localhost:4173.

Choose one of five creatures, then click a lane to deploy. Keys 1–5 select, arrow keys change the selected lane, Enter summons, F casts dragonfire, and Space pauses. Destroy the opposing fort before your own falls. Essence regenerates; kills award essence. Evolution improves all existing and future allies. Enemy waves scale over time. Sound is optional.

## Verify

`node --check dist/game.js`
`node scripts/smoke-test.cjs`

The smoke test checks deployment costs, evolution, dragonfire damage, pause, full combat to fort destruction, and restarting.

## Prototype scope

One battlefield, five creature classes, five escalating wave tiers, three evolution upgrades. Creatures currently use illustrated sprites with a floating movement animation, rather than full walking animation frames. Campaign progression, creature breeding, multiplayer, and saves are future work.

## Artwork

Original images created with the built-in image generation tool; see ASSET-PROMPTS.md. Artwork lives in dist/assets/.
