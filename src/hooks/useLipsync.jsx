import { useFrame, useThree } from '@react-three/fiber';
import _, { bind } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { lerpMorphTarget } from '../helpers/lerpMorphTarget';
import { Reallusion, VisemeToReallusion } from '../helpers/mappingMorphs';
import * as THREE from 'three';

const jawRotation = new THREE.Euler(0, 0, 1.57);
const tongueRotation = new THREE.Euler(0, 0, 0);
let tongueTranslationX = 0;
let lerpNum = 1;
let tongueTranslationY = 0;

/**
 * useLipsync : Runs morphs at 100fps and manages frame skips with blinking.
 * @characterRef : Reference to the character group where lipsync is to be performed.
 */
export const useLipsync = ({ client, characterRef, nodes, scene }) => {
  const [tick, setTick] = useState(true);
  const blendShapeRef = useRef([]);
  const currentBlendFrame = useRef(0);

  // resetting blendShapeRef and currentFrameIndex facial data
  useEffect(() => {
    if (client?.facialData.length === 0) {
      blendShapeRef.current = [];
      currentBlendFrame.current = 0;
    }
  }, [client?.facialData]);

  useEffect(() => {
    tongueTranslationY =
      characterRef.current.getObjectByName('CC_Base_Tongue02').position.y;
    tongueTranslationX =
      characterRef.current.getObjectByName('CC_Base_Tongue02').position.x;
  }, []);
  const [blink, setBlink] = useState(false);
  // Create a throttled function that updates the animation
  const throttledUpdate = _.throttle(updateAnimation, 10); // 16ms is roughly 60 frames per second
  function updateAnimation() {
    setTick((tick) => {
      if (tick) {
        return tick;
      }
      return true;
    });
    requestAnimationFrame(throttledUpdate);
  }

  useEffect(() => {
    // Start the animation loop when the component mounts
    requestAnimationFrame(throttledUpdate);
    // Clean up the animation loop when the component unmounts
    return () => {
      cancelAnimationFrame(throttledUpdate);
    };
  }, []);
  //  animation loop
  const [startClock, setStartClock] = useState(false);

  useFrame((state, _delta) => {
    characterRef.current
      .getObjectByName('CC_Base_JawRoot')
      .setRotationFromEuler(jawRotation);
    characterRef.current
      .getObjectByName('CC_Base_Tongue01')
      .setRotationFromEuler(tongueRotation);
    characterRef.current.getObjectByName('CC_Base_Tongue02').position.y =
      tongueTranslationY;
    characterRef.current.getObjectByName('CC_Base_Tongue02').position.x =
      tongueTranslationX;
    if (tick) {
      /**
       * Sync code ends
       */
      if (!startClock || !client?.isTalking) {
        state.clock.elapsedTime = 0;
        if (startClock) setStartClock(false);
      }

      if (client?.isTalking) {
        setStartClock(true);
      }
      if (startClock) {
        const frameSkipNumber = 10;
        if (
          Math.floor(state.clock.elapsedTime * 100) -
          currentBlendFrame.current >
          frameSkipNumber
        ) {
          for (let i = 0; i < frameSkipNumber; i++) {
            blendShapeRef.current.push(0);
          }
          currentBlendFrame.current += frameSkipNumber;
        } else if (
          Math.floor(state.clock.elapsedTime * 100) -
          currentBlendFrame.current <
          -frameSkipNumber
        ) {
          blendShapeRef.current.splice(-frameSkipNumber);
          currentBlendFrame.current -= frameSkipNumber + 1;
        }
      }

      // setting jaw and tongue
      Object.keys(nodes).forEach((nodeKey) => {
        if (nodeKey.includes('Eye')) {
          if (nodes[nodeKey].morphTargetDictionary) {
            Object.keys(nodes[nodeKey].morphTargetDictionary).forEach((key) => {
              if (key === 'Eye_Blink_L' || key === 'Eye_Blink_R') {
                return;
              }
            });
          }
        }
      });
      lerpMorphTarget('Eye_Blink_L', blink ? 1 : 0, 0.5, scene);
      lerpMorphTarget('Eye_Blink_R', blink ? 1 : 0, 0.5, scene);

      // Initiate blendshapes
      if (client?.facialData.length > 0) {
        // OvrToMorph(client?.facialData[currentBlendFrame.current],blendShapeRef);
        VisemeToReallusion(
          client?.facialData[currentBlendFrame.current],
          blendShapeRef
        );
      }
      // run all blends here
      if (currentBlendFrame.current <= blendShapeRef?.current?.length) {
        for (const blend in blendShapeRef.current[
          currentBlendFrame.current - 1
        ]) {
          if (blend === 'Open_Jaw') {
            if (
              blendShapeRef.current[currentBlendFrame.current - 1][blend] < 0.07
            ) {
              jawRotation.z = THREE.MathUtils.lerp(
                jawRotation.z,
                1.54,
                lerpNum
              );
            } else {
              jawRotation.z = THREE.MathUtils.lerp(
                jawRotation.z,
                1.55 +
                blendShapeRef.current[currentBlendFrame.current - 1][blend],
                lerpNum
              );
            }
          }
          lerpMorphTarget(
            blend,
            blendShapeRef.current[currentBlendFrame.current - 1][blend],
            1,
            scene
          );
          if (blend === 'TongueRotation') {
            tongueRotation.z = THREE.MathUtils.lerp(
              tongueRotation.z,
              0.3 + blendShapeRef.current[currentBlendFrame.current - 1][blend],
              lerpNum
            );
          }
          if (blend === 'TongueUp') {
            tongueTranslationY = THREE.MathUtils.lerp(
              tongueTranslationY,
              blendShapeRef.current[currentBlendFrame.current - 1][blend],
              lerpNum
            );
          }
          if (blend === 'V_Tongue_Out') {
            tongueTranslationX = THREE.MathUtils.lerp(
              tongueTranslationX,
              blendShapeRef.current[currentBlendFrame.current - 1][blend],
              lerpNum
            );
          }
        }
        currentBlendFrame.current += 1;
      }

      setTick(false);
    }
  });

  // Resetting the blendshapes when the character stops talking
  useEffect(() => {
    if (!client?.isTalking) {
      jawRotation.z = THREE.MathUtils.lerp(jawRotation.z, 1.57, 0.8);
      // reset all blendshapes
      scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          for (const target in child.morphTargetDictionary) {
            const index = child.morphTargetDictionary[target];
            if (
              index === undefined ||
              child.morphTargetInfluences[index] === undefined
            ) {
              return;
            }

            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              0,
              1
            );
          }
        }
      });
    }
  }, [client?.isTalking, scene]);

  // blink
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, [200]);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);
};
