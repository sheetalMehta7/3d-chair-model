// src/model.js
// Loads the chair GLB and sets up initial materials

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { CHAIR_PARTS, INITIAL_COLOR } from './data/colors.js';

const loader = new GLTFLoader();

// Optional: Draco compression support
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
loader.setDRACOLoader(dracoLoader);

/**
 * Apply a material to all meshes of a given part type.
 */
export function setMaterial(model, partName, material) {
  if (!model) return;
  model.traverse((node) => {
    if (node.isMesh && node.userData.partID === partName) {
      node.material = material;
    }
  });
}

/**
 * Initialise part materials on load.
 */
function initPartMaterials(model) {
  const baseMtl = new THREE.MeshStandardMaterial({
    color: INITIAL_COLOR,
    roughness: 0.6,
    metalness: 0.1,
  });

  model.traverse((node) => {
    if (!node.isMesh) return;
    const name = node.name.toLowerCase();
    for (const part of CHAIR_PARTS) {
      if (name.includes(part)) {
        node.userData.partID = part;
        node.material = baseMtl.clone();
        break;
      }
    }
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

/**
 * Load the chair model. Returns a promise that resolves with the GLTF scene.
 * @param {function} onProgress  - called with 0–100
 */
export function loadChair(onProgress) {
  return new Promise((resolve, reject) => {
    loader.load(
      '/models/chair/chair.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 2, 2);
        model.position.y = -1;
        model.rotation.y = Math.PI;

        initPartMaterials(model);
        resolve(model);
      },
      (xhr) => {
        if (xhr.total > 0) {
          onProgress?.(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error('GLTFLoader error:', error);
        reject(error);
      }
    );
  });
}