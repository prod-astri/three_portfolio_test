import './style.css'

import * as THREE from 'three';
// import { AmbientLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColorKeyframeTrack } from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true})
const material = new THREE.MeshStandardMaterial({ color: 0xFF6447 })
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)


//                  RIGHT / UP / TOWARDS ME
const PointLight = new THREE.PointLight(0xffffff)
PointLight.position.set(0, 0, 0)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(PointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(PointLight)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.OctahedronGeometry(0.25);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const star = new THREE.Mesh( geometry, material );
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

    star.position.set(x, y, z);
    scene.add(star)
}

Array(200).fill().forEach(addStar)

// could add callback fn to notify of loaded assets for ex.
const bgTexture = new THREE.TextureLoader().load('bg_texture.png')
scene.background = bgTexture;

const cubeTexture = new THREE.TextureLoader().load('second_texture.png')
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial( {map: cubeTexture})
)

const normalTexture = new THREE.TextureLoader().load('source_palette_rusty_crop.png')

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: normalTexture,
        normalMap: normalTexture
    })
);

scene.add(cube, moon)

moon.position.z = 30;
moon.position.setX(-10)

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.1;
    moon.rotation.z += 0.3;
    
    camera.position.x = t * -0.1
    camera.position.y = t * -0.1
    camera.position.z = t * -0.1
    camera.rotation.x = t* -0.6
}

document.body.onscroll = moveCamera

function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    controls.update();

    renderer.render(scene, camera);
}

animate()