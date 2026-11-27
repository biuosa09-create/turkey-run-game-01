// Gobble Dash — every drawing: the turkey, the farmer, the farm and the
// kitchen, the HUD and the screens. All art is canvas primitives, drawn
// in code; the game ships no image files.
import { GROUND_Y, VIEW_W, VIEW_H } from './config.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawBackground(ctx, pal, scroll, stageName) {
  ctx.fillStyle = pal.sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // Low autumn sun.
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath(); ctx.arc(1080, 110, 62, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 3; i++) {
    const cx = ((i * 430 - scroll * 0.08) % (VIEW_W + 240) + VIEW_W + 240) % (VIEW_W + 240) - 120;
    ctx.beginPath(); ctx.ellipse(cx, 90 + i * 36, 90, 22, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Far hills and a barn silhouette.
  ctx.fillStyle = pal.far;
  ctx.beginPath();
  ctx.moveTo(0, 470);
  for (let x = 0; x <= VIEW_W; x += 160) ctx.lineTo(x, 470 - 60 * Math.sin((x + scroll * 0.15) / 260));
  ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a34d2d';
  const barnX = 980 - (scroll * 0.25 % 1600);
  ctx.fillRect(barnX, 380, 130, 110);
  ctx.beginPath(); ctx.moveTo(barnX - 12, 382); ctx.lineTo(barnX + 65, 330); ctx.lineTo(barnX + 142, 382); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f7e6c4';
  ctx.fillRect(barnX + 48, 430, 34, 60);
  // Ground.
  ctx.fillStyle = pal.ground;
  ctx.fillRect(0, GROUND_Y, VIEW_W, VIEW_H - GROUND_Y);
  ctx.fillStyle = pal.dirt;
  ctx.fillRect(0, GROUND_Y, VIEW_W, 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 3;
  for (let x = 0; x < VIEW_W; x += 90) {
    const gx = x - (scroll % 90);
    ctx.beginPath(); ctx.moveTo(gx, GROUND_Y + 34); ctx.lineTo(gx + 34, GROUND_Y + 34); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('STAGE: ' + stageName.toUpperCase(), 24, 40);
}

export function drawTurkey(ctx, t) {
  const bob = Math.sin(t.runPhase) * 4;
  const x = t.x, y = t.y + bob * (t.y + t.h >= GROUND_Y ? 1 : 0);
  const legSwing = Math.sin(t.runPhase) * 10;
  ctx.save();
  if (t.stumble > 0 && Math.floor(performance.now() / 90) % 2 === 0) ctx.globalAlpha = 0.45;
  // Tail fan.
  ctx.fillStyle = '#8a5a2b';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(x + 8, y + 30);
    ctx.rotate(i * 0.35);
    ctx.beginPath(); ctx.ellipse(0, -26, 10, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // Body.
  ctx.fillStyle = '#6b4423';
  ctx.beginPath(); ctx.ellipse(x + 32, y + 44, 30, 26, 0, 0, Math.PI * 2); ctx.fill();
  // Wing.
  ctx.fillStyle = '#54331a';
  ctx.beginPath(); ctx.ellipse(x + 26, y + 46, 18, 12, -0.4, 0, Math.PI * 2); ctx.fill();
  // Legs.
  ctx.strokeStyle = '#e8a33d';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x + 24, y + 68); ctx.lineTo(x + 24 + legSwing, y + 76); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 40, y + 68); ctx.lineTo(x + 40 - legSwing, y + 76); ctx.stroke();
  // Head and beak.
  ctx.fillStyle = '#6b4423';
  ctx.beginPath(); ctx.arc(x + 56, y + 12, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8a33d';
  ctx.beginPath(); ctx.moveTo(x + 68, y + 10); ctx.lineTo(x + 82, y + 14); ctx.lineTo(x + 68, y + 18); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d23c2e';
  ctx.beginPath(); ctx.ellipse(x + 62, y + 24, 5, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x + 60, y + 8, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(x + 61, y + 8, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function drawFarmer(ctx, fx, stride) {
  const y = GROUND_Y;
  const swing = Math.sin(stride) * 8;
  ctx.save();
  // Overalls and shirt.
  ctx.fillStyle = '#2f5d8a';
  ctx.fillRect(fx + 14, y - 66, 44, 66);
  ctx.fillStyle = '#c94f38';
  ctx.fillRect(fx + 8, y - 96, 56, 36);
  // Arms pumping.
  ctx.strokeStyle = '#c94f38';
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(fx + 56, y - 88); ctx.lineTo(fx + 78 + swing, y - 62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx + 16, y - 88); ctx.lineTo(fx - 4 - swing, y - 62); ctx.stroke();
  // Legs.
  ctx.strokeStyle = '#2f5d8a';
  ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(fx + 24, y - 66); ctx.lineTo(fx + 24 + swing, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx + 48, y - 66); ctx.lineTo(fx + 48 - swing, y); ctx.stroke();
  // Head, straw hat, beard.
  ctx.fillStyle = '#f0c08a';
  ctx.beginPath(); ctx.arc(fx + 36, y - 108, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8c33d';
  ctx.beginPath(); ctx.ellipse(fx + 36, y - 120, 30, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(fx + 22, y - 138, 28, 16);
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath(); ctx.ellipse(fx + 36, y - 96, 12, 7, 0, 0, Math.PI * 2); ctx.fill();
  // The carving knife he waves.
  ctx.strokeStyle = '#dfe6ee';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(fx + 78 + swing, y - 62); ctx.lineTo(fx + 96 + swing, y - 84); ctx.stroke();
  ctx.restore();
}

export function drawObstacle(ctx, o) {
  ctx.save();
  if (o.kind === 'fence') {
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(o.x, o.y + 10, 6, o.h - 10);
    ctx.fillRect(o.x + o.w - 6, o.y + 10, 6, o.h - 10);
    ctx.fillRect(o.x - 6, o.y + 18, o.w + 12, 8);
    ctx.fillRect(o.x - 6, o.y + 48, o.w + 12, 8);
  } else if (o.kind === 'hay') {
    ctx.fillStyle = '#d9a83c';
    ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a87c1e'; ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2 + i * 10, o.w / 2 - 8, o.h / 2 - 8, 0, 0, Math.PI); ctx.stroke();
    }
  } else if (o.kind === 'pumpkin') {
    ctx.save();
    ctx.translate(o.x + o.w / 2, o.y + o.h / 2);
    ctx.rotate(o.roll || 0);
    ctx.fillStyle = '#e8722a';
    ctx.beginPath(); ctx.ellipse(0, 0, o.w / 2, o.h / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#b34d12'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, o.w / 4, o.h / 2, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#3f7a2a'; ctx.fillRect(-4, -o.h / 2 - 8, 8, 12);
    ctx.restore();
  } else if (o.kind === 'scarecrow') {
    ctx.fillStyle = '#8a6d3b';
    ctx.fillRect(o.x + 18, o.y, 8, o.h);
    ctx.fillStyle = '#4a7a3f';
    ctx.fillRect(o.x, o.y + 22, o.w, 12);
    ctx.fillStyle = '#e8c33d';
    ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 12, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7a4a21';
    ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y - 6, 22, 6, 0, 0, Math.PI * 2); ctx.fill();
  } else if (o.kind === 'knife') {
    ctx.fillStyle = '#dfe6ee';
    ctx.beginPath(); ctx.moveTo(o.x + 9, o.y); ctx.lineTo(o.x + o.w, o.y + o.h * 0.7); ctx.lineTo(o.x + 9, o.y + o.h); ctx.lineTo(o.x, o.y + o.h * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(o.x + 4, o.y - 14, 10, 16);
  } else if (o.kind === 'oven') {
    ctx.fillStyle = '#3a3f46';
    roundRect(ctx, o.x, o.y, o.w, o.h, 8); ctx.fill();
    ctx.fillStyle = '#ff8c2e';
    ctx.fillRect(o.x + 12, o.y + 14, o.w - 24, 26);
    ctx.fillStyle = '#2a2e33';
    ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + 58, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff5a2e';
    ctx.font = 'bold 22px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('HOT!', o.x + o.w / 2, o.y + 30);
  } else if (o.kind === 'pot') {
    ctx.fillStyle = '#6b7280';
    roundRect(ctx, o.x, o.y, o.w, o.h, 10); ctx.fill();
    ctx.fillStyle = '#9aa3ad';
    ctx.fillRect(o.x - 8, o.y + 8, 10, 8);
    ctx.fillRect(o.x + o.w - 2, o.y + 8, 10, 8);
    ctx.fillStyle = '#ff8c2e';
    ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + 4, o.w / 2, 6, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function drawCorn(ctx, c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.fillStyle = c.golden ? '#ffd94a' : '#f2c14e';
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = c.golden ? '#c9a100' : '#b98a1e'; ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.moveTo(-8, i * 8); ctx.lineTo(8, i * 8); ctx.stroke();
  }
  ctx.fillStyle = '#3f7a2a';
  ctx.beginPath(); ctx.ellipse(10, -14, 6, 12, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function drawHUD(ctx, hud) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(20,14,8,0.55)';
  roundRect(ctx, 16, 52, 420, 92, 12); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('SCORE ' + hud.score, 32, 92);
  ctx.font = '20px system-ui, sans-serif';
  ctx.fillText('DIST ' + Math.floor(hud.distance) + ' m   STAGE ' + (hud.stageIndex + 1) + '/3', 32, 124);
  // Hearts.
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < hud.hearts ? '#e63946' : 'rgba(255,255,255,0.35)';
    const hx = 470 + i * 40, hy = 92;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 8);
    ctx.bezierCurveTo(hx - 14, hy - 8, hx - 26, hy + 8, hx, hy + 20);
    ctx.bezierCurveTo(hx + 26, hy + 8, hx + 14, hy - 8, hx, hy + 8);
    ctx.fill();
  }
  // Farmer proximity bar.
  ctx.fillStyle = 'rgba(20,14,8,0.55)';
  roundRect(ctx, VIEW_W - 320, 52, 304, 92, 12); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('FARMER BRAM', VIEW_W - 304, 82);
  const frac = Math.max(0, Math.min(1, hud.farmerGap / 460));
  // The bar fills as the farmer closes in: yellow while he gains, red when
  // he is about to grab the turkey.
  ctx.fillStyle = hud.farmerGap < 120 ? '#e63946' : '#ffd94a';
  ctx.fillRect(VIEW_W - 304, 96, 272 * (1 - frac), 16);
  ctx.fillStyle = '#fff';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(hud.farmerGap < 120 ? 'HE IS RIGHT BEHIND YOU!' : 'Keep running!', VIEW_W - 304, 132);
  // Dash meter.
  ctx.fillStyle = 'rgba(20,14,8,0.55)';
  roundRect(ctx, 16, 156, 220, 34, 10); ctx.fill();
  ctx.fillStyle = hud.dashReady ? '#ffd94a' : '#8a8a8a';
  ctx.fillRect(24, 164, 204 * hud.dashFrac, 18);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('DASH [SHIFT]', 30, 178);
  // Stage progress.
  ctx.fillStyle = 'rgba(20,14,8,0.55)';
  ctx.fillRect(0, VIEW_H - 18, VIEW_W, 18);
  ctx.fillStyle = '#ffd94a';
  ctx.fillRect(0, VIEW_H - 18, VIEW_W * hud.stageProgress, 18);
  ctx.restore();
}

function panel(ctx, title, lines, accent) {
  ctx.save();
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff7e6';
  roundRect(ctx, 290, 130, 700, 460, 18); ctx.fill();
  ctx.fillStyle = accent;
  ctx.fillRect(290, 130, 700, 10);
  ctx.fillStyle = '#2b1d0e';
  ctx.textAlign = 'center';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText(title, VIEW_W / 2, 220);
  ctx.font = '24px system-ui, sans-serif';
  let y = 280;
  for (const line of lines) { ctx.fillText(line, VIEW_W / 2, y); y += 42; }
  ctx.restore();
}

export function drawTitle(ctx, best) {
  drawBackground(ctx, { sky: '#f7c873', far: '#e8a94e', ground: '#b97e33', dirt: '#8f5f22' }, 0, 'Farmyard');
  // Gertie waiting at the start line, Bram already on her tail.
  drawTurkey(ctx, { x: 120, y: GROUND_Y - 76, h: 76, runPhase: 0.8, stumble: 0, ducking: false });
  drawFarmer(ctx, 8, 0.5);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff7e6';
  ctx.font = 'bold 84px system-ui, sans-serif';
  ctx.strokeStyle = '#7a3d12'; ctx.lineWidth = 10;
  ctx.strokeText('GOBBLE DASH', VIEW_W / 2, 190);
  ctx.fillText('GOBBLE DASH', VIEW_W / 2, 190);
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillStyle = '#2b1d0e';
  ctx.fillText("A turkey's great escape from Thanksgiving dinner", VIEW_W / 2, 240);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('SPACE / CLICK — jump      DOWN — duck      SHIFT — dash', VIEW_W / 2, 320);
  ctx.fillText('Dodge fences, pumpkins, knives and the oven. Grab corn.', VIEW_W / 2, 356);
  ctx.fillText('Do not let Farmer Bram catch you. Escape through the kitchen!', VIEW_W / 2, 392);
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillStyle = '#c94f38';
  ctx.fillText('PRESS ENTER OR CLICK TO RUN', VIEW_W / 2, 470);
  if (best > 0) {
    ctx.fillStyle = '#2b1d0e';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('Best score: ' + best, VIEW_W / 2, 520);
  }
  ctx.restore();
}

export function drawPaused(ctx) {
  panel(ctx, 'PAUSED', ['Take a breath, Gertie.', 'Press P or click to keep running.'], '#e8a33d');
}

export function drawCaught(ctx, score, distance, best) {
  panel(ctx, 'CAUGHT!', [
    'Farmer Bram got you. Dinner is served...',
    'Score: ' + score + '   Distance: ' + Math.floor(distance) + ' m',
    'Best: ' + best,
    'Press ENTER or click to try again.',
  ], '#c94f38');
}

export function drawEscaped(ctx, score, distance, best) {
  panel(ctx, 'ESCAPED!', [
    'Gertie slipped out of the kitchen and into the forest!',
    'Score: ' + score + '   Distance: ' + Math.floor(distance) + ' m',
    'Best: ' + best,
    'Press ENTER or click to run again.',
  ], '#3f7a2a');
}

export function drawStageClear(ctx, stageName) {
  ctx.save();
  ctx.fillStyle = 'rgba(20,12,6,0.55)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = '#fff7e6';
  ctx.textAlign = 'center';
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.fillText(stageName + ' CLEARED!', VIEW_W / 2, VIEW_H / 2 - 10);
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillText('The farmer is falling behind... keep going!', VIEW_W / 2, VIEW_H / 2 + 44);
  ctx.restore();
}
