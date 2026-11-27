// Gobble Dash — keyboard + mouse input, with edge-triggered presses so a
// held key never double-fires a jump or a menu action.
export function createInput(canvas) {
  const keys = new Set();
  const pressed = new Set();
  let onPress = null;

  function keyName(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') return 'jump';
    if (e.code === 'ArrowDown' || e.code === 'KeyS') return 'duck';
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyX') return 'dash';
    if (e.code === 'KeyP' || e.code === 'Escape') return 'pause';
    if (e.code === 'Enter') return 'confirm';
    if (e.code === 'KeyM') return 'mute';
    return null;
  }

  window.addEventListener('keydown', (e) => {
    const k = keyName(e);
    if (!k) return;
    e.preventDefault();
    if (!keys.has(k)) { pressed.add(k); if (onPress) onPress(k); }
    keys.add(k);
  });
  window.addEventListener('keyup', (e) => {
    const k = keyName(e);
    if (k) keys.delete(k);
  });
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    pressed.add('jump');
    if (onPress) onPress('jump');
  });

  return {
    held(name) { return keys.has(name); },
    wasPressed(name) { return pressed.has(name); },
    setPressHandler(fn) { onPress = fn; },
    endFrame() { pressed.clear(); },
  };
}
