// Gobble Dash — the world: stage progression, obstacle and corn spawns,
// and the collisions that cost hearts or pay out points.
import { GROUND_Y, STAGES, SCORE } from './config.js';

// Small seeded RNG so screenshot staging (?shot=) is reproducible.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createWorld(seed) {
  return {
    stageIndex: 0,
    distance: 0,
    distanceInStage: 0,
    speed: STAGES[0].baseSpeed,
    obstacles: [],
    corns: [],
    nextSpawnAt: 500,
    rng: mulberry32(seed || 20261127),
    hideTimer: 0,
  };
}

function stageOf(w) { return STAGES[w.stageIndex]; }

function spawnObstacle(w) {
  const s = stageOf(w);
  const kinds = s.obstacles;
  const kind = kinds[Math.floor(w.rng() * kinds.length)];
  const x = 1280 + 80;
  const base = { kind, x, passed: false, hit: false };
  if (kind === 'fence') Object.assign(base, { w: 26, h: 84, y: GROUND_Y - 84 });
  else if (kind === 'hay') Object.assign(base, { w: 74, h: 62, y: GROUND_Y - 62 });
  else if (kind === 'pumpkin') Object.assign(base, { w: 52, h: 52, y: GROUND_Y - 52, roll: 0 });
  else if (kind === 'scarecrow') Object.assign(base, { w: 44, h: 110, y: GROUND_Y - 110 });
  else if (kind === 'knife') Object.assign(base, { w: 18, h: 96, y: -120, vy: 620, falling: true });
  else if (kind === 'oven') Object.assign(base, { w: 110, h: 92, y: GROUND_Y - 92 });
  else if (kind === 'pot') Object.assign(base, { w: 60, h: 46, y: GROUND_Y - 46 });
  w.obstacles.push(base);
}

function spawnCorn(w, golden) {
  const n = 3 + Math.floor(w.rng() * 3);
  for (let i = 0; i < n; i++) {
    w.corns.push({
      x: 1280 + 80 + i * 56,
      y: GROUND_Y - 120 - (w.rng() * 90),
      golden: golden && i === 0,
      taken: false,
    });
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function updateWorld(w, dt, speed, turkey) {
  const s = stageOf(w);
  w.speed = s.baseSpeed;
  const dist = speed * dt;
  w.distance += dist;
  w.distanceInStage += dist;
  if (w.hideTimer > 0) w.hideTimer -= dt;

  // Stage clear: roll into the next stage, or finish the escape.
  if (w.distanceInStage >= s.length * 10 && w.stageIndex < STAGES.length - 1) {
    w.stageIndex++;
    w.distanceInStage = 0;
    w.obstacles = [];
    w.corns = [];
    return 'stage';
  }
  if (w.distanceInStage >= s.length * 10 && w.stageIndex === STAGES.length - 1) {
    return 'escaped';
  }

  w.nextSpawnAt -= dist;
  if (w.nextSpawnAt <= 0) {
    const gap = s.spawnGap;
    w.nextSpawnAt = gap[0] + w.rng() * (gap[1] - gap[0]);
    const roll = w.rng();
    if (roll < 0.62) spawnObstacle(w);
    else if (roll < 0.9) spawnCorn(w, w.rng() < 0.25);
    else { spawnObstacle(w); spawnCorn(w, false); }
  }

  const events = [];
  for (const o of w.obstacles) {
    if (o.kind === 'knife' && o.falling) {
      o.y += o.vy * dt;
      if (o.y + o.h >= GROUND_Y) { o.y = GROUND_Y - o.h; o.falling = false; }
    } else {
      o.x -= speed * dt;
      if (o.kind === 'pumpkin') o.roll += dt * 6;
    }
    if (!o.passed && o.x + o.w < turkey.x) { o.passed = true; }
    if (!o.hit && w.hideTimer <= 0 && rectsOverlap(turkey, o)) {
      o.hit = true;
      events.push({ type: 'hit', obstacle: o.kind });
    }
  }
  for (const c of w.corns) {
    c.x -= speed * dt;
    if (!c.taken && rectsOverlap(turkey, { x: c.x - 16, y: c.y - 16, w: 32, h: 32 })) {
      c.taken = true;
      events.push({ type: c.golden ? 'golden' : 'corn' });
    }
  }
  w.obstacles = w.obstacles.filter((o) => o.x + o.w > -140);
  w.corns = w.corns.filter((c) => c.x > -60 && !c.taken);
  return events.length ? events : null;
}

export function stageName(w) { return STAGES[w.stageIndex].name; }
export function stagePalette(w) { return STAGES[w.stageIndex].palette; }
export function stageProgress(w) {
  const s = STAGES[w.stageIndex];
  return Math.min(1, w.distanceInStage / (s.length * 10));
}
export function scoreFor(distance) { return Math.floor(distance * SCORE.metre / 10); }
