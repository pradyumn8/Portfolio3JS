import * as THREE from 'three';

/**
 * Creates a procedural 3D boy sitting with a laptop.
 * Built entirely from Three.js primitives:
 * - Head (sphere), hair (extruded), eyes
 * - Torso (box), arms (capsule/cylinder), hands
 * - Legs (cylinder) in sitting position
 * - Laptop (box lid + base with screen glow)
 *
 * Returns a THREE.Group that can be added to scene.
 */
export function createBoyWithLaptop() {
    const group = new THREE.Group();

    // ========================
    // MATERIALS
    // ========================
    const skinMat = new THREE.MeshPhysicalMaterial({
        color: 0xd4a574,
        roughness: 0.6,
        metalness: 0.05,
        emissive: 0x1a0a00,
        emissiveIntensity: 0.1,
    });

    const hairMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a2e,
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0x050510,
        emissiveIntensity: 0.05,
    });

    const shirtMat = new THREE.MeshPhysicalMaterial({
        color: 0x00d4ff,
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0x003344,
        emissiveIntensity: 0.2,
    });

    const pantsMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a3e,
        roughness: 0.6,
        metalness: 0.05,
        emissive: 0x050515,
        emissiveIntensity: 0.05,
    });

    const shoeMat = new THREE.MeshPhysicalMaterial({
        color: 0x2a2a2a,
        roughness: 0.3,
        metalness: 0.3,
        emissive: 0x0a0a0a,
        emissiveIntensity: 0.05,
    });

    const laptopMat = new THREE.MeshPhysicalMaterial({
        color: 0x333340,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x0a0a15,
        emissiveIntensity: 0.1,
    });

    const screenMat = new THREE.MeshPhysicalMaterial({
        color: 0x00d4ff,
        roughness: 0.1,
        metalness: 0.0,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.95,
    });

    const eyeWhiteMat = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        roughness: 0.3,
        metalness: 0,
    });

    const eyePupilMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a2e,
        roughness: 0.3,
        metalness: 0.1,
    });

    // ========================
    // HEAD
    // ========================
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 24, 24),
        skinMat
    );
    head.position.set(0, 3.1, 0);
    group.add(head);

    // Hair (top of head — flattened sphere)
    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(0.58, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55),
        hairMat
    );
    hair.position.set(0, 3.15, 0);
    group.add(hair);

    // Hair sides
    const hairSideL = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.35, 0.3),
        hairMat
    );
    hairSideL.position.set(-0.52, 3.15, 0.05);
    group.add(hairSideL);

    const hairSideR = hairSideL.clone();
    hairSideR.position.set(0.52, 3.15, 0.05);
    group.add(hairSideR);

    // Hair fringe
    const fringe = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.15, 0.15),
        hairMat
    );
    fringe.position.set(0, 3.5, 0.42);
    fringe.rotation.x = -0.2;
    group.add(fringe);

    // Eyes
    const eyeL = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        eyeWhiteMat
    );
    eyeL.position.set(-0.18, 3.12, 0.48);
    group.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.set(0.18, 3.12, 0.48);
    group.add(eyeR);

    // Pupils
    const pupilL = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 10, 10),
        eyePupilMat
    );
    pupilL.position.set(-0.18, 3.11, 0.54);
    group.add(pupilL);

    const pupilR = pupilL.clone();
    pupilR.position.set(0.18, 3.11, 0.54);
    group.add(pupilR);

    // Nose (small bump)
    const nose = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        skinMat
    );
    nose.position.set(0, 3.0, 0.52);
    nose.scale.set(1, 0.7, 0.8);
    group.add(nose);

    // Mouth (thin box)
    const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.03, 0.02),
        new THREE.MeshPhysicalMaterial({ color: 0xc07060, roughness: 0.5 })
    );
    mouth.position.set(0, 2.88, 0.5);
    group.add(mouth);

    // Ears
    const earL = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        skinMat
    );
    earL.position.set(-0.55, 3.1, 0);
    earL.scale.set(0.4, 0.8, 0.6);
    group.add(earL);

    const earR = earL.clone();
    earR.position.set(0.55, 3.1, 0);
    group.add(earR);

    // ========================
    // NECK
    // ========================
    const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.18, 0.25, 12),
        skinMat
    );
    neck.position.set(0, 2.5, 0);
    group.add(neck);

    // ========================
    // TORSO (sitting posture — leaning slightly forward)
    // ========================
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.1, 0.45),
        shirtMat
    );
    torso.position.set(0, 1.85, 0);
    torso.rotation.x = 0.1; // slight lean forward
    group.add(torso);

    // T-shirt collar detail
    const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.03, 8, 16, Math.PI),
        shirtMat.clone()
    );
    collar.material.color.set(0x00b0dd);
    collar.position.set(0, 2.35, 0.2);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

    // ========================
    // ARMS (reaching toward laptop)
    // ========================
    // Upper arms
    const upperArmL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.11, 0.55, 10),
        shirtMat
    );
    upperArmL.position.set(-0.58, 2.05, 0.15);
    upperArmL.rotation.z = 0.4;
    upperArmL.rotation.x = -0.5;
    group.add(upperArmL);

    const upperArmR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.11, 0.55, 10),
        shirtMat
    );
    upperArmR.position.set(0.58, 2.05, 0.15);
    upperArmR.rotation.z = -0.4;
    upperArmR.rotation.x = -0.5;
    group.add(upperArmR);

    // Forearms
    const forearmL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10),
        skinMat
    );
    forearmL.position.set(-0.55, 1.55, 0.5);
    forearmL.rotation.x = -1.2;
    forearmL.rotation.z = 0.15;
    group.add(forearmL);

    const forearmR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.09, 0.5, 10),
        skinMat
    );
    forearmR.position.set(0.55, 1.55, 0.5);
    forearmR.rotation.x = -1.2;
    forearmR.rotation.z = -0.15;
    group.add(forearmR);

    // Hands (small spheres resting on laptop)
    const handL = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 10, 10),
        skinMat
    );
    handL.position.set(-0.4, 1.32, 0.72);
    group.add(handL);

    const handR = handL.clone();
    handR.position.set(0.4, 1.32, 0.72);
    group.add(handR);

    // ========================
    // LEGS (sitting — thighs horizontal, shins vertical)
    // ========================
    // Thighs (horizontal)
    const thighL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.13, 0.7, 10),
        pantsMat
    );
    thighL.position.set(-0.22, 1.15, 0.35);
    thighL.rotation.x = -Math.PI / 2.2;
    group.add(thighL);

    const thighR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.13, 0.7, 10),
        pantsMat
    );
    thighR.position.set(0.22, 1.15, 0.35);
    thighR.rotation.x = -Math.PI / 2.2;
    group.add(thighR);

    // Shins (hanging down)
    const shinL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.1, 0.65, 10),
        pantsMat
    );
    shinL.position.set(-0.22, 0.55, 0.65);
    shinL.rotation.x = -0.15;
    group.add(shinL);

    const shinR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.1, 0.65, 10),
        pantsMat
    );
    shinR.position.set(0.22, 0.55, 0.65);
    shinR.rotation.x = -0.15;
    group.add(shinR);

    // Shoes
    const shoeL = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.3),
        shoeMat
    );
    shoeL.position.set(-0.22, 0.2, 0.72);
    group.add(shoeL);

    const shoeR = shoeL.clone();
    shoeR.position.set(0.22, 0.2, 0.72);
    group.add(shoeR);

    // ========================
    // LAPTOP
    // ========================
    const laptopGroup = new THREE.Group();

    // Laptop base (on thighs)
    const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.04, 0.55),
        laptopMat
    );
    laptopBase.position.set(0, 0, 0);
    laptopGroup.add(laptopBase);

    // Keyboard surface (subtle detail)
    const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.005, 0.35),
        new THREE.MeshPhysicalMaterial({
            color: 0x222230,
            roughness: 0.4,
            metalness: 0.5,
        })
    );
    keyboard.position.set(0, 0.025, -0.05);
    laptopGroup.add(keyboard);

    // Trackpad
    const trackpad = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.005, 0.15),
        new THREE.MeshPhysicalMaterial({
            color: 0x2a2a3a,
            roughness: 0.3,
            metalness: 0.6,
        })
    );
    trackpad.position.set(0, 0.025, 0.16);
    laptopGroup.add(trackpad);

    // Laptop lid (screen)
    const lidGroup = new THREE.Group();

    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.56, 0.025),
        laptopMat
    );
    lid.position.set(0, 0.28, 0);
    lidGroup.add(lid);

    // Screen
    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.46, 0.005),
        screenMat
    );
    screen.position.set(0, 0.28, 0.016);
    lidGroup.add(screen);

    // Screen code lines (decorative)
    const lineMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
    });

    for (let i = 0; i < 6; i++) {
        const lineWidth = 0.15 + Math.random() * 0.35;
        const codeLine = new THREE.Mesh(
            new THREE.BoxGeometry(lineWidth, 0.015, 0.003),
            i % 3 === 0 ? lineMat : lineMat.clone()
        );
        if (i % 3 === 1) {
            codeLine.material.color.set(0xa855f7);
            codeLine.material.emissive.set(0xa855f7);
        } else if (i % 3 === 2) {
            codeLine.material.color.set(0x00d4ff);
            codeLine.material.emissive.set(0x00d4ff);
        }
        codeLine.position.set(-0.12 + (Math.random() - 0.5) * 0.1, 0.44 - i * 0.06, 0.02);
        lidGroup.add(codeLine);
    }

    // Camera dot
    const cameraDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 8),
        new THREE.MeshPhysicalMaterial({
            color: 0x22c55e,
            emissive: 0x22c55e,
            emissiveIntensity: 1,
        })
    );
    cameraDot.position.set(0, 0.53, 0.016);
    lidGroup.add(cameraDot);

    // Position lid — tilted open
    lidGroup.position.set(0, 0, -0.275);
    lidGroup.rotation.x = -0.35; // tilted open
    laptopGroup.add(lidGroup);

    // Position entire laptop on boy's lap
    laptopGroup.position.set(0, 1.32, 0.45);
    laptopGroup.rotation.x = -0.15;
    group.add(laptopGroup);

    // ========================
    // SCREEN GLOW LIGHT
    // ========================
    const screenLight = new THREE.PointLight(0x00d4ff, 2, 5);
    screenLight.position.set(0, 2.0, 1.0);
    group.add(screenLight);

    // Bottom ambient light
    const ambientGlow = new THREE.PointLight(0xa855f7, 0.5, 4);
    ambientGlow.position.set(0, 0.5, 0.5);
    group.add(ambientGlow);

    // ========================
    // CHAIR / PLATFORM (floating platform)
    // ========================
    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(1.0, 1.2, 0.08, 32),
        new THREE.MeshPhysicalMaterial({
            color: 0x0a0a1a,
            roughness: 0.3,
            metalness: 0.7,
            transparent: true,
            opacity: 0.6,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.05,
        })
    );
    platform.position.set(0, 0.08, 0.3);
    group.add(platform);

    // Platform rim glow
    const rimGlow = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.02, 8, 48),
        new THREE.MeshPhysicalMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.5,
        })
    );
    rimGlow.position.set(0, 0.12, 0.3);
    rimGlow.rotation.x = Math.PI / 2;
    group.add(rimGlow);

    // Scale and position the whole group
    group.scale.set(2.2, 2.2, 2.2);

    return group;
}
