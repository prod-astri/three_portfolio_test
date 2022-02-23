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
pointLight.position.set(0, 40, 0)
camera.position.z = 3;

//  OBJECT LOADERS
var chair;
const loader = new GLTFLoader();
loader.load('./models/messed_up_chair.glb', function (gltf) {
  chair = gltf.scene;
  
  scene.add(chair);
  console.log('load chair')
}, function(xhr){
  console.log(('chair ', xhr.loaded / xhr.total * 100), "% loaded")
}, function (error) {
  console.error(error);
});


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  chair && (chair.rotation.y += 0.05);
}

animate()