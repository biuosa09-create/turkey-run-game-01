// Gobble Dash — the turkey: run, jump, duck and dash physics.
import { GROUND_Y, TURKEY } from './config.js';

export function createTurkey() {
  return {
    x: TURKEY.x,
    y: GROUND_Y - TURKEY.h,
    vy: 0,
    w: TURKEY.w,
    h: TURKEY.h,
    ducking: false,
    dashing: 0,
    dashCooldown: 0,
    stumble: 0,
    runPhase: 0,
    alive: true,
  };
}

export function updateTurkey(t, dt, input, speed) {
  t.runPhase += dt * (speed / 28);
  if (t.dashCooldown > 0) t.dashCooldown -= dt;
  if (t.stumble > 0) t.stumble -= dt;

  const onGround = t.y + t.h >= GROUND_Y;
  t.ducking = onGround && input.held('duck');

  if (input.wasPressed('jump') && onGround && !t.ducking) {
    t.vy = TURKEY.jumpVelocity;
    t.ducking = false;
  }
  if (input.wasPressed('dash') && t.dashCooldown <= 0 && t.dashing <= 0) {
    t.dashing = TURKEY.dashTime;
    t.dashCooldown = TURKEY.dashCooldown;
  }
  if (t.dashing > 0) t.dashing -= dt;

  t.vy += TURKEY.gravity * dt;
  t.y += t.vy * dt;
  if (t.y + t.h > GROUND_Y) {
    t.y = GROUND_Y - t.h;
    t.vy = 0;
  }
  t.h = t.ducking ? TURKEY.duckHeight : TURKEY.h;
}

export function turkeySpeedMultiplier(t) {
  if (t.dashing > 0) return TURKEY.dashSpeed;
  if (t.stumble > 0) return 0.55;
  return 1;
}
