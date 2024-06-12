import {
  ContactShadows,
  Grid,
  OrbitControls,
  Sky,
  Stats,
} from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { ConvaiFPS } from './fps/convaiFPS';
import { Nikhil } from './models/Nikhil';
export const Experience = ({ client }) => {
  const [gravity, setGravity] = useState([0, 0, 0]);
  useEffect(() => {
    setGravity([0, -9.81, 0]);
  }, []);

  return (
    <>
      {/* lights */}
      <ambientLight intensity={0.2} />
      <hemisphereLight
        skyColor={'#fcf9d9'}
        groundColor={'#fcf9d9'}
        intensity={0.5}
        castShadow
      />
      <directionalLight
        position={[500, 100, 500]}
        color={'#fcf9d9'}
        intensity={2}
        castShadow
      />

      {/* models */}
      <Stats />
      <Suspense>
        <Physics gravity={gravity}>
          <ConvaiFPS />
          <Sky />
          {/* <Corey client={client} /> */}
          <Nikhil client={client} />
          <Grid followCamera infiniteGrid fadeDistance={50} />
          <RigidBody type="fixed">
            <CuboidCollider args={[5, 5, 0.1]} position={[0, 1.5, -3]} />
            <CuboidCollider
              args={[5, 5, 0.1]}
              position={[0, 1.5, 4]}
              rotation={[-Math.PI / 8, 0, 0]}
            />
            <CuboidCollider
              args={[5, 5, 0.1]}
              position={[0, -0.2, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <CuboidCollider
              args={[5, 5, 0.1]}
              position={[3, 1.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <CuboidCollider
              args={[5, 5, 0.1]}
              position={[-3, 1.5, 0]}
              rotation={[0, Math.PI / 2, 0]}
            />
          </RigidBody>
        </Physics>
      </Suspense>
      <ContactShadows opacity={0.7} />
    </>
  );
};
