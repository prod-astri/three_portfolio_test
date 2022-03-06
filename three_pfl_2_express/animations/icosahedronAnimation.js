import { icosahedron } from '../main';

export function icosahedronAnimation() {
  icosahedron && (icosahedron.rotation.y += 0.01);
  icosahedron && (icosahedron.rotation.z += 0.007);
}
