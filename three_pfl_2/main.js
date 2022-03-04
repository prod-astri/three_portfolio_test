// RIGHT /UP /TOWARDS ME ;)
// starMaterial = whiteMaterial for now

import '/style.css'
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { loadBackground } from './loaders/loadBackground';
import { loadImage } from './loaders/loadImage';
import { loadGltf } from './loaders/loadGltf';
import { loadSvg } from './loaders/loadSvg';

import { icosahedronAnimation } from './animations/icosahedronAnimation';
import { starsAnimation } from './animations/starsAnimation';
import { chairAnimation } from './animations/chairAnimation';
// import { loadAnimatedGltf } from './loadAnimatedGltf';


// ------ PAGE STATE ------
export const worldState = {
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


// ------ CAMERA, SCENE SETUP ------
// ( field of view, aspect ratio, near , and far camera frustrum )
export const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('container')
const stats = new Stats();


// ------ RENDERER, WINDOW SIZE, SCROLLING ------
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.onresize = function () {
  // fit the view to the new window proportions
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // take it into account
  trackScrolling();
};

document.body.onscroll = trackScrolling

function trackScrolling() {
  // the value of getBoundingClientRect().top will always be negative
  // the division factor is arbitrary for now
  worldState.scrolledFromTop = -1 * document.body.getBoundingClientRect().top;
  camera.position.y = 0 - worldState.scrolledFromTop / 230
}


// ------ ANIMATION SETUP ------
let mixer = new THREE.AnimationMixer();
let clock = new THREE.Clock();
let delta;


// ------ BUTTONS ------
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


// ------ LIGHTING AND POINTERS ------
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0x000000)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(10, 10, 0xffaaaa, 0x888888);
scene.add(pointLight, ambientLight);
scene.add(lightHelper, gridHelper)
pointLight.position.set(0, 4, 0)


// ------ CAMERA INITIAL POSITIONING ------
camera.position.set(0, 0, 10);
camera.rotation.x = 0;


// ------ GEOMETRIES ------
loadBackground();

const geometry = new THREE.IcosahedronGeometry(0.5)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
export const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron)


export let stars = [];
export const starsGroup = new THREE.Group();
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
const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: false })

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


// ------ OBJECT LOADERS ------

export const loader = new GLTFLoader();
export const svgLoader = new SVGLoader();
export const textureLoader = new THREE.TextureLoader();

// loadImage(source, name, h, [x, y, z])
// loadSvg(source, group, [x, y, z], name, scale, color)
// loadGltf(source, container, name, [x, y, z]) 
// loadAnimatedGltf (source, container,  name, [x, y, z])

export let chair = [];
loadGltf('./3d_models/messed_up_chair.glb', chair, 'chair', [-2, 0, 0])

let bass = [];
loadAnimatedGltf('./3d_models/anibass.glb', bass, 'bass', [2, 0, 0], mixer)

const soundDesignGroup = new THREE.Group();
loadSvg('/pictures/sd.svg', soundDesignGroup, 'sound_design', [-3.6, 0.8, -10], 0.005, 'blue');

// loadImage(source, name, height, [x, y, z])
loadImage('/pictures/HAAA_003_still_purple.png', 'haaa003', 1, [4, -5, 4])
loadImage('/pictures/share.jpg', 'share', 1, [4, -3, 4])


// ------ CONTROLS ------
const controls = new OrbitControls(camera, renderer.domElement);


// ------ ANIMATE ------
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // run the imported animation (bass)
  delta = clock.getDelta();
  (mixer && worldState.bassState.active) && mixer.update(delta);

  // run the "built in" animations
  icosahedronAnimation()
  chairAnimation();
  worldState.starsState.active && starsAnimation();

  stats && stats.update();
}


function loadAnimatedGltf(source, array, name, [x, y, z]) {

  loader.load(source, function (gltf) {
    let container = gltf.scene;
    container.name = name
    array.push(container)
    scene.add(container);

    // necessary for the imported animations
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    container.position.set(x, y, z);
    console.log(name, ' loaded')
  }, function (xhr) {
    // console.log((xhr.loaded / xhr.total * 100), "% bass loaded")
  }, function (error) {
    console.error(error);
  });
}

animate()