// RIGHT /UP /TOWARDS ME ;)
import '/style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';


let boxBounds = {
  x: 5,
  y: 5,
  z: 1
}

let chairSwitch = {
  x: true,
  y: true,
  z: true
}

// PAGE STATE
const worldState = {
  statsOn: false,
  starsState: {
    active: true,
    distance: 100
  },
  bassState: {
    active:true
  }
}

// CAMERA, SCENE SETUP
// ( field of view, aspect ratio, near , and far camera frustrum )
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('container')
let mixer;
let clock = new THREE.Clock();
// THREE STATS
const stats = new Stats();

document.getElementById("statsButton").onclick = function () { toggleStats() };
function toggleStats() {
  if (worldState.statsOn) {
    container.removeChild(stats.dom);
    worldState.statsOn = false;
  } else {
    container.appendChild(stats.dom)
    worldState.statsOn = true;
  }
  // console.log("// statsOn: " + worldState.statsOn)
}

// RENDERER, WINDOW SIZE
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// LIGHTING AND POINTERS
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper();
scene.add(pointLight, ambientLight);
scene.add(lightHelper, gridHelper)
pointLight.position.set(0, 4, 0)


// INITIAL POSITIONING
camera.position.z = 5;
camera.position.y = 2;
camera.rotation.x = -0.4;


// GEOMETRIES
const geometry = new THREE.IcosahedronGeometry(0.6)
const material = new THREE.MeshBasicMaterial({ color: 0xfaafa00, wireframe: true });
const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron)


let stars = [];
function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true })
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.name = `star`;
  star.position.set(x, y, z);
  star.rotation.x = [y]
  star.rotation.y = [x]
  star.originalPosition = { x, y, z }
  stars.push(star)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

document.getElementById("starsButton").onclick = function () {
  worldState.starsState.active = !worldState.starsState.active
};

// OBJECT LOADERS
let chair;
const loader = new GLTFLoader();
loader.load('./3d_models/messed_up_chair.glb', function (gltf) {
  chair = gltf.scene;
  // NOT WORKING - to show gltf as wireframe?
  // chair.traverse((node) => {
    //   if (!node.isMesh) return;
    //   node.material.wireframe = true;
    // });
    scene.add(chair);

  // const chairControls = new OrbitControls(chair, renderer.domElement);
  chair.position.set(-2, 0, 0);
  console.log('chair loaded')
}, function (xhr) {
  console.log((xhr.loaded / xhr.total * 100), "%  chair loaded")
}, function (error) {
  console.error(error);
});

document.getElementById("bassButton").onclick = function () {
  worldState.bassState.active = !worldState.bassState.active
};

let bass;
const bassLoader = new GLTFLoader();
bassLoader.load('./3d_models/anibass.glb', function (gltf) {
  bass = gltf.scene;
  scene.add(bass);
  mixer = new THREE.AnimationMixer(gltf.scene);

  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });

  bass.position.set(2, 0, 0);
  console.log('bass loaded')
}, function (xhr) {
  console.log(('bass ', xhr.loaded / xhr.total * 100), "% bass loaded")
}, function (error) {
  console.error(error);
});


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);


// ANIMATION
let delta;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  delta = clock.getDelta();
  (mixer && worldState.bassState.active) && mixer.update(delta);
  
  icosahedronAnimation(icosahedron)
  chairAnimation(chair);
  worldState.starsState.active && starsAnimation(stars);

  stats && stats.update();
}

// f is the factor of displacement of the stars
// d changes the direction of the stars
let f;
let d = true;
function starsAnimation() {
  f = worldState.starsState.distance * 0.01;
  stars.forEach(function (s) {
    // s.rotation.x += 0.1;
    s.rotation.z += 0.07;
    s.position.x = s.originalPosition.x * f;
    s.position.y = s.originalPosition.y * f;
    s.position.z = s.originalPosition.z * f;
  })
  d ? worldState.starsState.distance += 0.1 : worldState.starsState.distance -= 0.1
  f < -1 && (d = !d, worldState.starsState.distance = -100);
  f > 1 && (d = !d, worldState.starsState.distance = 100);
}

function icosahedronAnimation(icosahedron) {
  icosahedron && (icosahedron.rotation.y += 0.01);
  icosahedron && (icosahedron.rotation.z += 0.007);
}

function chairAnimation(chair) {
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