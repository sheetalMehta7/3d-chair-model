import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Timer } from 'three/addons/misc/Timer.js'
import { GUI } from 'dat.gui';

// GUI controls setup
const gui = new GUI();
const loader = new GLTFLoader();
const canvas = document.querySelector('canvas.webgl')
const TRAY = document.getElementById('js-tray-slide');
const options = document.querySelectorAll(".option");
const DRAG_NOTICE = document.getElementById('js-drag-notice');
const LOADER = document.getElementById('js-loader');
let chairModel = null;
let loaded = false
const colors = [
  {
    texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/wood_.jpg',
    size: [2, 2, 2],
    shininess: 60
  },
  {
    texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/fabric_.jpg',
    size: [4, 4, 4],
    shininess: 0
  },
  {
    texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/pattern_.jpg',
    size: [8, 8, 8],
    shininess: 10
  },
  {
    texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/denim_.jpg',
    size: [3, 3, 3],
    shininess: 0
  },
  {
    texture: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/quilt_.jpg',
    size: [6, 6, 6],
    shininess: 0
  },
  {
    color: '131417'
  },
  {
    color: '374047'
  },
  {
    color: '5f6e78'
  },
  {
    color: '7f8a93'
  },
  {
    color: '97a1a7'
  },
  {
    color: 'acb4b9'
  },
  {
    color: 'DF9998',
  },
  {
    color: '7C6862'
  },
  {
    color: 'A3AB84'
  },
  {
    color: 'D6CCB1'
  },
  {
    color: 'F8D5C4'
  },
  {
    color: 'A3AE99'
  },
  {
    color: 'EFF2F2'
  },
  {
    color: 'B0C5C1'
  },
  {
    color: '8B8C8C'
  },
  {
    color: '565F59'
  },
  {
    color: 'CB304A'
  },
  {
    color: 'FED7C8'
  },
  {
    color: 'C7BDBD'
  },
  {
    color: '3DCBBE'
  },
  {
    color: '264B4F'
  },
  {
    color: '389389'
  },
  {
    color: '85BEAE'
  },
  {
    color: 'F2DABA'
  },
  {
    color: 'F2A97F'
  },
  {
    color: 'D85F52'
  },
  {
    color: 'D92E37'
  },
  {
    color: 'FC9736'
  },
  {
    color: 'F7BD69'
  },
  {
    color: 'A4D09C'
  },
  {
    color: '4C8A67'
  },
  {
    color: '25608A'
  },
  {
    color: '75C8C6'
  },
  {
    color: 'F5E4B7'
  },
  {
    color: 'E69041'
  },
  {
    color: 'E56013'
  },
  {
    color: '11101D'
  },
  {
    color: '630609'
  },
  {
    color: 'C9240E'
  },
  {
    color: 'EC4B17'
  },
  {
    color: '281A1C'
  },
  {
    color: '4F556F'
  },
  {
    color: '64739B'
  },
  {
    color: 'CDBAC7'
  },
  {
    color: '946F43'
  },
  {
    color: '66533C'
  },
  {
    color: '173A2F'
  },
  {
    color: '153944'
  },
  {
    color: '27548D'
  },
  {
    color: '438AAC'
  }
]
let activeOption = 'legs';

const helperVar = {
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf1f1f1,
  cameraFar: 5
}
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });

const INITIAL_MAP = [
  { childID: "back", mtl: INITIAL_MTL },
  { childID: "base", mtl: INITIAL_MTL },
  { childID: "cushions", mtl: INITIAL_MTL },
  { childID: "legs", mtl: INITIAL_MTL },
  { childID: "supports", mtl: INITIAL_MTL },
];

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

    if (color.texture) {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

//Swatch COLORS
function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {

    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10
    });
  }
  else {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10

    });
  }

  setMaterial(chairModel, activeOption, new_mtl);
}

