import * as THREE from 'three';

export const lerpMorphTarget = (target, value, speed, scene) => {
  if (scene) {
    if (typeof target === 'string' && !target.includes('Eye')) {
      // console.log(value,target)
    }

    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }

        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  }
};
