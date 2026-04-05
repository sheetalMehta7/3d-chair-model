# FORMA — Chair Studio

A browser-based 3D chair configurator built with Three.js and Vite. Rotate the model freely and customize each part with textures or solid colors in real time.

![Three.js](https://img.shields.io/badge/Three.js-r166-black?logo=threedotjs) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![License](https://img.shields.io/badge/license-MIT-green)

<img width="1918" height="926" alt="image" src="https://github.com/user-attachments/assets/691c7a98-3a4a-4075-a1e2-49ac39688331" />

---

## Features

- 🪑 **Part-based customization** — independently style legs, cushions, base, supports, and back
- 🎨 **55+ materials** — textures (wood, linen, denim, quilt) and solid colors
- 🔄 **Smooth intro animation** — ease-out spin on load
- 💡 **PBR lighting** — key, fill, and rim lights with soft shadows
- 📱 **Responsive** — adapts layout for mobile and tablet

## Getting Started

```bash
git clone https://github.com/your-username/forma-chair-studio.git
cd forma-chair-studio
npm install
npm run dev
```

> Place your `chair.glb` model at `public/models/chair/chair.glb`.

## Project Structure

```
src/
├── main.js        # Entry point
├── scene.js       # Camera, lights, renderer, controls
├── model.js       # GLB loader + part material init
├── materials.js   # Material builder with texture cache
├── animator.js    # RAF loop + intro rotation
├── ui.js          # Tray, options, scroll, badge
└── data/
    └── colors.js  # All swatches with labels
```

## Built With

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — dev server & bundler
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) — typography
