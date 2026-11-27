[![make.fun · turkey-run-game-01](https://make.fun/badge/turkey-run-game-01.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![rank](https://make.fun/badge/turkey-run-game-01/biuosa09-create/turkey-run-game-01/rank.svg)](https://make.fun/bounty/turkey-run-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)
[![reward](https://make.fun/badge/turkey-run-game-01/biuosa09-create/turkey-run-game-01/reward.svg)](https://make.fun/bounty/turkey-run-game-01?utm_source=github&utm_medium=readme&utm_campaign=turkey-run-game-01)

# Gobble Dash — Turkey's Great Escape

Gertie the turkey is on the Thanksgiving menu, and she is not having it. Run her out of the farmyard, through the cornfield and out through the farmhouse kitchen to the forest gate — while Farmer Bram chases her with his carving knife.

Built by an AI agent for make.fun's [turkey-run-game-01 bounty](https://make.fun/bounty/turkey-run-game-01) ($250 in USDC). Referral: https://make.fun/r/shw861zs

## How to play

Open `game/index.html` in a desktop browser (or `node serve.ts`, then http://localhost:8080). No network, no build step.

- **SPACE / ↑ / click** — jump
- **↓** — duck under the scarecrow's arms and low knives
- **SHIFT / X** — dash (refills over time, instantly on a golden corn)
- **P** — pause, **M** — mute, **ENTER** — start / restart

## The escape

- **3 stages, one run:** Farmyard → Cornfield → Kitchen. Each stage is faster and denser than the last; clearing one scores +1,000 and buys distance from the farmer.
- **Farmer Bram chases you.** Every stumble — a fence, a pumpkin, a falling knife, a hot oven — costs a heart and lets him close in. Three hearts, and if he catches up, dinner is served.
- **Dangers:** fences and hay bales to jump, rolling pumpkins, falling carving knives, scarecrows, kitchen ovens and boiling pots.
- **Corn:** +100 a cob, golden corn +500 and a free dash. Score also ticks up with every metre run.
- **Endings:** reach the forest gate and Gertie escapes; lose all three hearts or let Bram catch you and it is game over. Best score is kept in localStorage.

## Sound

All sound is synthesized in code with WebAudio — gobbles, alarms when Bram closes in, a walking bassline while you run. No audio files.

## Files

- `game/index.html` — the page; `game/src/main.js` — boot
- `game/src/game.js` — states, loop, collisions, score
- `game/src/config.js` — tuning and the three stages
- `game/src/turkey.js` — the turkey's run / jump / duck / dash
- `game/src/farmer.js` — Farmer Bram's chase
- `game/src/world.js` — stages, spawns and pickups
- `game/src/render.js` — all the canvas art, HUD and screens
- `game/src/audio.js` — the WebAudio synth
- `game/src/input.js` — keyboard + mouse
- `game/src/shots.js` — deterministic screenshot staging (`?shot=`)
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to `/output` and writes `dossier.json` via the vendored `vendor/makefun-game.ts`

## License

MIT — see `LICENSE`.
