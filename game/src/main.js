// Gobble Dash — boot. Sizes the canvas to the window, wires input, and
// either stages a deterministic screenshot (?shot=) or starts the game.
import { createGame, frame } from './game.js';
import { createInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const params = new URLSearchParams(location.search);

function fitCanvas() {
  canvas.width = 1280;
  canvas.height = 720;
}

fitCanvas();
window.addEventListener('resize', fitCanvas);

if (params.has('shot')) {
  stageShot(canvas, location.search);
} else {
  const input = createInput(canvas);
  const game = createGame(canvas, input);
  const status = document.getElementById('status');
  input.setPressHandler((key) => {
    if (status) status.textContent = 'Gobble Dash: ' + game.state + ', score ' + game.score;
  });
  requestAnimationFrame((t) => frame(game, t));
}
