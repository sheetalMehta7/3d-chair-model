// src/main.js
// Entry point — wires scene, model, UI, and animation together

import { createScene }     from './scene.js';
import { loadChair }       from './model.js';
import { buildTray, initOptions, initTrayScroll, showDragHint } from './ui.js';
import { setChairModel, startLoop } from './animator.js';

// ---- DOM refs -------------------------------------------------------
const canvas    = document.querySelector('canvas.webgl');
const loader    = document.getElementById('js-loader');
const loadFill  = document.getElementById('js-load-fill');
const loadLabel = document.getElementById('js-load-label');
const app       = document.getElementById('app');

// ---- Bootstrap -------------------------------------------------------

async function init() {
  // 1. Build the Three.js scene
  const { scene, camera, renderer, controls } = createScene(canvas);

  // 2. Populate the colour tray (can happen before model loads)
  buildTray();
  initTrayScroll();

  // 3. Update loader progress
  function onProgress(pct) {
    if (loadFill) loadFill.style.width = pct + '%';
    if (loadLabel) loadLabel.textContent = `Loading… ${pct}%`;
  }

  // 4. Load model
  let chairModel;
  try {
    chairModel = await loadChair(onProgress);
  } catch (err) {
    if (loadLabel) loadLabel.textContent = 'Failed to load model.';
    console.error(err);
    return;
  }

  scene.add(chairModel);

  // 5. Wire UI to model
  initOptions(chairModel);

  // 6. Register model with animator; show app when intro finishes
  setChairModel(chairModel, () => {
    showDragHint();
  });

  // 7. Hide loader, reveal app
  if (loadFill) loadFill.style.width = '100%';
  if (loadLabel) loadLabel.textContent = 'Ready';

  setTimeout(() => {
    loader?.classList.add('--hidden');
    app?.classList.remove('app--hidden');
  }, 400);

  // 8. Start render loop
  startLoop(renderer, scene, camera, controls);
}

init();