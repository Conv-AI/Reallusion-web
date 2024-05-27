import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useHeadTracking = ({ client, nodes }) => {
  useFrame((state, _delta) => {
    // Head Lock
    if (
      client?.action?.currentAction &&
      client?.action?.currentAction !== 'None'
    ) {
      return;
    }
    const cameraWorldPosition = state.camera.getWorldPosition(
      new THREE.Vector3()
    );
    nodes.CC_Base_L_Eye.rotation.x = 1.5;
    nodes.CC_Base_L_Eye.rotation.y = 1.6;
    nodes.CC_Base_L_Eye.rotation.z = 1.6;
    nodes.CC_Base_R_Eye.rotation.x = 1.5;
    nodes.CC_Base_R_Eye.rotation.y = 1.6;
    nodes.CC_Base_R_Eye.rotation.z = 1.6;
    nodes.CC_Base_Head.lookAt(cameraWorldPosition);
  });
};
