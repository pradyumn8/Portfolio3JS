import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Creates and manages the Three.js 3D scene with:
 * - Loaded GLTF laptop model as hero centerpiece
 * - Massive particle system (starfield/nebula)
 * - Floating geometric objects at section positions
 * - Dynamic colored lighting
 * - Fog for depth
 * - Mouse parallax
 */
export class Scene3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        this.sectionObjects = [];
        this.laptopModel = null;
        this.loadingProgress = 0;

        this.init();
        this.createParticles();
        this.createSectionObjects();
        this.createLights();
        this.loadLaptopModel();
        this.addEventListeners();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x030014, 0.006);

        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0, 50);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x030014, 1);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    loadLaptopModel() {
        const loader = new GLTFLoader();

        loader.load(
            '/models/laptop.glb',
            (gltf) => {
                this.laptopModel = gltf.scene;

                // Auto-size the model
                const box = new THREE.Box3().setFromObject(this.laptopModel);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.5 / maxDim; // Target size ~3.5 units (compact)
                this.laptopModel.scale.setScalar(scale);

                // Center the model
                const center = box.getCenter(new THREE.Vector3());
                this.laptopModel.position.x = -center.x * scale;
                this.laptopModel.position.y = -center.y * scale;
                this.laptopModel.position.z = -center.z * scale;

                // Create a group for positioning
                this.laptopGroup = new THREE.Group();
                this.laptopGroup.add(this.laptopModel);

                // Start laptop off-screen on the LEFT — GSAP will animate it to center
                this.laptopGroup.position.set(-12, -1, 46);
                this.laptopGroup.rotation.set(0.2, -0.4, 0.05);

                // Add subtle emissive glow to all materials
                this.laptopModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.envMapIntensity = 1.5;
                            // Screen glow effect
                            if (child.material.name && child.material.name.toLowerCase().includes('screen')) {
                                child.material.emissive = new THREE.Color('#00e5ff');
                                child.material.emissiveIntensity = 0.3;
                            }
                        }
                    }
                });

                this.scene.add(this.laptopGroup);

                // Add a spotlight pointing at the laptop (centered)
                const spotLight = new THREE.SpotLight(0x00e5ff, 3, 35, Math.PI / 5, 0.5, 1);
                spotLight.position.set(5, 8, 50);
                spotLight.target = this.laptopGroup;
                this.scene.add(spotLight);

                // Fill light from the other side
                const fillLight = new THREE.SpotLight(0xa855f7, 2, 30, Math.PI / 4, 0.5, 1);
                fillLight.position.set(-5, -3, 50);
                fillLight.target = this.laptopGroup;
                this.scene.add(fillLight);

                // Rim light from behind
                const rimLight = new THREE.PointLight(0xff006e, 1.5, 25);
                rimLight.position.set(0, 3, 39);
                this.scene.add(rimLight);

                this.loadingProgress = 1;
                console.log('✅ Laptop model loaded successfully');
            },
            (progress) => {
                if (progress.total > 0) {
                    this.loadingProgress = progress.loaded / progress.total;
                }
            },
            (error) => {
                console.warn('⚠️ Could not load laptop model:', error);
                this.loadingProgress = 1; // Don't block loading
            }
        );
    }

    createParticles() {
        // Main starfield
        const count = 10000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorPalette = [
            new THREE.Color('#00e5ff'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#3b82f6'),
            new THREE.Color('#ff006e'),
            new THREE.Color('#ffd700'),
            new THREE.Color('#ffffff'),
            new THREE.Color('#10b981'),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 80;
            positions[i3 + 2] = (Math.random() - 0.5) * 400 - 40;

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
            opacity: 0.75,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Dust particles
        const dustCount = 5000;
        const dustGeometry = new THREE.BufferGeometry();
        const dustPositions = new Float32Array(dustCount * 3);

        for (let i = 0; i < dustCount; i++) {
            const i3 = i * 3;
            dustPositions[i3] = (Math.random() - 0.5) * 120;
            dustPositions[i3 + 1] = (Math.random() - 0.5) * 100;
            dustPositions[i3 + 2] = (Math.random() - 0.5) * 400 - 40;
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

    createSectionObjects() {
        const objectTypes = [
            // Skip index 0 — hero uses laptop model instead
            () => new THREE.TorusKnotGeometry(2, 0.6, 80, 16), // About
            () => new THREE.OctahedronGeometry(2.5, 0),          // Skills
            () => new THREE.TorusGeometry(2.2, 0.7, 16, 50),    // Projects
            () => new THREE.DodecahedronGeometry(2.3, 0),        // Timeline
            () => new THREE.IcosahedronGeometry(2.8, 0),         // Contact
        ];

        const sectionColors = ['#a855f7', '#f7df1e', '#ff006e', '#ffd700', '#3b82f6'];
        const zPositions = [20, 5, -15, -35, -50];

        sectionColors.forEach((color, index) => {
            const geometry = objectTypes[index]();
            const material = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(color),
                metalness: 0.3,
                roughness: 0.2,
                transparent: true,
                opacity: 0.2,
                wireframe: true,
                emissive: new THREE.Color(color),
                emissiveIntensity: 0.12,
            });

            const mesh = new THREE.Mesh(geometry, material);
            const xOffset = index % 2 === 0 ? 14 : -14;
            mesh.position.set(xOffset, 0, zPositions[index]);

            this.scene.add(mesh);
            this.sectionObjects.push(mesh);
        });
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x111133, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        // Hemisphere light for better overall illumination
        const hemiLight = new THREE.HemisphereLight(0x00e5ff, 0x030014, 0.3);
        this.scene.add(hemiLight);

        const lightColors = [0xa855f7, 0xf7df1e, 0xff006e, 0xffd700, 0x3b82f6];
        const zPositions = [20, 5, -15, -35, -50];

        this.pointLights = [];
        lightColors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 1.5, 35);
            const xOffset = i % 2 === 0 ? 14 : -14;
            light.position.set(xOffset, 0, zPositions[i]);
            this.scene.add(light);
            this.pointLights.push(light);
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
        this.mouse.x = (e.clientX / this.width - 0.5) * 2;
        this.mouse.y = (e.clientY / this.height - 0.5) * 2;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsed = this.clock.getElapsedTime();

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = elapsed * 0.012;
            this.particles.rotation.x = Math.sin(elapsed * 0.08) * 0.02;
        }

        if (this.dust) {
            this.dust.rotation.y = -elapsed * 0.006;
        }

        // Gentle laptop float (only subtle Y bobbing — main movement handled by GSAP)
        if (this.laptopGroup && this.laptopGroup.userData.floatEnabled) {
            this.laptopGroup.position.y += Math.sin(elapsed * 0.5) * 0.003;
        }

        // Rotate section objects
        this.sectionObjects.forEach((obj, i) => {
            obj.rotation.x = elapsed * (0.12 + i * 0.04);
            obj.rotation.y = elapsed * (0.18 + i * 0.03);
            obj.position.y = Math.sin(elapsed * 0.4 + i * 1.5) * 1.5;
        });

        // Mouse parallax
        this.camera.rotation.x += (this.mouse.y * 0.015 - this.camera.rotation.x) * 0.04;
        this.camera.rotation.y += (-this.mouse.x * 0.015 - this.camera.rotation.y) * 0.04;

        this.renderer.render(this.scene, this.camera);
    }

    getCamera() {
        return this.camera;
    }

    getSectionObjects() {
        return this.sectionObjects;
    }

    getLaptopGroup() {
        return this.laptopGroup;
    }

    getLoadingProgress() {
        return this.loadingProgress;
    }
}
