import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import Gift from './Gift';
import Door from './Door';
import useStore from '../store/useStore';

// Component for a wall that fades out when camera is close
const FadingWall = ({ position, args, color }) => {
    const materialRef = useRef();

    useFrame(({ camera }) => {
        if (materialRef.current) {
            // Calculate distance from camera to wall center
            const wallPos = new THREE.Vector3(...position);
            const dist = camera.position.distanceTo(wallPos);

            // Fade out when closer than 10 units
            // Fully transparent at 2 units, fully opaque at 8 units
            let opacity = 1;
            if (dist < 12) {
                opacity = Math.max(0.15, (dist - 4) / 8);
            }

            materialRef.current.opacity = opacity;
            materialRef.current.transparent = opacity < 1;
            // Disable depth write when transparent to avoid sorting issues with objects behind it
            materialRef.current.depthWrite = opacity === 1;
        }
    });

    return (
        <mesh position={position} castShadow receiveShadow>
            <boxGeometry args={args} />
            <meshStandardMaterial
                ref={materialRef}
                color={color}
            />
        </mesh>
    );
};

export default function World() {
    const gifts = useStore(state => state.gifts);

    // House dimensions
    const wallHeight = 3;
    const wallThickness = 0.2;
    const houseSize = 20;

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#fff5e1" />

            {/* Floor */}
            <RigidBody type="fixed" colliders="cuboid">
                <mesh receiveShadow position={[0, -0.1, 0]}>
                    <boxGeometry args={[houseSize, 0.2, houseSize]} />
                    <meshStandardMaterial color="#8b7355" />
                </mesh>
            </RigidBody>

            {/* Outer Walls */}
            {/* North Wall */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[0, wallHeight / 2, -houseSize / 2]}
                    args={[houseSize, wallHeight, wallThickness]}
                    color="#d4a574"
                />
            </RigidBody>

            {/* South Wall */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[0, wallHeight / 2, houseSize / 2]}
                    args={[houseSize, wallHeight, wallThickness]}
                    color="#d4a574"
                />
            </RigidBody>

            {/* East Wall */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[houseSize / 2, wallHeight / 2, 0]}
                    args={[wallThickness, wallHeight, houseSize]}
                    color="#d4a574"
                />
            </RigidBody>

            {/* West Wall */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[-houseSize / 2, wallHeight / 2, 0]}
                    args={[wallThickness, wallHeight, houseSize]}
                    color="#d4a574"
                />
            </RigidBody>

            {/* Interior Walls - Creating 5 rooms */}
            {/* Main horizontal divider (splits top 3 rooms from bottom 2 rooms) */}
            {/* Left segment */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[-7, wallHeight / 2, 0]}
                    args={[6, wallHeight, wallThickness]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Center-left segment (doorway gap between -4 and -2) */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[-0.5, wallHeight / 2, 0]}
                    args={[3, wallHeight, wallThickness]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Center segment (between -2 and 6) - Extended to meet new gap */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[2, wallHeight / 2, 0]}
                    args={[8, wallHeight, wallThickness]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Wall 2: x=8 to x=10 - Shortened for new gap */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[9, wallHeight / 2, 0]}
                    args={[2, wallHeight, wallThickness]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Top section - Two vertical walls creating 3 rooms */}
            {/* Left vertical wall (between Bedroom 1 and Master Bedroom) */}
            {/* Bottom segment - Shortened to create wider gap (0 to 4) */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[-houseSize / 4, wallHeight / 2, 2]}
                    args={[wallThickness, wallHeight, 4]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Top segment (doorway gap between 4 and 6) - Starts at 6 */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[-houseSize / 4, wallHeight / 2, 8]}
                    args={[wallThickness, wallHeight, 4]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Right vertical wall (between Master Bedroom and Kitchen/Living) */}
            {/* Bottom segment - Shortened to create wider gap (0 to 4) */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[houseSize / 4, wallHeight / 2, 2]}
                    args={[wallThickness, wallHeight, 4]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Top segment (doorway gap between 4 and 6) - Starts at 6 */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[houseSize / 4, wallHeight / 2, 8]}
                    args={[wallThickness, wallHeight, 4]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Bottom section - One vertical wall creating 2 rooms */}
            {/* Vertical wall (between Bedroom 2 and Living Room) */}
            {/* Left segment */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[0, wallHeight / 2, -7]}
                    args={[wallThickness, wallHeight, 6]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Right segment (doorway gap between -4 and -2) - Adjusted to stop at z=0 */}
            <RigidBody type="fixed" colliders="cuboid">
                <FadingWall
                    position={[0, wallHeight / 2, -1]}
                    args={[wallThickness, wallHeight, 2]}
                    color="#c9b18a"
                />
            </RigidBody>

            {/* Gifts in each room */}
            {gifts.map(gift => (
                <Gift key={gift.id} {...gift} />
            ))}

            {/* Doors */}
            {/* Gap 1: Horizontal wall, x between -4 and -2. Hinge at -4. */}
            <Door position={[-4, 0, 0]} size={[2, 3, 0.2]} />

            {/* Gap 2: Horizontal wall, x between 6 and 8. Hinge at 8 (Right side). */}
            <Door position={[8, 0, 0]} rotation={[0, Math.PI, 0]} size={[2, 3, 0.2]} />

            {/* Gap 3: Vertical wall (Left), z between 4 and 6. Hinge at 6 (Top side). */}
            <Door position={[-5, 0, 6]} rotation={[0, Math.PI / 2, 0]} size={[2, 3, 0.2]} />

            {/* Gap 4: Vertical wall (Right), z between 4 and 6. Hinge at 6 (Top side). */}
            <Door position={[5, 0, 6]} rotation={[0, Math.PI / 2, 0]} size={[2, 3, 0.2]} />

            {/* Gap 5: Vertical wall (Bottom), z between -4 and -2. Hinge at -4. */}
            <Door position={[0, 0, -4]} rotation={[0, -Math.PI / 2, 0]} size={[2, 3, 0.2]} />


            {/* ========== BEDROOM 1 (Position: -5, 5) - Cozy Bedroom ========== */}
            {/* Floor - Warm wooden floor */}
            <mesh position={[-houseSize / 4, 0, houseSize / 4]} receiveShadow>
                <boxGeometry args={[houseSize / 2, 0.05, houseSize / 2]} />
                <meshStandardMaterial color="#8b6f47" />
            </mesh>

            {/* Bed frame - Moved to corner to not block door */}
            <mesh position={[-7.5, 0.2, 8]} castShadow>
                <boxGeometry args={[2.2, 0.4, 3.2]} />
                <meshStandardMaterial color="#654321" />
            </mesh>
            {/* Mattress */}
            <mesh position={[-7.5, 0.5, 8]} castShadow>
                <boxGeometry args={[2, 0.3, 3]} />
                <meshStandardMaterial color="#e8dcc4" />
            </mesh>
            {/* Pillow */}
            <mesh position={[-7.5, 0.7, 9.2]} castShadow>
                <boxGeometry args={[1.5, 0.2, 0.6]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Nightstand - Moved slightly to avoid wall clipping */}
            <mesh position={[-5.6, 0.3, 8]} castShadow>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshStandardMaterial color="#5c4033" />
            </mesh>
            {/* Lamp on nightstand */}
            <mesh position={[-5.6, 0.8, 8]} castShadow>
                <cylinderGeometry args={[0.1, 0.15, 0.4]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <pointLight position={[-5.6, 1, 8]} color="#fff5e1" intensity={2} distance={4} />

            {/* Wall decoration - Picture frame */}
            <mesh position={[-9.8, 1.5, 8]} castShadow>
                <boxGeometry args={[0.1, 0.8, 1]} />
                <meshStandardMaterial color="#8b4513" />
            </mesh>

            {/* ========== KITCHEN (Position: 5, -5) ========== */}
            {/* Floor - Tile floor */}
            <mesh position={[houseSize / 4, 0, -houseSize / 4]} receiveShadow>
                <boxGeometry args={[houseSize / 2, 0.05, houseSize / 2]} />
                <meshStandardMaterial color="#e8e8e8" />
            </mesh>

            {/* Kitchen counter */}
            <mesh position={[6, 0.5, -6]} castShadow>
                <boxGeometry args={[1.5, 1, 3]} />
                <meshStandardMaterial color="#4a4a4a" />
            </mesh>
            {/* Counter top */}
            <mesh position={[6, 1.05, -6]} castShadow>
                <boxGeometry args={[1.6, 0.1, 3.1]} />
                <meshStandardMaterial color="#2c2c2c" />
            </mesh>

            {/* Refrigerator */}
            <mesh position={[8, 1, -7]} castShadow>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Fridge handle */}
            <mesh position={[7.5, 1.2, -7]} castShadow>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial color="#808080" />
            </mesh>

            {/* Stove */}
            <mesh position={[6, 0.5, -4]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Stove burners */}
            <mesh position={[6, 1.05, -4.2]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[6, 1.05, -3.8]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.05]} />
                <meshStandardMaterial color="#333333" />
            </mesh>

            {/* Sink */}
            <mesh position={[6, 0.9, -8]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.6]} />
                <meshStandardMaterial color="#b0b0b0" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Kitchen lighting */}
            <pointLight position={[6, 2.5, -6]} color="#ffffff" intensity={3} distance={6} />

            {/* ========== LIVING ROOM (Position: 5, 5) ========== */}
            {/* Floor - Hardwood */}
            <mesh position={[houseSize / 4, 0, houseSize / 4]} receiveShadow>
                <boxGeometry args={[houseSize / 2, 0.05, houseSize / 2]} />
                <meshStandardMaterial color="#a0826d" />
            </mesh>



            {/* Sofa */}
            <mesh position={[7, 0.4, 7]} castShadow>
                <boxGeometry args={[3, 0.8, 1.2]} />
                <meshStandardMaterial color="#4a5568" />
            </mesh>
            {/* Sofa back */}
            <mesh position={[7, 0.9, 7.5]} castShadow>
                <boxGeometry args={[3, 0.8, 0.2]} />
                <meshStandardMaterial color="#4a5568" />
            </mesh>
            {/* Sofa cushions */}
            <mesh position={[6.5, 0.85, 7]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.8]} />
                <meshStandardMaterial color="#e63946" />
            </mesh>
            <mesh position={[7.5, 0.85, 7]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.8]} />
                <meshStandardMaterial color="#e63946" />
            </mesh>

            {/* TV Stand */}
            <mesh position={[7, 0.3, 4]} castShadow>
                <boxGeometry args={[2, 0.6, 0.5]} />
                <meshStandardMaterial color="#2d3748" />
            </mesh>
            {/* TV */}
            <mesh position={[7, 1, 4]} castShadow>
                <boxGeometry args={[1.5, 1, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Living room lighting */}
            <pointLight position={[6, 2.5, 6]} color="#fff5e1" intensity={2.5} distance={6} />

            {/* ========== BEDROOM 2 (Position: -5, -5) ========== */}
            {/* Floor - Carpet */}
            <mesh position={[-houseSize / 4, 0, -houseSize / 4]} receiveShadow>
                <boxGeometry args={[houseSize / 2, 0.05, houseSize / 2]} />
                <meshStandardMaterial color="#6b5b95" />
            </mesh>

            {/* Bed frame */}
            <mesh position={[-6, 0.2, -6]} castShadow>
                <boxGeometry args={[2.2, 0.4, 3.2]} />
                <meshStandardMaterial color="#4a4a4a" />
            </mesh>
            {/* Mattress */}
            <mesh position={[-6, 0.5, -6]} castShadow>
                <boxGeometry args={[2, 0.3, 3]} />
                <meshStandardMaterial color="#d4a5a5" />
            </mesh>
            {/* Pillows */}
            <mesh position={[-6.4, 0.7, -7.2]} castShadow>
                <boxGeometry args={[0.6, 0.2, 0.6]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-5.6, 0.7, -7.2]} castShadow>
                <boxGeometry args={[0.6, 0.2, 0.6]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* Dresser */}
            <mesh position={[-8, 0.5, -4]} castShadow>
                <boxGeometry args={[1, 1, 2]} />
                <meshStandardMaterial color="#5a5a5a" />
            </mesh>
            {/* Dresser drawers */}
            <mesh position={[-7.5, 0.7, -4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.8]} />
                <meshStandardMaterial color="#3a3a3a" />
            </mesh>
            <mesh position={[-7.5, 0.3, -4]} castShadow>
                <boxGeometry args={[0.05, 0.3, 0.8]} />
                <meshStandardMaterial color="#3a3a3a" />
            </mesh>

            {/* Wardrobe */}
            <mesh position={[-4, 1, -8]} castShadow>
                <boxGeometry args={[1.5, 2, 0.8]} />
                <meshStandardMaterial color="#4a4a4a" />
            </mesh>

            {/* Bedroom 2 lighting */}
            <pointLight position={[-6, 2.5, -6]} color="#e6b3ff" intensity={2} distance={5} />

            {/* ========== MASTER BEDROOM (Center: 0, 5) ========== */}
            {/* Floor - Premium carpet */}
            <mesh position={[0, 0.02, 5]} receiveShadow>
                <cylinderGeometry args={[3, 3, 0.1, 32]} />
                <meshStandardMaterial color="#8b0000" />
            </mesh>

            {/* Large bed frame */}
            <mesh position={[0, 0.3, 5]} castShadow>
                <boxGeometry args={[2.5, 0.6, 3.5]} />
                <meshStandardMaterial color="#2c1810" />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.8, 3.5]} castShadow>
                <boxGeometry args={[2.6, 1.2, 0.2]} />
                <meshStandardMaterial color="#3d2817" />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, 0.7, 5]} castShadow>
                <boxGeometry args={[2.3, 0.4, 3.3]} />
                <meshStandardMaterial color="#f5f5dc" />
            </mesh>
            {/* Decorative pillows */}
            <mesh position={[-0.6, 0.95, 3.7]} castShadow>
                <boxGeometry args={[0.5, 0.2, 0.5]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <mesh position={[0, 0.95, 3.7]} castShadow>
                <boxGeometry args={[0.5, 0.2, 0.5]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <mesh position={[0.6, 0.95, 3.7]} castShadow>
                <boxGeometry args={[0.5, 0.2, 0.5]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Nightstands - Moved inward to avoid wall clipping */}
            <mesh position={[-1.6, 0.4, 5]} castShadow>
                <boxGeometry args={[0.7, 0.8, 0.7]} />
                <meshStandardMaterial color="#3d2817" />
            </mesh>
            <mesh position={[1.6, 0.4, 5]} castShadow>
                <boxGeometry args={[0.7, 0.8, 0.7]} />
                <meshStandardMaterial color="#3d2817" />
            </mesh>

            {/* Lamps on nightstands */}
            <mesh position={[-1.6, 1, 5]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.5]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>
            <mesh position={[1.6, 1, 5]} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 0.5]} />
                <meshStandardMaterial color="#ffd700" />
            </mesh>

            {/* Master bedroom elegant lighting */}
            <pointLight position={[-1.8, 1.5, 5]} color="#fff5e1" intensity={2} distance={3} />
            <pointLight position={[1.8, 1.5, 5]} color="#fff5e1" intensity={2} distance={3} />
            <pointLight position={[0, 2.8, 5]} color="#ffe4b5" intensity={1.5} distance={5} />
        </>
    );
}
