// RIGHT /UP /TOWARDS ME ;)
// starMaterial = whiteMaterial for now

import '/style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';



// PAGE STATE
const worldState = {
  statsOn: false,
  starsState: {
    active: false,
    distance: 100
  },
  bassState: {
    active: false
  },
  scrolledFromTop: 0,
}


// CAMERA, SCENE SETUP
// ( field of view, aspect ratio, near , and far camera frustrum )
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('container')
const stats = new Stats();


// RENDERER, WINDOW SIZE, SCROLLING
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  ////
  trackScrolling();
};

function trackScrolling() {
  // the value of getBoundingClientRect().top will always be negative
  // the division factor is arbitrary for now
  worldState.scrolledFromTop = -1 * document.body.getBoundingClientRect().top;
  camera.position.y = 0 - worldState.scrolledFromTop / 230
}

document.body.onscroll = trackScrolling


// ANIMATION SETUP
let mixer;
let clock = new THREE.Clock();


// BUTTONS
document.getElementById("statsButton").onclick = function () {
  worldState.statsOn ? container.removeChild(stats.dom) : container.appendChild(stats.dom);
  worldState.statsOn = !worldState.statsOn;
};
document.getElementById("starsButton").onclick = function () {
  worldState.starsState.active = !worldState.starsState.active
};
document.getElementById("bassButton").onclick = function () {
  worldState.bassState.active = !worldState.bassState.active
};


// LIGHTING AND POINTERS
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper();
scene.add(pointLight, ambientLight);
scene.add(lightHelper, gridHelper)
pointLight.position.set(0, 4, 0)


// CAMERA INITIAL POSITIONING
camera.position.set(0, 0, 10);
camera.rotation.x = 0;


const bgLoader = new THREE.CubeTextureLoader();
const bgTexture = bgLoader.load([
  '/pictures/sky_sides.jpg',
  '/pictures/sky_sides.jpg',
  '/pictures/sky_top.jpg',
  '/pictures/sky_bottom.jpg',
  '/pictures/sky_sides.jpg',
  '/pictures/sky_sides.jpg',

]);
scene.background = bgTexture;


// GEOMETRIES
const geometry = new THREE.IcosahedronGeometry(0.5)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron)


let stars = [];
const starsGroup = new THREE.Group();
const starGeometry = new THREE.OctahedronGeometry(0.25);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, wireframe: true })
function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);
  const x = THREE.MathUtils.randFloatSpread(100)
  const y = Math.abs(THREE.MathUtils.randFloatSpread(100))
  const z = THREE.MathUtils.randFloatSpread(100);
  // y = Math.abs(y);
  star.name = `star`;
  star.position.set(x, y, z);
  star.rotation.x = [y]
  star.rotation.y = [x]
  star.originalPosition = { x, y, z }
  stars.push(star)
  starsGroup.add(star)
}

Array(200).fill().forEach(addStar)
scene.add(starsGroup)


let cubes = [];
let cubeZPosition = -30;
const cubesGroup = new THREE.Group();

const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false })

function addCube() {
  const cube = new THREE.Mesh((cubeGeometry),
    (cubeZPosition % 5 === 0 ? redMaterial : whiteMaterial));
  cube.name = `cube`;
  cube.position.set(2, cubeZPosition, 2);
  cubeZPosition++
  cubes.push(cube)
  cubesGroup.add(cube)
}

Array(40).fill().forEach(addCube)
scene.add(cubesGroup)


// OBJECT LOADERS
const loader = new GLTFLoader();

// let chair;
// loader.load('./3d_models/messed_up_chair.glb', function (gltf) {
//   chair = gltf.scene;
//   scene.add(chair);
//   // const chairControls = new OrbitControls(chair, renderer.domElement);
//   chair.position.set(-2, 0, 0);
//   console.log('chair loaded')
// }, function (xhr) {
//   // console.log((xhr.loaded / xhr.total * 100), "%  chair loaded")
// }, function (error) {
//   console.error(error);
// });


let bass;
loader.load('./3d_models/anibass.glb', function (gltf) {
  bass = gltf.scene;
  scene.add(bass);

  // necessary for the imported animations
  mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  bass.position.set(2, 0, 0);
  console.log('bass loaded')
}, function (xhr) {
  // console.log((xhr.loaded / xhr.total * 100), "% bass loaded")
}, function (error) {
  console.error(error);
});


