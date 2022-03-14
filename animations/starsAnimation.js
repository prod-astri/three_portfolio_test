import { worldState, topStars, starsGroup } from '../main';

// f is the factor of displacement of the stars

// worldState.starsState.d changes the direction of the stars


export function starsAnimation() {
  let f = worldState.starsState.distance * 0.01;
  topStars.forEach(function (s) {
    s.rotation.z += 0.07;
    s.position.x = s.originalPosition.x * f;
    s.position.y = Math.abs(s.originalPosition.y * f);
    s.position.z = s.originalPosition.z * f;

    s.scale.x = Math.abs(1 * f);
    s.scale.y = Math.abs(1 * f);
    s.scale.z = Math.abs(1 * f);
  });
  // depending on d, invert the direction
  worldState.starsState.d ? worldState.starsState.distance += 0.08 : worldState.starsState.distance -= 0.08;
  // if you reach the limit (f = 1/100 distance), put distance back at the limit anworldState.starsState.d change direction
  f < -1 && (worldState.starsState.d = !worldState.starsState.d, worldState.starsState.distance = -100);
  f > 1 && (worldState.starsState.d = !worldState.starsState.d, worldState.starsState.distance = 100);
  starsGroup.rotation.y -= 0.001;
}
