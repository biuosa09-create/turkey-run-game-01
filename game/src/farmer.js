// Gobble Dash — Farmer Bram, who chases the turkey from the left edge.
// He never runs the turkey down while it runs clean; every stumble lets
// him close in, and a clean stretch lets the turkey pull away again.
import { FARMER } from './config.js';

export function createFarmer() {
  return { gap: FARMER.startGap, closing: false, stride: 0 };
}

export function updateFarmer(f, dt, turkeyStumbling, speed) {
  f.stride += dt * (speed / 22);
  if (turkeyStumbling) {
    f.gap -= FARMER.chaseSpeed * dt;
    f.closing = true;
  } else {
    f.gap += FARMER.driftBack * dt;
    f.closing = false;
  }
  if (f.gap > 460) f.gap = 460;
}

export function farmerCaught(f) {
  return f.gap <= FARMER.catchGap;
}

export function farmerX(f, turkey) {
  return turkey.x - f.gap - 70;
}
