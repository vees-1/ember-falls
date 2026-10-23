# Emberfall — Dragon Siege

Original dark fantasy lane strategy prototype inspired by Fort Conquer. Built with HTML, CSS, and a custom Canvas 2D game loop. No install or build step is required.

## Play locally

Run `python3 -m http.server 4173 --directory dist` from this folder and open [http://localhost:4173.](https://emberfall-dragon-siege-vineet.mintycream3.chatgpt.site)

Choose a creature, then click a lane to deploy. Keys 1–9, 0, minus, and equals select the twelve creatures. Arrow keys change the selected lane, Enter summons, F casts dragonfire, and Space pauses. Use role filters to find frontline, ranged, summoner, beast, or legendary creatures.

Destroy the opposing fort before your own falls. Essence regenerates at 12 per second; kills award essence based on enemy cost. Summoned wolves grant no essence. Evolution improves all existing and future allies. Enemy waves gradually introduce stronger units. Sound is optional.

## Immersive fullscreen

Click **Fullscreen** in the battlefield controls, or press **G**. The battlefield fills the screen and the twelve-creature deck stays along the bottom, alongside essence, army evolution, and dragonfire. Browse with deck arrows or horizontal scrolling, select a creature, then click a lane.

Use **Exit**, **Escape**, or **G** to return to the page without restarting the battle. If native fullscreen is unavailable or blocked by an embedding browser, the same layout fills the browser window. Desktop Safari native fullscreen has been playtested.

## Roster and tradeoffs

| Creature | Tier | Essence | Health | Role |
| --- | --- | ---: | ---: | --- |
| Cinder Imp | Common | 18 | 50 | Cheap melee minion |
| Bone Archer | Common | 35 | 65 | Fragile long-range support |
| Thornhoof | Common | 50 | 160 | Satyr spearman |
| Bramble Boar | Common | 65 | 290 | Durable beast, low damage, first charge bonus |
| Frostfang | Mythic | 40 | 120 | Swift direwolf |
| Sunclaw | Mythic | 70 | 180 | Griffin skirmisher |
| Runestone | Mythic | 95 | 520 | Slow golem tank, low damage |
| Rimewraith | Mythic | 130 | 210 | Ranged wyvern, slowing bolts |
| Emberwing | Mythic | 180 | 300 | Slow dragon, splash damage |
| Asterion | Legendary | 180 | 200 | Centaur marksman, 265 range, 22-second deployment cooldown |
| Morrigan | Legendary | 200 | 190 | Weak direct attacks; summons one spirit wolf every 10 seconds, at most three living wolves per caller; 28-second deployment cooldown |
| Beast of Gévaudan | Legendary | 240 | 600 | Melee ravager, first charge bonus, 30-second deployment cooldown |

Charges require 80 paces of travel and only apply once per creature. Each side has a 45-creature limit. Ranged attacks travel as projectiles. Expensive ranged units need frontline protection.

## Verify

```sh
node --check dist/creatures.js
node --check dist/game.js
node scripts/smoke-test.cjs
```

The smoke test checks roster tiers, deployment costs/cooldowns, evolution, dragonfire, pause, projectile impact, summoning intervals/caps/replacements, minion reward rules, one-time charges, frost slow, unit limits, full battles, and restart.

## Prototype scope

One battlefield, twelve creature classes plus a summoned minion, five escalating wave tiers, and three evolution upgrades. Illustrated sprites have simple movement rather than full walking animation frames. Campaign progression, breeding, multiplayer, and saves are future work. Balance is an initial tuning pass and needs player feedback.

## Artwork

Original images created with the built-in image generation tool; see ASSET-PROMPTS.md. Artwork lives in dist/assets/.
# ember-falls
