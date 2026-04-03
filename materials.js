// src/materials.js
// Builds Three.js materials from color/texture data entries

import * as THREE from 'three';

const textureCache = new Map();

function loadTexture(url) {
  if (textureCache.has(url)) return textureCache.get(url);
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(url, tex);
  return tex;
}

/**
 * Build a MeshStandardMaterial from a COLORS entry.
 * @param {object} colorEntry - from src/data/colors.js
 * @returns {THREE.MeshStandardMaterial}
 */
export function buildMaterial(colorEntry) {
  if (colorEntry.texture) {
    const tex = loadTexture(colorEntry.texture);
    const repeat = colorEntry.size ?? [2, 2, 2];
    tex.repeat.set(repeat[0], repeat[1]);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    const roughness = colorEntry.shininess
      ? Math.max(0.05, 1 - colorEntry.shininess / 100)
      : 0.85;

    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness,
      metalness: 0.0,
    });
  }

  // Solid color
  const roughness = colorEntry.shininess
    ? Math.max(0.05, 1 - colorEntry.shininess / 100)
    : 0.7;

  return new THREE.MeshStandardMaterial({
    color: parseInt('0x' + colorEntry.color, 16),
    roughness,
    metalness: colorEntry.shininess > 40 ? 0.15 : 0.0,
  });
}