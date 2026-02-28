import * as THREE from 'three';
import { skills, projects } from './content.js';
import { createBoyWithLaptop } from './boyModel.js';

/**
 * Creates and manages the Three.js 3D scene:
 * - Multi-layer particle system (starfield + nebula + dust)
 * - 3D Boy with laptop model (visible in projects area)
 * - Floating geometric objects at project positions
 * - Dynamic lighting
 * - Fog for cinematic depth
 */
export class Scene3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        this.projectObjects = [];
        this.floatingShapes = [];
        this.boyModel = null;

        this.init();
        this.createParticles();
        this.createNebulaParticles();
        this.createBoyModel();
        this.createProjectObjects();
        this.createFloatingShapes();
        this.createLights();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x06080d, 0.006);

        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 2, 60);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x06080d, 1);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    createParticles() {
        const count = 10000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorPalette = [
            new THREE.Color('#00d4ff'),
            new THREE.Color('#3b82f6'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#ffffff'),
            new THREE.Color('#8b93a8'),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 120;
            positions[i3 + 1] = (Math.random() - 0.5) * 80;
            positions[i3 + 2] = (Math.random() - 0.5) * 500 - 30;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createNebulaParticles() {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const nebulaColors = [
            new THREE.Color('#1a0533'),
            new THREE.Color('#0a1628'),
            new THREE.Color('#001a1a'),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 150;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 500 - 30;

            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.8,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.nebula = new THREE.Points(geometry, material);
        this.scene.add(this.nebula);

        // Dust layer
        const dustCount = 5000;
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            const i3 = i * 3;
            dustPositions[i3] = (Math.random() - 0.5) * 100;
            dustPositions[i3 + 1] = (Math.random() - 0.5) * 80;
            dustPositions[i3 + 2] = (Math.random() - 0.5) * 500 - 30;
        }
        dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

        const dustMaterial = new THREE.PointsMaterial({
            size: 0.04,
            color: 0xffffff,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.dust = new THREE.Points(dustGeometry, dustMaterial);
        this.scene.add(this.dust);
    }

    createBoyModel() {
        this.boyModel = createBoyWithLaptop();
        // Position the boy in the projects area (matching camera z path for projects)
        // Will be centered at z = -35, slightly to the left
        this.boyModel.position.set(-6, -3, -35);
        this.boyModel.rotation.y = 0.4; // slightly facing right
        this.boyModel.visible = false; // hidden initially, shown during projects scroll
        this.scene.add(this.boyModel);
    }

    createProjectObjects() {
        const objectTypes = [
            () => new THREE.IcosahedronGeometry(2.5, 1),
            () => new THREE.TorusKnotGeometry(1.8, 0.5, 80, 16),
            () => new THREE.OctahedronGeometry(2.2, 0),
            () => new THREE.TorusGeometry(2, 0.6, 16, 50),
            () => new THREE.DodecahedronGeometry(2, 0),
            () => new THREE.IcosahedronGeometry(2, 2),
        ];

        // All projects are at the same Z (projects section area), spread on X
        const zPos = -35;

        projects.forEach((project, index) => {
            const geometry = objectTypes[index % objectTypes.length]();
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(project.color),
                metalness: 0.3,
                roughness: 0.15,
                transparent: true,
                opacity: 0.2,
                wireframe: true,
                emissive: new THREE.Color(project.color),
                emissiveIntensity: 0.1,
            });

            const mesh = new THREE.Mesh(geometry, material);
            // Spread objects along +X axis far apart (will scroll into view)
            mesh.position.set(15 + index * 25, 2, zPos);

            this.scene.add(mesh);
            this.projectObjects.push(mesh);
        });
    }

    createFloatingShapes() {
        const shapeCount = 30;
        const geometries = [
            new THREE.TetrahedronGeometry(0.5, 0),
            new THREE.OctahedronGeometry(0.4, 0),
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
        ];

        for (let i = 0; i < shapeCount; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random() * 0.3, 0.6, 0.5),
                metalness: 0.5,
                roughness: 0.3,
                transparent: true,
                opacity: 0.15,
                wireframe: true,
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 400 - 30
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            mesh.userData.speed = {
                rotX: (Math.random() - 0.5) * 0.3,
                rotY: (Math.random() - 0.5) * 0.3,
                floatSpeed: 0.3 + Math.random() * 0.5,
                floatOffset: Math.random() * Math.PI * 2,
            };

            this.scene.add(mesh);
            this.floatingShapes.push(mesh);
        }
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x00d4ff, 0.5);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        // Point lights for project objects (all at same Z, spread on X)
        this.pointLights = [];
        const zPos = -35;

        projects.forEach((project, i) => {
            const light = new THREE.PointLight(new THREE.Color(project.color), 1.5, 35);
            light.position.set(15 + i * 25, 2, zPos);
            this.scene.add(light);
            this.pointLights.push(light);
        });

        // Atmosphere lights
        const atmosphereLights = [
            { color: 0x00d4ff, pos: [0, 5, 40], intensity: 1, distance: 40 },
            { color: 0xa855f7, pos: [-10, -3, -130], intensity: 1.5, distance: 40 },
            { color: 0x3b82f6, pos: [10, 5, -165], intensity: 1, distance: 40 },
        ];

        atmosphereLights.forEach(({ color, pos, intensity, distance }) => {
            const light = new THREE.PointLight(color, intensity, distance);
            light.position.set(...pos);
            this.scene.add(light);
        });
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(e) {
        this.targetMouse.x = (e.clientX / this.width - 0.5) * 2;
        this.targetMouse.y = (e.clientY / this.height - 0.5) * 2;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsed = this.clock.getElapsedTime();

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Particle rotation
        if (this.particles) {
            this.particles.rotation.y = elapsed * 0.01;
            this.particles.rotation.x = Math.sin(elapsed * 0.08) * 0.015;
        }

        if (this.nebula) {
            this.nebula.rotation.y = -elapsed * 0.005;
            this.nebula.rotation.z = elapsed * 0.003;
        }

        if (this.dust) {
            this.dust.rotation.y = -elapsed * 0.007;
        }

        // Rotate project objects
        this.projectObjects.forEach((obj, i) => {
            obj.rotation.x = elapsed * (0.12 + i * 0.04);
            obj.rotation.y = elapsed * (0.15 + i * 0.03);
            // Subtle float on baseY
            const baseY = 2;
            obj.position.y = baseY + Math.sin(elapsed * 0.4 + i * 1.2) * 1.5;
        });

        // Boy model breathing animation
        if (this.boyModel && this.boyModel.visible) {
            this.boyModel.position.y = -3 + Math.sin(elapsed * 0.8) * 0.15;
            // Slight head bobbing — find head child (first sphere)
        }

        // Float shapes
        this.floatingShapes.forEach((shape) => {
            const s = shape.userData.speed;
            shape.rotation.x += s.rotX * 0.01;
            shape.rotation.y += s.rotY * 0.01;
            shape.position.y += Math.sin(elapsed * s.floatSpeed + s.floatOffset) * 0.005;
        });

        // Camera parallax from mouse
        this.camera.rotation.x += (this.mouse.y * 0.015 - this.camera.rotation.x) * 0.03;
        this.camera.rotation.y += (-this.mouse.x * 0.015 - this.camera.rotation.y) * 0.03;

        this.renderer.render(this.scene, this.camera);
    }

    getCamera() { return this.camera; }
    getProjectObjects() { return this.projectObjects; }
    getBoyModel() { return this.boyModel; }
    getLoadingProgress() { return 1; }
}
