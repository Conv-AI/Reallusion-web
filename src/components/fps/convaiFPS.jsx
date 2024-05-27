import { PointerLockControls } from '@react-three/drei';
import { Player } from './player';

export const ConvaiFPS = () => {
  return (
    <>
      <PointerLockControls />
      <Player />
    </>
  );
};
