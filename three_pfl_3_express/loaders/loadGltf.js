import { loader, scene } from '../main';

export function loadGltf(source, array, name, [x, y, z]) {

  loader.load(source, function (gltf) {
    let container = gltf.scene;
    container.name = name;
    array.push(container)
    scene.add(container);

    container.position.set(x, y, z);
    console.log(name, ' loaded');
  }, function (xhr) {
    // console.log((xhr.loaded / xhr.total * 100), "%  chair loaded")
  }, function (error) {
    console.error(error);
  });
}
