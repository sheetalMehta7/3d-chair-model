// src/animator.js
// Handles the RAF loop, intro rotation, and render calls

const INTRO_ROTATIONS = 1.5; // full rotations on load
const INTRO_FRAMES    = 80;  // frames to complete intro spin

let introFrame = 0;
let introComplete = false;
let chairModel   = null;
let onIntroDone  = null;

export function setChairModel(model, callback) {
  chairModel = model;
  onIntroDone = callback;
}

export function startLoop(renderer, scene, camera, controls) {
  let lastTime = performance.now();

  function tick(now) {
    const delta = Math.min((now - lastTime) / 1000, 0.05); // cap delta at 50ms
    lastTime = now;

    // Intro rotation
    if (chairModel && !introComplete) {
      const progress = introFrame / INTRO_FRAMES;
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      chairModel.rotation.y = Math.PI + eased * (Math.PI * 2 * INTRO_ROTATIONS);

      introFrame++;
      if (introFrame >= INTRO_FRAMES) {
        introComplete = true;
        onIntroDone?.();
      }
    }

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}