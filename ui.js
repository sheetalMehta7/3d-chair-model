// src/ui.js
// Manages the colour tray, part options, material badge, and tray scrolling

import { COLORS } from './data/colors.js';
import { buildMaterial } from './materials.js';
import { setMaterial } from './model.js';

let activeOption = 'legs';
let activeSwatch = null;
let chairModel = null;

// DOM refs
const TRAY_TRACK = document.getElementById('js-tray-slide');
const TRAY       = document.getElementById('js-tray');
const OPTIONS    = document.querySelectorAll('.option');
const BTN_LEFT   = document.getElementById('js-tray-left');
const BTN_RIGHT  = document.getElementById('js-tray-right');
const BADGE      = document.getElementById('js-material-badge');
const BADGE_DOT  = document.getElementById('js-badge-dot');
const BADGE_NAME = document.getElementById('js-badge-name');
const HINT       = document.getElementById('js-drag-notice');

// ---- Badge ----------------------------------------------------------------

function showBadge(colorEntry) {
  if (colorEntry.texture) {
    BADGE_DOT.style.backgroundImage = `url(${colorEntry.texture})`;
    BADGE_DOT.style.backgroundSize = 'cover';
    BADGE_DOT.style.backgroundColor = '';
  } else {
    BADGE_DOT.style.backgroundImage = '';
    BADGE_DOT.style.backgroundColor = '#' + colorEntry.color;
  }
  BADGE_NAME.textContent = colorEntry.label ?? 'Custom';
  BADGE.classList.add('--visible');

  clearTimeout(BADGE._timer);
  BADGE._timer = setTimeout(() => BADGE.classList.remove('--visible'), 2200);
}

// ---- Swatch selection -----------------------------------------------------

function onSwatchClick(e) {
  const el = e.currentTarget;
  const idx = parseInt(el.dataset.key, 10);
  const colorEntry = COLORS[idx];

  // Deactivate old
  if (activeSwatch) activeSwatch.classList.remove('--active');
  activeSwatch = el;
  el.classList.add('--active');

  const mtl = buildMaterial(colorEntry);
  if (chairModel) setMaterial(chairModel, activeOption, mtl);

  showBadge(colorEntry);
}

// ---- Build tray swatches --------------------------------------------------

export function buildTray() {
  COLORS.forEach((color, i) => {
    const swatch = document.createElement('button');
    swatch.className = 'tray__swatch';
    swatch.dataset.key = i;
    swatch.setAttribute('aria-label', color.label ?? `Color ${i}`);
    swatch.title = color.label ?? '';

    if (color.texture) {
      swatch.style.backgroundImage = `url(${color.texture})`;
      swatch.style.backgroundSize = 'cover';
    } else {
      swatch.style.backgroundColor = '#' + color.color;
    }

    swatch.addEventListener('click', onSwatchClick);
    TRAY_TRACK.appendChild(swatch);
  });
}

// ---- Part options ---------------------------------------------------------

export function initOptions(model) {
  chairModel = model;

  OPTIONS.forEach((option) => {
    option.addEventListener('click', () => {
      OPTIONS.forEach((o) => o.classList.remove('--is-active'));
      option.classList.add('--is-active');
      activeOption = option.dataset.option;
    });
  });
}

// ---- Tray scroll (arrow buttons + drag) ----------------------------------

export function initTrayScroll() {
  const STEP = 160;
  let offset = 0;

  function clampOffset(val) {
    const max = TRAY_TRACK.scrollWidth - TRAY.clientWidth + 24;
    return Math.max(-max, Math.min(0, val));
  }

  function applyOffset(val) {
    offset = clampOffset(val);
    TRAY_TRACK.style.transform = `translateX(${offset}px)`;
  }

  BTN_LEFT.addEventListener('click', () => applyOffset(offset + STEP));
  BTN_RIGHT.addEventListener('click', () => applyOffset(offset - STEP));

  // Drag support
  let dragStartX = 0;
  let dragStartOffset = 0;
  let isDragging = false;

  function onDragStart(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragStartOffset = offset;
    TRAY_TRACK.style.transition = 'none';
  }

  function onDragMove(clientX) {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    applyOffset(dragStartOffset + delta);
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    TRAY_TRACK.style.transition = '';
  }

  TRAY_TRACK.addEventListener('mousedown', (e) => onDragStart(e.clientX));
  window.addEventListener('mousemove', (e) => onDragMove(e.clientX));
  window.addEventListener('mouseup', onDragEnd);

  TRAY_TRACK.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => { if (isDragging) { e.preventDefault(); onDragMove(e.touches[0].clientX); } }, { passive: false });
  window.addEventListener('touchend', onDragEnd);

  // Mouse wheel scroll
  TRAY.addEventListener('wheel', (e) => {
    e.preventDefault();
    applyOffset(offset - e.deltaY);
  }, { passive: false });
}

// ---- Drag notice hint ---------------------------------------------------

export function showDragHint() {
  HINT.classList.add('start');
}