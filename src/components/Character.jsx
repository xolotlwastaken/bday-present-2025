import { useRef } from 'react';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

export default function Character() {
    const characterRef = useRef();
    const groupRef = useRef();
    const leftArmRef = useRef();
    const rightArmRef = useRef();
    const leftLegRef = useRef();
    const rightLegRef = useRef();

    const [, get] = useKeyboardControls();

    const speed = 5;
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame((state, delta) => {
        if (!characterRef.current) return;

        // Check if a gift is currently being viewed
        const currentGift = useStore.getState().currentGift;

        // If viewing a gift, stop all movement
        if (currentGift) {
            const velocity = characterRef.current.linvel();
            characterRef.current.setLinvel({
                x: 0,
                y: velocity.y,
                z: 0
            });
            return;
        }

        const { forward, backward, left, right } = get();

        // Calculate movement direction
        frontVector.set(0, 0, Number(backward) - Number(forward));
        sideVector.set(Number(left) - Number(right), 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);

        // Apply velocity
        const velocity = characterRef.current.linvel();
        characterRef.current.setLinvel({
            x: direction.x,
            y: velocity.y,
            z: direction.z
        });

        // Rotation and Animation
        if (direction.lengthSq() > 0) {
            // Calculate target rotation angle
            const angle = Math.atan2(direction.x, direction.z);

            // Smoothly rotate the visual group
            const targetRotation = new THREE.Quaternion();
            targetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            groupRef.current.quaternion.slerp(targetRotation, 0.2);

            // Walking animation
            const t = state.clock.elapsedTime * 10;
            if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t) * 0.5;
            if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t) * 0.5;
            if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.sin(t) * 0.5;
            if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t) * 0.5;
        } else {
            // Reset animation when stopped
            if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
            if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
            if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
            if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
        }

        // Update camera to follow character (Closer 3rd Person View)
        const position = characterRef.current.translation();
        // Offset: Up 4, Back 6 (Closer and less panned out than before)
        const cameraOffset = new THREE.Vector3(0, 4, 6);

        state.camera.position.lerp(
            new THREE.Vector3(position.x + cameraOffset.x, position.y + cameraOffset.y, position.z + cameraOffset.z),
            0.1
        );
        state.camera.lookAt(position.x, position.y + 1, position.z);

        // Ensure body is awake
        characterRef.current.wakeUp();

        // Check for gift collisions
        const gifts = useStore.getState().gifts;
        const collectedGifts = useStore.getState().collectedGifts;

        gifts.forEach(gift => {
            if (!collectedGifts.includes(gift.id)) {
                const distance = Math.sqrt(
                    Math.pow(position.x - gift.position[0], 2) +
                    Math.pow(position.z - gift.position[2], 2)
                );

                // If close enough to gift, collect it
                if (distance < 2) {
                    useStore.getState().collectGift(gift.id);
                }
            }
        });
    });

    return (
        <RigidBody
            ref={characterRef}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 2, 10]}
            enabledRotations={[false, false, false]}
            linearDamping={5}
        >
            <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.2, 0]} />

            {/* Visual Group - Rotates */}
            <group ref={groupRef}>
                {/* Head */}
                <mesh position={[0, 0.9, 0]} castShadow>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial color="#ffdbac" />
                </mesh>

                {/* Blocky Long Hair */}
                <group>
                    {/* Top Hair */}
                    <mesh position={[0, 1.12, -0.05]} castShadow>
                        <boxGeometry args={[0.55, 0.2, 0.6]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>

                    {/* Back Hair - Thick block covering back of head */}
                    <mesh position={[0, 0.65, -0.25]} castShadow>
                        <boxGeometry args={[0.55, 0.9, 0.2]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>

                    {/* Side Hair - Left */}
                    <mesh position={[-0.22, 0.85, 0.1]} castShadow>
                        <boxGeometry args={[0.12, 0.4, 0.2]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>

                    {/* Side Hair - Right */}
                    <mesh position={[0.22, 0.85, 0.1]} castShadow>
                        <boxGeometry args={[0.12, 0.4, 0.2]} />
                        <meshStandardMaterial color="#5d4037" />
                    </mesh>
                </group>

                {/* Torso */}
                <mesh position={[0, 0.2, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.8, 0.4]} />
                    <meshStandardMaterial color="#ff69b4" />
                </mesh>

                {/* Left Arm Group (Pivot at shoulder) */}
                <group position={[-0.4, 0.5, 0]} ref={leftArmRef}>
                    <mesh position={[0, -0.3, 0]} castShadow>
                        <capsuleGeometry args={[0.1, 0.6]} />
                        <meshStandardMaterial color="#ff69b4" />
                    </mesh>
                </group>

                {/* Right Arm Group (Pivot at shoulder) */}
                <group position={[0.4, 0.5, 0]} ref={rightArmRef}>
                    <mesh position={[0, -0.3, 0]} castShadow>
                        <capsuleGeometry args={[0.1, 0.6]} />
                        <meshStandardMaterial color="#ff69b4" />
                    </mesh>
                </group>

                {/* Left Leg Group (Pivot at hip) */}
                <group position={[-0.15, -0.2, 0]} ref={leftLegRef}>
                    <mesh position={[0, -0.3, 0]} castShadow>
                        <capsuleGeometry args={[0.12, 0.6]} />
                        <meshStandardMaterial color="#2c3e50" />
                    </mesh>
                </group>

                {/* Right Leg Group (Pivot at hip) */}
                <group position={[0.15, -0.2, 0]} ref={rightLegRef}>
                    <mesh position={[0, -0.3, 0]} castShadow>
                        <capsuleGeometry args={[0.12, 0.6]} />
                        <meshStandardMaterial color="#2c3e50" />
                    </mesh>
                </group>
            </group>
        </RigidBody>
    );
}
