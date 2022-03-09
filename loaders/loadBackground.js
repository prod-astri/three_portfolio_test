import * as THREE from "three"
import { scene } from '../main';

export function loadBackground() {
  const bgLoader = new THREE.CubeTextureLoader();
  const bgTexture = bgLoader.load([
    '/pictures/sky_sides.jpg',
    '/pictures/sky_sides.jpg',
    '/pictures/sky_top.jpg',
    '/pictures/sky_bottom.jpg',
    '/pictures/sky_sides.jpg',
    '/pictures/sky_sides.jpg',
  ]);
  scene.background = bgTexture;
  console.log('background loaded')
}
