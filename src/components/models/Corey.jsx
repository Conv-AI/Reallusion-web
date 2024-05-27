import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useLipsync } from '../../hooks/useLipsync';
import { useHeadTracking } from '../../hooks/useHeadTracking';

export function Corey(props) {
  const { nodes, materials, scene } = useGLTF('/Corey.glb')

  const { animations } = useGLTF('/animations/animation.glb');
  const coreyRef = useRef()
  const { actions, mixer } = useAnimations(animations, coreyRef);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === 'Idle') ? 'Idle' : animations[0].name // Check if Idle animation exists otherwise use first animation
  );
  const { client } = props;

  useEffect(() => {
    client?.convaiClient.current.sendTextChunk("");
  }, [])

  useEffect(() => {
    if (client?.isTalking) {
      setAnimation('Talking');
    } else {
      setAnimation('Idle');
    }
  }, [client?.isTalking]);
  useEffect(() => {
    actions[animation]
      .reset()
      .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5)
      .play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);


  useLipsync({ client, characterRef: coreyRef, nodes, scene });
  useHeadTracking({ client, nodes });

  return (
    <group ref={coreyRef} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" scale={0.01}>
          <skinnedMesh
            name="CC_Base_Eye"
            geometry={nodes.CC_Base_Eye.geometry}
            material={materials.Character}
            skeleton={nodes.CC_Base_Eye.skeleton}
            morphTargetDictionary={nodes.CC_Base_Eye.morphTargetDictionary}
            morphTargetInfluences={nodes.CC_Base_Eye.morphTargetInfluences}
          />
          <skinnedMesh
            name="CC_Base_Teeth"
            geometry={nodes.CC_Base_Teeth.geometry}
            material={materials.Character}
            skeleton={nodes.CC_Base_Teeth.skeleton}
            morphTargetDictionary={nodes.CC_Base_Teeth.morphTargetDictionary}
            morphTargetInfluences={nodes.CC_Base_Teeth.morphTargetInfluences}
          />
          <skinnedMesh
            name="CC_Game_Body"
            geometry={nodes.CC_Game_Body.geometry}
            material={materials.Character}
            skeleton={nodes.CC_Game_Body.skeleton}
            morphTargetDictionary={nodes.CC_Game_Body.morphTargetDictionary}
            morphTargetInfluences={nodes.CC_Game_Body.morphTargetInfluences}
          />
          <skinnedMesh
            name="CC_Game_Tongue"
            geometry={nodes.CC_Game_Tongue.geometry}
            material={materials.Character}
            skeleton={nodes.CC_Game_Tongue.skeleton}
            morphTargetDictionary={nodes.CC_Game_Tongue.morphTargetDictionary}
            morphTargetInfluences={nodes.CC_Game_Tongue.morphTargetInfluences}
          />
          <skinnedMesh
            name="Classic_Shorts"
            geometry={nodes.Classic_Shorts.geometry}
            material={materials.Character}
            skeleton={nodes.Classic_Shorts.skeleton}
            morphTargetDictionary={nodes.Classic_Shorts.morphTargetDictionary}
            morphTargetInfluences={nodes.Classic_Shorts.morphTargetInfluences}
          />
          <skinnedMesh
            name="Cylinder001"
            geometry={nodes.Cylinder001.geometry}
            material={materials.Character}
            skeleton={nodes.Cylinder001.skeleton}
            morphTargetDictionary={nodes.Cylinder001.morphTargetDictionary}
            morphTargetInfluences={nodes.Cylinder001.morphTargetInfluences}
          />
          <skinnedMesh
            name="Cylinder002"
            geometry={nodes.Cylinder002.geometry}
            material={materials.Character}
            skeleton={nodes.Cylinder002.skeleton}
            morphTargetDictionary={nodes.Cylinder002.morphTargetDictionary}
            morphTargetInfluences={nodes.Cylinder002.morphTargetInfluences}
          />
          <skinnedMesh
            name="FR_F_Necklace_L"
            geometry={nodes.FR_F_Necklace_L.geometry}
            material={materials.Character}
            skeleton={nodes.FR_F_Necklace_L.skeleton}
            morphTargetDictionary={nodes.FR_F_Necklace_L.morphTargetDictionary}
            morphTargetInfluences={nodes.FR_F_Necklace_L.morphTargetInfluences}
          />
          <skinnedMesh
            name="Model14_0_"
            geometry={nodes.Model14_0_.geometry}
            material={materials.Character}
            skeleton={nodes.Model14_0_.skeleton}
            morphTargetDictionary={nodes.Model14_0_.morphTargetDictionary}
            morphTargetInfluences={nodes.Model14_0_.morphTargetInfluences}
          />
          <skinnedMesh
            name="Plaid_Punk_Shirt"
            geometry={nodes.Plaid_Punk_Shirt.geometry}
            material={materials.Character}
            skeleton={nodes.Plaid_Punk_Shirt.skeleton}
            morphTargetDictionary={nodes.Plaid_Punk_Shirt.morphTargetDictionary}
            morphTargetInfluences={nodes.Plaid_Punk_Shirt.morphTargetInfluences}
          />
          <skinnedMesh
            name="Police_Watch"
            geometry={nodes.Police_Watch.geometry}
            material={materials.Character}
            skeleton={nodes.Police_Watch.skeleton}
            morphTargetDictionary={nodes.Police_Watch.morphTargetDictionary}
            morphTargetInfluences={nodes.Police_Watch.morphTargetInfluences}
          />
          <skinnedMesh
            name="Sneakers"
            geometry={nodes.Sneakers.geometry}
            material={materials.Character}
            skeleton={nodes.Sneakers.skeleton}
            morphTargetDictionary={nodes.Sneakers.morphTargetDictionary}
            morphTargetInfluences={nodes.Sneakers.morphTargetInfluences}
          />
          <primitive object={nodes.RL_BoneRoot} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/Corey.glb')
