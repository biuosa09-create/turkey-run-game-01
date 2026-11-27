// Gobble Dash — the game itself: states, the loop, collisions, score,
// hearts, and the stage-clear / caught / escaped endings.
import { VIEW_W, VIEW_H, GROUND_Y, TURKEY, SCORE, STAGES } from './config.js';
import { createTurkey, updateTurkey, turkeySpeedMultiplier } from './turkey.js';
import { createFarmer, updateFarmer, farmerCaught, farmerX } from './farmer.js';
import { createWorld, updateWorld, stageName, stagePalette, stageProgress } from './world.js';
import { sfx, startMusic, stopMusic } from './audio.js';
import * as R from './render.js';

const BEST_KEY = 'gobble-dash-best';

export function createGame(canvas, input) {
  const ctx = canvas.getContext('2d');
  const g = {
    canvas, ctx, input,
    state: 'title',
    turkey: createTurkey(),
    farmer: createFarmer(),
    world: createWorld(20261127),
    score: 0,
    hearts: 3,
    scroll: 0,
    stageFlash: 0,
    best: 0,
    lastTime: 0,
    alarmAt: 0,
  };
  try { g.best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { g.best = 0; }
  return g;
}

function startRun(g) {
  g.turkey = createTurkey();
  g.farmer = createFarmer();
  g.world = createWorld((Math.random() * 1e9) | 0);
  g.score = 0;
  g.hearts = 3;
  g.scroll = 0;
  g.stageFlash = 0;
  g.state = 'playing';
  startMusic();
}

function endRun(g, escaped) {
  g.state = escaped ? 'escaped' : 'caught';
  stopMusic();
  if (escaped) sfx.escaped(); else sfx.caught();
  if (g.score > g.best) {
    g.best = g.score;
    try { localStorage.setItem(BEST_KEY, String(g.best)); } catch (e) { /* private mode */ }
  }
}

function step(g, dt) {
  const input = g.input;
  if (input.wasPressed('mute')) {
    const m = sfx.toggleMute();
    if (m) stopMusic(); else if (g.state === 'playing') startMusic();
  }

  if (g.state === 'title') {
    if (input.wasPressed('confirm') || input.wasPressed('jump')) startRun(g);
    return;
  }
  if (g.state === 'caught' || g.state === 'escaped') {
    if (input.wasPressed('confirm') || input.wasPressed('jump')) startRun(g);
    return;
  }
  if (g.state === 'paused') {
    if (input.wasPressed('pause') || input.wasPressed('confirm') || input.wasPressed('jump')) {
      g.state = 'playing';
      startMusic();
    }
    return;
  }

  // playing
  if (input.wasPressed('pause')) { g.state = 'paused'; stopMusic(); return; }
  if (g.stageFlash > 0) g.stageFlash -= dt;

  const t = g.turkey;
  updateTurkey(t, dt, input, g.world.speed);
  const speed = g.world.speed * turkeySpeedMultiplier(t);
  g.scroll += speed * dt;

  const result = updateWorld(g.world, dt, speed, t);
  if (result === 'stage') {
    g.score += SCORE.stageClear;
    g.stageFlash = 1.4;
    g.farmer.gap = Math.min(460, g.farmer.gap + 140);
    sfx.stageClear();
  } else if (result === 'escaped') {
    g.score += SCORE.stageClear;
    endRun(g, true);
    return;
  } else if (Array.isArray(result)) {
    for (const ev of result) {
      if (ev.type === 'corn') { g.score += SCORE.corn; sfx.collect(); }
      else if (ev.type === 'golden') { g.score += SCORE.goldenCorn; t.dashCooldown = 0; sfx.golden(); }
      else if (ev.type === 'hit') {
        g.hearts -= 1;
        t.stumble = 0.9;
        sfx.stumble();
        if (g.hearts <= 0) { endRun(g, false); return; }
      }
    }
  }

  g.score += Math.floor(speed * dt * SCORE.metre / 10);
  updateFarmer(g.farmer, dt, t.stumble > 0, speed);
  if (farmerCaught(g.farmer)) { endRun(g, false); return; }
  if (g.farmer.gap < 120 && performance.now() - g.alarmAt > 900) {
    g.alarmAt = performance.now();
    sfx.alarm();
  }
}

export function draw(g) {
  const ctx = g.ctx;
  const w = g.world;
  const pal = stagePalette(w);
  R.drawBackground(ctx, pal, g.scroll, stageName(w));
  for (const c of w.corns) R.drawCorn(ctx, c);
  for (const o of w.obstacles) R.drawObstacle(ctx, o);
  R.drawFarmer(ctx, farmerX(g.farmer, g.turkey), g.farmer.stride);
  R.drawTurkey(ctx, g.turkey);

  if (g.state === 'playing' || g.state === 'paused') {
    R.drawHUD(ctx, {
      score: g.score,
      distance: w.distance / 10,
      hearts: g.hearts,
      stageIndex: w.stageIndex,
      farmerGap: Math.round(g.farmer.gap),
      dashReady: g.turkey.dashCooldown <= 0,
      dashFrac: Math.max(0, Math.min(1, 1 - g.turkey.dashCooldown / 1.6)),
      stageProgress: (w.stageIndex + stageProgress(w)) / STAGES.length,
    });
  }
  if (g.state === 'title') R.drawTitle(ctx, g.best);
  else if (g.state === 'paused') R.drawPaused(ctx);
  else if (g.state === 'caught') R.drawCaught(ctx, g.score, w.distance / 10, g.best);
  else if (g.state === 'escaped') R.drawEscaped(ctx, g.score, w.distance / 10, g.best);
  if (g.stageFlash > 0 && g.state === 'playing') R.drawStageClear(ctx, stageName(w));
}

export function frame(g, time) {
  const dt = Math.min(0.05, (time - g.lastTime) / 1000 || 0.016);
  g.lastTime = time;
  step(g, dt);
  draw(g);
  g.input.endFrame();
  requestAnimationFrame((t) => frame(g, t));
}

// Test hooks: stage a deterministic scene for screenshots.
export function stageScene(g, scene, seed) {
  startRun(g);
  g.world = createWorld(seed || 7);
  if (scene === 'title') { g.state = 'title'; stopMusic(); return; }
  if (scene === 'end') { g.state = 'caught'; g.score = 2840; g.world.distance = 14200; stopMusic(); return; }
  if (scene === 'escaped') { g.state = 'escaped'; g.score = 9120; g.world.distance = 20400; stopMusic(); return; }
  if (scene === 'kitchen') {
    g.world.stageIndex = 2;
    g.world.distanceInStage = 3000;
    g.farmer.gap = 90;
    g.hearts = 2;
    g.score = 4310;
    // A hot oven and a falling knife already in frame.
    g.world.obstacles.push({ kind: 'oven', x: 820, y: GROUND_Y - 92, w: 110, h: 92, passed: false, hit: false });
    g.world.obstacles.push({ kind: 'knife', x: 1040, y: 60, w: 18, h: 96, vy: 620, falling: true, passed: false, hit: false });
    g.world.obstacles.push({ kind: 'pot', x: 1160, y: GROUND_Y - 46, w: 60, h: 46, passed: false, hit: false });
  } else {
    // play: mid farmyard, farmer closing, corn ahead.
    g.world.distanceInStage = 1800;
    g.farmer.gap = 150;
    g.score = 1250;
    g.world.corns.push({ x: 700, y: GROUND_Y - 150, golden: false, taken: false });
    g.world.corns.push({ x: 756, y: GROUND_Y - 150, golden: false, taken: false });
    g.world.obstacles.push({ kind: 'fence', x: 900, y: GROUND_Y - 84, w: 26, h: 84, passed: false, hit: false });
  }
  // Advance a few fixed steps so the scene has motion baked in.
  for (let i = 0; i < 40; i++) {
    updateTurkey(g.turkey, 0.016, { held: () => false, wasPressed: () => false }, g.world.speed);
    updateWorld(g.world, 0.016, g.world.speed, g.turkey);
    g.scroll += g.world.speed * 0.016;
  }
  stopMusic();
}
