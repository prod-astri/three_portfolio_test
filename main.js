// RIGHT /UP /TOWARDS ME ;)
// topStarsMaterial = whiteMaterial for now

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
import { loadAnimatedGltf } from './loadAnimatedGltf';
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
  max3dHeight: -30 
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

let headerHeight = document.getElementById('header').scrollHeight

let firstBlock = document.getElementById('firstBlock')
firstBlock.style.marginTop = `${(window.innerHeight / 2)}px`

let bodyScrolled = document.body.getBoundingClientRect().top
let totalHeight = document.getElementById('main').getBoundingClientRect().height
let textHeight = document.getElementById('textContainer').getBoundingClientRect().height

window.onresize = () => {
  // fit the view to the new window proportions
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // check the new ratios between elements to offset the text blocks
  totalHeight = document.getElementById('main').getBoundingClientRect().height;
  textHeight = document.getElementById('textContainer').getBoundingClientRect().height;

  trackScrolling();
};

document.body.onscroll = trackScrolling

function trackScrolling() {
  bodyScrolled = document.body.getBoundingClientRect().top
  // the value of getBoundingClientRect().top will always be negative
  // percentage of the page scrolled
  worldState.scrolledFromTop = bodyScrolled / (textHeight) * -100;
  console.log('wstate scrolled:' , worldState.scrolledFromTop)
  console.log('camera pos:' , camera.position)
  // the division factor is arbitrary for now
  camera.position.y = worldState.scrolledFromTop * worldState.max3dHeight / 100
}


// ------ ANIMATION SETUP ------
// let mixer = new THREE.AnimationMixer();
export let mixers = [];
let mixer = new THREE.AnimationMixer();
mixer.name = 'rootMixer'
mixers.push(mixer)
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
camera.position.set(0, 0, 5);
camera.rotation.x = 0;


// ------ GEOMETRIES ------
loadBackground();

const geometry = new THREE.IcosahedronGeometry(0.5)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
export const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron)


export let topStars = [];
export const starsGroup = new THREE.Group();
const starGeometry = new THREE.OctahedronGeometry(0.25);
const topStarsMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true })

function addStar() {
  const star = new THREE.Mesh(starGeometry, topStarsMaterial);
  const x = THREE.MathUtils.randFloatSpread(100)
  const y = Math.abs(THREE.MathUtils.randFloatSpread(100))
  const z = THREE.MathUtils.randFloatSpread(100);
  // y = Math.abs(y);
  star.name = `star`;
  star.position.set(x, y, z);
  star.rotation.x = [y]
  star.rotation.y = [x]
  star.originalPosition = { x, y, z }
  topStars.push(star)
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
loadAnimatedGltf('./3d_models/anibass.glb', bass, 'bass', [2, 0, 0], mixers)

const soundDesignGroup = new THREE.Group();
loadSvg('/pictures/sd.svg', soundDesignGroup, 'sound_design', [-3.6, 0.8, -10], 0.005, 'blue');

// loadImage(source, name, height, [x, y, z])
loadImage('/pictures/HAAA_003_still_purple.png', 'haaa003', 1, [4, -5, 2.5])
loadImage('/pictures/share.jpg', 'share', 1, [4, -3, 2.5])


// ------ CONTROLS ------
const controls = new OrbitControls(camera, renderer.domElement);


// ------ ANIMATE ------
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // run the imported animation (bass)
  delta = clock.getDelta();
  (mixers[1] && worldState.bassState.active) && mixers[1].update(delta);

  // run the "built in" animations
  icosahedronAnimation()
  chairAnimation();
  worldState.starsState.active && starsAnimation();

  stats && stats.update();
}


animate()