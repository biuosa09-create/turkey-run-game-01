// Gobble Dash — deterministic screenshot staging. The kit's shots.json
// points at these queries: ?shot=title|play|kitchen|end&seed=N stages a
// fixed scene and freezes it, so screenshots are real renders of the
// game's own code and reproducible.
import { createGame, stageScene, draw } from './game.js';
import { createInput } from './input.js';

export function stageShot(canvas, query) {
  const params = new URLSearchParams(query);
  const shot = params.get('shot') || 'title';
  const seed = Number(params.get('seed') || 7);
  const input = createInput(canvas);
  const g = createGame(canvas, input);
  stageScene(g, shot, seed);
  draw(g);
  return g;
}
