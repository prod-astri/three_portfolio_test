import * as THREE from "/node_modules/three/build/three.module.js"
import { loader, scene, mixers } from '../main';

export function loadAnimatedGltf(source, array, name, [x, y, z]) {

    loader.load(source, function (gltf) {
        let container = gltf.scene;
        container.name = name;
        array.push(container);
        scene.add(container);

        // necessary for the imported animations
        let mixer = new THREE.AnimationMixer(gltf.scene);
        mixer.name = `${name}Mixer`
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        mixers.push(mixer)
        container.position.set(x, y, z);
        console.log(name, ' loaded');
    }, function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100), "% bass loaded")
    }, function (error) {
        console.error(error);
    });
}
