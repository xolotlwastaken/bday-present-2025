import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Suspense } from 'react';
import World from './World';
import Character from './Character';

const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
];

export default function Experience() {
    return (
        <KeyboardControls map={keyboardMap}>
            <Canvas shadows camera={{ position: [0, 10, 15], fov: 50 }}>
                <Sky sunPosition={[100, 20, 100]} />
                <fog attach="fog" args={['#f0e6d2', 10, 50]} />

                <Suspense fallback={null}>
                    <Physics gravity={[0, -20, 0]}>
                        <World />
                        <Character />
                    </Physics>
                </Suspense>
            </Canvas>
        </KeyboardControls>
    );
}
