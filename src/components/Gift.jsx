import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../store/useStore';

export default function Gift({ id, position, room }) {
    const meshRef = useRef();
    const isCollected = useStore(state => state.collectedGifts.includes(id));

    useFrame((state) => {
        if (meshRef.current && !isCollected) {
            // Rotate the entire gift group
            meshRef.current.rotation.y += 0.01;
            // Bob up and down (relative to base position)
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    if (isCollected) return null;

    return (
        <group ref={meshRef} position={position}>
            {/* Gift Box - Main Body */}
            <mesh position={[0, -0.1, 0]} castShadow>
                <boxGeometry args={[1, 0.8, 1]} />
                <meshStandardMaterial
                    color="#e63946"
                    metalness={0.2}
                    roughness={0.3}
                />
            </mesh>

            {/* Gift Box - Lid */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[1.05, 0.2, 1.05]} />
                <meshStandardMaterial
                    color="#d62828"
                    metalness={0.2}
                    roughness={0.3}
                />
            </mesh>

            {/* Wrapping Paper Pattern - Dots (on body) */}
            <mesh position={[0.51, -0.1, 0]} castShadow>
                <planeGeometry args={[1, 0.8]} />
                <meshStandardMaterial color="#ffd700" transparent opacity={0.3} />
            </mesh>

            {/* Ribbon - Horizontal (around body) */}
            <group>
                <mesh position={[0, -0.1, 0]} castShadow>
                    <boxGeometry args={[1.02, 0.8, 0.2]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.6}
                        roughness={0.2}
                    />
                </mesh>
            </group>

            {/* Ribbon - Vertical (around body) */}
            <group>
                <mesh position={[0, -0.1, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.8, 1.02]} />
                    <meshStandardMaterial
                        color="#ffd700"
                        metalness={0.6}
                        roughness={0.2}
                    />
                </mesh>
            </group>

            {/* Ribbon - On Lid (Horizontal) */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[1.07, 0.21, 0.2]} />
                <meshStandardMaterial
                    color="#ffd700"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>

            {/* Ribbon - On Lid (Vertical) */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[0.2, 0.21, 1.07]} />
                <meshStandardMaterial
                    color="#ffd700"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>

            {/* Bow on top - Center knot */}
            <mesh position={[0, 0.55, 0]} castShadow>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color="#ffd700"
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Bow loops - Left */}
            <mesh position={[-0.25, 0.6, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
                <torusGeometry args={[0.15, 0.08, 8, 12]} />
                <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Bow loops - Right */}
            <mesh position={[0.25, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
                <torusGeometry args={[0.15, 0.08, 8, 12]} />
                <meshStandardMaterial color="#ffd700" metalness={0.5} roughness={0.3} />
            </mesh>

            {/* Bow ribbons hanging down - Left */}
            <mesh position={[-0.15, 0.25, 0]} rotation={[0, 0, 0.3]} castShadow>
                <boxGeometry args={[0.12, 0.4, 0.05]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Bow ribbons hanging down - Right */}
            <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, -0.3]} castShadow>
                <boxGeometry args={[0.12, 0.4, 0.05]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Sparkle effects - Multiple lights */}
            <pointLight color="#ffd700" intensity={3} distance={4} />
            <pointLight position={[0, 0.8, 0]} color="#ffffff" intensity={1.5} distance={2} />
            <pointLight position={[0.3, 0.5, 0.3]} color="#ffed4e" intensity={1} distance={2} />
        </group>
    );
}
