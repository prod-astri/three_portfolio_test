import { chair } from '../main';

export function chairAnimation() {
  if (chair[0]) {
    // console.log(chair) 
    chair[0].rotation.x += 0.05;
  }
}
