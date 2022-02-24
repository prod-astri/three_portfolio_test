// RIGHT /UP /TOWARDS ME ;)
import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// CAMERA, SCENE SETUP
const scene = new THREE.Scene();
// ( field of view, aspect ratio, near , and far camera frustrum )
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER, WINDOW SIZE
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)

// LIGHTING AND POINTERS
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper();
scene.add(pointLight, ambientLight);
scene.add(lightHelper, gridHelper)

// INITIAL POSITIONING
pointLight.position.set(0, 4, 0)
camera.position.z = 5;
camera.position.y = 2;
camera.rotation.x = -0.4;

// GEOMETRIES
const geometry = new THREE.IcosahedronGeometry(0.6)
const material = new THREE.MeshBasicMaterial({ color: 0xfaafa00, wireframe: true});
const icosahedron = new THREE.Mesh(geometry, material);

scene.add(icosahedron)

// OBJECT LOADERS
var chair;
const loader = new GLTFLoader();
loader.load('./models/messed_up_chair.glb', function (gltf) {
  chair = gltf.scene;
  // console.log(chair)
  scene.add(chair);
  chair.position.set(-1, 0, 0);
  console.log('load chair')
}, function (xhr) {
  console.log(('chair ', xhr.loaded / xhr.total * 100), "% loaded")
}, function (error) {
  console.error(error);
});


// ANIMATION
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  icosahedronAnimation(icosahedron)
  chairAnimation(chair);
}

let goUp = true;
let goRight = true;
let goBack = true;

let scaleUp = true;

function icosahedronAnimation(icosahedron) {
  
  if (icosahedron.scale.x > 1) {
    icosahedron.scale.x = 1
    icosahedron.scale.y = 1
    icosahedron.scale.z = 1
    scaleUp = !scaleUp
  }
  if (icosahedron.scale.x < 0.8) {
    icosahedron.scale.x = 0.8
    icosahedron.scale.y = 0.8
    icosahedron.scale.z = 0.8
    scaleUp = !scaleUp
  }
  if (scaleUp){
    icosahedron.scale.x += 0.002
  icosahedron.scale.y += 0.002
  icosahedron.scale.z += 0.002
  } else {
    icosahedron.scale.x -= 0.002
    icosahedron.scale.y -= 0.002
    icosahedron.scale.z -= 0.002
  }
}

function chairAnimation(chair) {
  if (chair) {
    if (chair.position.y > 4) goUp = !goUp, chair.position.y = 4
    if (chair.position.y < -4) goUp = !goUp, chair.position.y = -4
    if (chair.position.x > 4) goRight = !goRight, chair.position.x = 4;
    if (chair.position.x < -4) goRight = !goRight, chair.position.x = -4;
    if (chair.position.z > 4) goBack = !goBack, chair.position.z = 4;
    if (chair.position.z < -4) goBack = !goBack, chair.position.z = -4;

    (chair.rotation.y += 0.02),
      (goUp ? chair.position.y += 0.002 : chair.position.y -= 0.018),
      (goRight ? chair.position.x += 0.01 : chair.position.x -= 0.013),
      (goBack ? chair.position.z += 0.08 : chair.position.z -= 0.018)
  };
}

animate()