const svgLoader = new SVGLoader();
const soundDesignGroup = new THREE.Group();

svgLoader.load('/pictures/sd.svg', function (data) {
  const paths = data.paths;

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const svgMaterial = new THREE.MeshBasicMaterial({
      color: 'red', // path.color
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const shapes = SVGLoader.createShapes(path);
    for (let j = 0; j < shapes.length; j++) {
      const shape = shapes[j];
      const svgGeometry = new THREE.ShapeGeometry(shape);
      const svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);

      soundDesignGroup.add(svgMesh);
    }
  }
  scene.add(soundDesignGroup);
  soundDesignGroup.rotateX(-Math.PI);
},
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% sound_design loaded');
  },
  function (error) {
    console.log(error);
  }
);

soundDesignGroup.scale.set(0.005, 0.005, 2)
soundDesignGroup.position.x = -3.600;
soundDesignGroup.position.y = 0.8;
soundDesignGroup.position.z = -10;

// const sunGroup = new THREE.Group();

// svgLoader.load('/pictures/black_sun.svg', function (data) {
//   const paths = data.paths;

//   for (let i = 0; i < paths.length; i++) {
//     const path = paths[i];
//     const svgMaterial = new THREE.MeshBasicMaterial({
//       color: 'green', // path.color
//       side: THREE.DoubleSide,
//       depthWrite: false,
//     });

//     const shapes = SVGLoader.createShapes(path);
//     for (let j = 0; j < shapes.length; j++) {
//       const shape = shapes[j];
//       const svgGeometry = new THREE.ShapeGeometry(shape);
//       const svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);

//       sunGroup.add(svgMesh);
//     }
//   }
//   scene.add(sunGroup);
//   sunGroup.rotateX(-Math.PI);
// },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total * 100) + '% sound_design loaded');
//   },
//   function (error) {
//     console.log(error);
//   }
// );

// sunGroup.scale.set(0.005, 0.005, 2)
// sunGroup.position.x = -10.00;
// sunGroup.position.y = 0.8;
// sunGroup.position.z = -10;


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);


// ANIMATION
let delta;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // run the imported animation (bass)
  delta = clock.getDelta();
  (mixer && worldState.bassState.active) && mixer.update(delta);

  // run the "built in" animations
  icosahedronAnimation()
  // chairAnimation();
  worldState.starsState.active && starsAnimation();


  stats && stats.update();
}

// f is the factor of displacement of the stars
// d changes the direction of the stars
let f;
let d = true;

function starsAnimation() {
  f = worldState.starsState.distance * 0.01;
  stars.forEach(function (s) {
    s.rotation.z += 0.07;
    s.position.x = s.originalPosition.x * f;
    s.position.y = Math.abs(s.originalPosition.y * f);
    s.position.z = s.originalPosition.z * f;
  })
  // depending on d, invert the direction
  d ? worldState.starsState.distance += 0.07 : worldState.starsState.distance -= 0.07
  // if you reach the limit (f = 1/100 distance), put distance back at the limit and change direction
  f < -1 && (d = !d, worldState.starsState.distance = -100);
  f > 1 && (d = !d, worldState.starsState.distance = 100);
  starsGroup.rotation.y -= 0.001;
}

function icosahedronAnimation() {
  icosahedron && (icosahedron.rotation.y += 0.01);
  icosahedron && (icosahedron.rotation.z += 0.007);
}

function chairAnimation() {
  chair && (
    chair.rotation.x += 0.01
    // chair.position.x > boxBounds.x && (chairSwitch.x = !chairSwitch.x, chair.position.x = boxBounds.x),
    // chair.position.y > boxBounds.y && (chairSwitch.y = !chairSwitch.y, chair.position.y = boxBounds.y),
    // chair.position.z > boxBounds.z && (chairSwitch.z = !chairSwitch.z, chair.position.z = boxBounds.z),
    // chairSwitch = true ? (chair.position.x += 0.1) : (chair.position.x -= 0.1),
    // chairSwitch = true ? (chair.position.y += 0.1) : (chair.position.y -= 0.1),
    // chairSwitch = true ? (chair.position.z += 0.1) : (chair.position.z -= 0.1)
  );
}

animate()