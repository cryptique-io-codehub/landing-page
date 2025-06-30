class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.cubes = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        
        this.init();
        this.createGlobe();
        this.createFloatingCubes();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, -3, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Mobile adjustment: center camera vertically on small screens
        if (window.innerWidth <= 768) {
            this.camera.position.set(0, 0, 8);
            this.camera.lookAt(0, 0, 0);
        }
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        // Ensure full-width rendering on mobile for perfect centering
        if (window.innerWidth <= 768) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
            this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
        }
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    createGlobe() {
        const globeGroup = new THREE.Group();
        const particleCount = 2000;
        const radius = 3;
        
        // Create particle geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        // Distribute particles on sphere surface
        for (let i = 0; i < particleCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / particleCount);
            const theta = Math.sqrt(particleCount * Math.PI) * phi;
            
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(theta) * Math.sin(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create particle material with glow effect
        const material = new THREE.PointsMaterial({
            color: 0x1D0C46,
            size: 0.05,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        // Create particle system
        const particles = new THREE.Points(geometry, material);
        globeGroup.add(particles);
        
        // Add inner glow sphere
        const glowGeometry = new THREE.SphereGeometry(radius * 0.98, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x1D0C46,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        globeGroup.add(glowSphere);
        
        this.globe = globeGroup;
        // Default vertical offset for desktop
        this.globe.position.y = -1;

        // Center the globe vertically on mobile screens
        if (window.innerWidth <= 768) {
            this.globe.position.y = 0;
        }
        this.scene.add(this.globe);
    }

    createFloatingCubes() {
        const cubeCount = 20;
        
        for (let i = 0; i < cubeCount; i++) {
            const cubeGroup = new THREE.Group();
            
            // Random cube size
            const size = Math.random() * 0.8 + 0.4;
            
            // Create wireframe cube
            const geometry = new THREE.BoxGeometry(size, size, size);
            const edges = new THREE.EdgesGeometry(geometry);
            const material = new THREE.LineBasicMaterial({
                color: 0xCAA968,
                transparent: true,
                opacity: 0.6,
                linewidth: 2
            });
            
            const wireframe = new THREE.LineSegments(edges, material);
            cubeGroup.add(wireframe);
            
            // Add particle corners
            const cornerGeometry = new THREE.BufferGeometry();
            const cornerPositions = new Float32Array(8 * 3);
            const half = size / 2;
            
            const corners = [
                [-half, -half, -half], [half, -half, -half],
                [-half, half, -half], [half, half, -half],
                [-half, -half, half], [half, -half, half],
                [-half, half, half], [half, half, half]
            ];
            
            corners.forEach((corner, index) => {
                cornerPositions[index * 3] = corner[0];
                cornerPositions[index * 3 + 1] = corner[1];
                cornerPositions[index * 3 + 2] = corner[2];
            });
            
            cornerGeometry.setAttribute('position', new THREE.BufferAttribute(cornerPositions, 3));
            
            const cornerMaterial = new THREE.PointsMaterial({
                color: 0xCAA968,
                size: 0.1,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const cornerParticles = new THREE.Points(cornerGeometry, cornerMaterial);
            cubeGroup.add(cornerParticles);
            
            // Position cube randomly around globe
            const angle = (i / cubeCount) * Math.PI * 2 + Math.random() * 0.5;
            const distance = 5 + Math.random() * 4;
            const height = (Math.random() - 0.5) * 6;
            
            cubeGroup.position.set(
                Math.cos(angle) * distance,
                height,
                Math.sin(angle) * distance
            );
            
            // Random rotation speeds
            cubeGroup.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.003,
                    z: (Math.random() - 0.5) * 0.005
                },
                originalPosition: cubeGroup.position.clone(),
                time: Math.random() * Math.PI * 2
            };
            
            this.cubes.push(cubeGroup);
            this.scene.add(cubeGroup);
        }
    }

    setupEventListeners() {
        // Mouse movement for parallax
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.targetRotation.x = this.mouse.y * 0.1;
            this.targetRotation.y = this.mouse.x * 0.1;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            if (window.innerWidth <= 768) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            } else {
                this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate globe
        if (this.globe) {
            this.globe.rotation.y += 0.005;
        }
        
        // Animate cubes
        this.cubes.forEach((cube) => {
            const userData = cube.userData;
            
            // Rotate cubes
            cube.rotation.x += userData.rotationSpeed.x;
            cube.rotation.y += userData.rotationSpeed.y;
            cube.rotation.z += userData.rotationSpeed.z;
            
            // Float cubes
            userData.time += 0.016;
            cube.position.x = userData.originalPosition.x + Math.sin(userData.time) * 0.5;
            cube.position.y = userData.originalPosition.y + Math.cos(userData.time * 0.7) * 0.3;
            cube.position.z = userData.originalPosition.z + Math.sin(userData.time * 0.5) * 0.4;
        });
        
        // Smooth camera movement
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        
        this.camera.position.x = Math.sin(this.currentRotation.y) * 8;
        this.camera.position.y = 2 + this.currentRotation.x * 2;
        this.camera.position.z = Math.cos(this.currentRotation.y) * 8;
        this.camera.lookAt(0, 0, 0);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to load
    if (typeof THREE !== 'undefined') {
        new HeroAnimation();
    } else {
        // Fallback if Three.js doesn't load
        console.warn('Three.js not loaded, skipping 3D animation');
    }
}); 