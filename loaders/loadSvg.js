import * as THREE from "/node_modules/three/build/three.module.js"
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { svgLoader, scene } from '../main';


export function loadSvg(src, group, name, [x, y, z], size, color) {
  svgLoader.load(src, function (data) {
    const paths = data.paths;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const svgMaterial = new THREE.MeshBasicMaterial({
        color: color ? color : 'red',
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const shapes = SVGLoader.createShapes(path);
      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const svgGeometry = new THREE.ShapeGeometry(shape);
        const svgMesh = new THREE.Mesh(svgGeometry, svgMaterial);

        group.add(svgMesh);
      }
    }
    group.name = name;
    scene.add(group);
    console.log(name, 'loaded')
    group.rotateX(-Math.PI);
    // size /1
    group.scale.set(size, size, 0);
    group.position.x = x;
    group.position.y = y;
    group.position.z = z;
  },
    function (xhr) {
      // console.log((xhr.loaded / xhr.total * 100) + '% ', name, ' loaded');
    },
    function (error) {
      console.log(error);
    }
  );
}
