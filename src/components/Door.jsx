import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

export default function Door({ position, rotation = [0, 0, 0], size = [2, 3, 0.2] }) {
    const rigidBodyRef = useRef();
    const smoothRotation = useRef(0);
    const [isOpen, setIsOpen] = useState(false);
    const [openDir, setOpenDir] = useState(1); // 1 or -1

    useFrame((state) => {
        if (!rigidBodyRef.current) return;

        const playerPos = state.camera.position;
        const doorPos = new THREE.Vector3(position[0], position[1], position[2]);

        // Character position (approximate, compensating for camera offset)
        const characterPos = new THREE.Vector3(playerPos.x, 0, playerPos.z - 6);

        const distance = characterPos.distanceTo(new THREE.Vector3(doorPos.x, 0, doorPos.z));
        const shouldOpen = distance < 2.5;

        // Determine opening direction only when opening starts
        if (shouldOpen && !isOpen) {
            // Transform player position to door local space to check which side they are on
            const doorRot = new THREE.Euler(...rotation);
            const doorQuat = new THREE.Quaternion().setFromEuler(doorRot);

            const localPlayerPos = characterPos.clone().sub(doorPos).applyQuaternion(doorQuat.clone().invert());

            // If player is on +Z side (local), open to +PI/2 (into -Z space) to avoid hitting them?
            // Let's visualize: Door along +X. Hinge (0,0).
            // +Z is "front". -Z is "back".
            // If player is at +Z, door should rotate to -Z (angle +PI/2? No, +PI/2 rotates +X to -Z? Yes.)
            // So if Z > 0, target is +PI/2.
            // If Z < 0, target is -PI/2.

            setOpenDir(localPlayerPos.z > 0 ? 1 : -1);
            setIsOpen(true);
        } else if (!shouldOpen && isOpen) {
            setIsOpen(false);
        }

        // Lerp rotation
        const target = isOpen ? openDir * Math.PI / 2 : 0;
        const step = 0.1;

        smoothRotation.current = THREE.MathUtils.lerp(smoothRotation.current, target, step);

        const q = new THREE.Quaternion();
        q.setFromEuler(new THREE.Euler(rotation[0], rotation[1] + smoothRotation.current, rotation[2]));
        rigidBodyRef.current.setNextKinematicRotation(q);
    });

    return (
        <group>
            {/* Static Door Frame */}
            <group position={position} rotation={rotation}>
                {/* Top Frame */}
                <mesh position={[size[0] / 2, size[1], 0]} castShadow receiveShadow>
                    <boxGeometry args={[size[0] + 0.2, 0.1, size[2] + 0.1]} />
                    <meshStandardMaterial color="#4a3b2a" />
                </mesh>
                {/* Side Frame (Hinge side) */}
                <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.1, size[1], size[2] + 0.1]} />
                    <meshStandardMaterial color="#4a3b2a" />
                </mesh>
                {/* Side Frame (Latch side) */}
                <mesh position={[size[0], size[1] / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.1, size[1], size[2] + 0.1]} />
                    <meshStandardMaterial color="#4a3b2a" />
                </mesh>
            </group>

            {/* Moving Door */}
            <RigidBody
                ref={rigidBodyRef}
                type="kinematicPosition"
                position={position}
                rotation={rotation}
            >
                {/* Offset mesh and collider so (0,0,0) is the hinge */}
                <group position={[size[0] / 2, size[1] / 2, 0]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[size[0], size[1], size[2]]} />
                        <meshStandardMaterial color="#8d6e63" />
                    </mesh>
                    {/* Handle */}
                    <mesh position={[size[0] / 2 - 0.2, 0, size[2] / 2 + 0.05]}>
                        <sphereGeometry args={[0.08]} />
                        <meshStandardMaterial color="#ffd700" />
                    </mesh>
                    <mesh position={[size[0] / 2 - 0.2, 0, -size[2] / 2 - 0.05]}>
                        <sphereGeometry args={[0.08]} />
                        <meshStandardMaterial color="#ffd700" />
                    </mesh>
                </group>
                <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} position={[size[0] / 2, size[1] / 2, 0]} />
            </RigidBody>
        </group>
    );
}
