import * as THREE from 'three';
import { loader, scene } from './main';

export function loadAnimatedGltf(source, container, name, [x, y, z], mixer) {

  loader.load(source, function (gltf) {
    container = gltf.scene;
    container.name = name;
    scene.add(container);

    // necessary for the imported animations
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    container.position.set(x, y, z);
    console.log(name, ' loaded');
  }, function (xhr) {
    // console.log((xhr.loaded / xhr.total * 100), "% bass loaded")
  }, function (error) {
    console.error(error);
  });
}
