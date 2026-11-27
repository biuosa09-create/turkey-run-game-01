// Gobble Dash — shared tuning and stage definitions.
// All numbers are in game units: the world is 1280 x 720, the turkey runs
// left to right while the ground scrolls under it.
export const VIEW_W = 1280;
export const VIEW_H = 720;
export const GROUND_Y = 620;

export const TURKEY = {
  x: 220,
  w: 64,
  h: 76,
  jumpVelocity: -1180,
  gravity: 3000,
  duckHeight: 44,
  dashTime: 0.28,
  dashCooldown: 1.6,
  dashSpeed: 1.9,
};

export const FARMER = {
  // How close the farmer gets before the turkey is caught (px gap).
  catchGap: 26,
  // Farmer closes this many px per second while the turkey is stumbling.
  chaseSpeed: 260,
  // Farmer drifts back this many px per second while the turkey runs clean.
  driftBack: 46,
  startGap: 340,
};

// Three stages: the escape runs from the farmyard, through the cornfield,
// and out through the farmhouse kitchen to the forest gate.
export const STAGES = [
  {
    name: 'Farmyard',
    length: 620,
    baseSpeed: 330,
    spawnGap: [420, 760],
    palette: { sky: '#f7c873', far: '#e8a94e', ground: '#b97e33', dirt: '#8f5f22' },
    obstacles: ['fence', 'hay', 'pumpkin'],
  },
  {
    name: 'Cornfield',
    length: 680,
    baseSpeed: 390,
    spawnGap: [380, 700],
    palette: { sky: '#f2b04e', far: '#d99a35', ground: '#9a6a24', dirt: '#7a5219' },
    obstacles: ['fence', 'pumpkin', 'knife', 'scarecrow'],
  },
  {
    name: 'Kitchen',
    length: 740,
    baseSpeed: 450,
    spawnGap: [340, 640],
    palette: { sky: '#e88a4e', far: '#c96a35', ground: '#7d4a2b', dirt: '#5f3820' },
    obstacles: ['oven', 'knife', 'pot', 'fence'],
  },
];

export const SCORE = { corn: 100, goldenCorn: 500, metre: 2, stageClear: 1000 };
