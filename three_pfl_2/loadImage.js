import * as THREE from 'three';
import { textureLoader, scene } from './main';

export function loadImage(source, name, h, [x, y, z]) {
  // this is to get the ratio for the plane size;
  let img = new Image();

  img.onload = function () {

    let ratio = (this.height / this.width);

    // this actually builds the mesh for THREE
    let imgGeometry = new THREE.PlaneGeometry(h, h * ratio);
    let imgMaterial = new THREE.MeshLambertMaterial({
      map: textureLoader.load(source)
    });

    let imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
    imgMesh.name = name;

    imgMesh.position.set(x, y, z);
    scene.add(imgMesh);
  };

  img.src = source;
}