function setMaterial(parent, type, mtl) {
  parent.traverse((o) => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}

for (const option of options) {
  option.addEventListener('click', selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

loader.load(
  '/models/chair/chair.glb',
  function (gltf) {
    chairModel = gltf.scene
    chairModel.scale.set(2, 2, 2)
    chairModel.position.y = -1;
    chairModel.rotation.y = Math.PI;

    // Add the textures to the models
    function initColor(parent, type, mtl) {
      parent.traverse((o) => {
        if (o.isMesh) {
          if (o.name.includes(type)) {
            o.material = mtl;
            o.nameID = type;
          }
        }
      });
    }

    // Set initial textures
    for (let object of INITIAL_MAP) {
      initColor(chairModel, object.childID, object.mtl);
    }

    scene.add(chairModel);
    LOADER.remove();
    console.log(gltf)
    chairModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.log('An error happened');
  }
);

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(helperVar.backgroundColor);
scene.fog = new THREE.Fog(helperVar.backgroundColor, 20, 100);

//camera
const camera = new THREE.PerspectiveCamera(50, helperVar.width / helperVar.height, 0.1, 1000);
camera.position.z = helperVar.cameraFar;
camera.position.x = 0;


// Floor
var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
var floorMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  shininess: 1
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor)

//lights
var ambientLight = new THREE.AmbientLight(0xffffff, 0.64);
ambientLight.position.set(2, 1, 1)
scene.add(ambientLight);

var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

scene.add(dirLight);

//direction light helper
// const directionalLightHelper = new THREE.DirectionalLightHelper(dirLight, 10)
// scene.add(directionalLightHelper)

//controls 
const control = new OrbitControls(camera, canvas)
control.maxPolarAngle = Math.PI / 2;
control.minPolarAngle = Math.PI / 3;
control.enableDamping = true;
control.enablePan = false;
control.dampingFactor = 0.1;
control.autoRotate = false;
control.autoRotateSpeed = 0.2;
scene.add(control)

//renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(helperVar.width, helperVar.height);
renderer.shadowMap.enabled = true

window.addEventListener('resize', () => {
  // Update sizes
  helperVar.width = window.innerWidth
  helperVar.height = window.innerHeight

  // Update camera
  camera.aspect = helperVar.width / helperVar.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(helperVar.width, helperVar.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//Animate
const timer = new Timer()
function animate() {
  timer.update()
  const elapsedTime = timer.getElapsed()

  control.update()
  window.requestAnimationFrame(animate);
  if (chairModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
  renderer.render(scene, camera);
}

animate();

// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 40) {
    chairModel.rotation.y +=(Math.PI/20);
  } else {
    loaded = true;
  }
}

let slider = document.getElementById('js-tray')
let sliderItems = document.getElementById('js-tray-slide')
let difference;

function slide(wrapper, items) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    threshold = 20,
    posFinal,
    slides = items.getElementsByClassName('tray__swatch');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
      items.style.left = (items.offsetLeft - posX2) + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) { } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);


// Create a raycaster and a vector to hold mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for click event
window.addEventListener('click', onClick, false);

function onClick(event) {
  event.preventDefault();

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let clickedMesh = intersects[0].object;
    console.log(clickedMesh, "clickedMesh")
    // focusCameraOnMesh(clickedMesh);
    
  }
}

// function focusCameraOnMesh(mesh) {
//   // Calculate a new position for the camera
//   const boundingBox = new THREE.Box3().setFromObject(mesh);
//   const center = boundingBox.getCenter(new THREE.Vector3());

//   // Set camera position based on the mesh's bounding box center
//   camera.position.copy(center);
//   camera.lookAt(mesh.position); // Look at the mesh

//   // Optionally, adjust camera distance from the mesh
//   const size = boundingBox.getSize(new THREE.Vector3());
//   const maxDim = Math.max(size.x, size.y, size.z);
//   const distance = maxDim * 2; // Adjust this factor as needed
//   const direction = camera.position.clone().sub(mesh.position).normalize();
//   camera.position.copy(mesh.position).add(direction.multiplyScalar(distance));

//   // Update controls if you are using them (OrbitControls, TrackballControls, etc.)
//   controls.target.copy(center); // Update controls target
//   controls.update(); // Make sure to call this if using OrbitControls or similar
// }