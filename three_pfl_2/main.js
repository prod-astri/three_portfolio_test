// RIGHT /UP /TOWARDS ME ;)
import '/style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';

// CAMERA, SCENE SETUP
// ( field of view, aspect ratio, near , and far camera frustrum )
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById('container')

// THREE STATS
const stats = new Stats();
container.appendChild(stats.dom);

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

function addStar() {
  const geometry = new THREE.OctahedronGeometry(0.25);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true })
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.userData.name = "foo";
  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)
console.log(scene)

// OBJECT LOADERS

let chair;
const loader = new GLTFLoader();
loader.load('./3d_models/messed_up_chair.glb', function (gltf) {
  chair = gltf.scene;
  chair.traverse((node) => {
    if (!node.isMesh) return;
    node.material.wireframe = true;
  });
  scene.add(chair);
  chair.position.set(-2, 0, 0);
  // const chairControls = new OrbitControls(chair, renderer.domElement);
  console.log('load chair')
}, function (xhr) {
  console.log(('chair ', xhr.loaded / xhr.total * 100), "% loaded")
}, function (error) {
  console.error(error);
});


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// ANIMATION
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  icosahedronAnimation(icosahedron)
  chairAnimation(chair);

  stats.update();
}

function icosahedronAnimation(icosahedron) {
  icosahedron && (icosahedron.rotation.y += 0.01);
}

function chairAnimation(chair) {
  chair && (chair.rotation.x += 0.01);
}

animate()