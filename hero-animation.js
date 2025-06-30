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
        // Connection handling properties
        this.connections = [];
        this.pendingConnections = [];
        this.connectionIndex = 0;
        this.lastConnectionTime = 0;
        this.connectionInterval = 800; // milliseconds between connection creation
        this.connectionCycleDelay = 1500; // wait before restarting cycle
        this.cycleCompleted = false;
        this.cycleCompletedTime = 0;
        
        this.init();
        this.createGlobe();
        this.createFloatingCubes();
        // Prepare sequence of connections between cubes
        this.prepareConnections();
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
            
            // Create filled cube geometry
            const geometry = new THREE.BoxGeometry(size, size, size);

            // Glass-morphism material for semi-transparent blocks
            const cubeMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xCAA968,
                metalness: 0,
                roughness: 0,
                transmission: 0.9, // enables real-time refraction
                thickness: 0.4,     // volume thickness for refraction
                ior: 1.5,           // index of refraction
                transparent: true,
                opacity: 0.25,      // overall opacity
                envMapIntensity: 1,
                clearcoat: 1,
                clearcoatRoughness: 0
            });
            const cubeMesh = new THREE.Mesh(geometry, cubeMaterial);
            cubeMesh.renderOrder = -2;
            cubeMaterial.depthWrite = false;
            cubeGroup.add(cubeMesh);

            // Subtle edge outline to highlight block shape
            const edges = new THREE.EdgesGeometry(geometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: 0x1D0C46,
                transparent: true,
                opacity: 0.8,
                linewidth: 2
            });
            const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
            edgeLines.renderOrder = -2;
            edgeMaterial.depthWrite = false;
            cubeGroup.add(edgeLines);
            
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

    // Prepare a linear chain of cube-to-cube connections
    prepareConnections() {
        // Connect each cube to the next one in the array, ensuring max 2 connections per cube
        for (let i = 0; i < this.cubes.length - 1; i++) {
            this.pendingConnections.push([this.cubes[i], this.cubes[i + 1]]);
        }
    }

    // Create a visual connection between two cubes
    addConnection(cube1, cube2) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6); // two points (cube1, cube2)
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0x1D0C46,
            transparent: true,
            opacity: 0.6,
            linewidth: 5, // thicker beam
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const line = new THREE.Line(geometry, material);
        line.renderOrder = -3;
        this.scene.add(line);

        // Ensure connections sit behind cubes visually
        line.material.depthWrite = false;
        this.connections.push({ cube1, cube2, geometry, line });
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
        
        // Sequentially create connections between cubes
        if (this.connectionIndex < this.pendingConnections.length && Date.now() - this.lastConnectionTime > this.connectionInterval) {
            const [cube1, cube2] = this.pendingConnections[this.connectionIndex];
            this.addConnection(cube1, cube2);
            this.connectionIndex++;
            this.lastConnectionTime = Date.now();
        }

        // Detect completion of a connection cycle
        if (this.connectionIndex === this.pendingConnections.length && !this.cycleCompleted) {
            this.cycleCompleted = true;
            this.cycleCompletedTime = Date.now();
        }

        // After delay, clear connections and restart
        if (this.cycleCompleted && Date.now() - this.cycleCompletedTime > this.connectionCycleDelay) {
            // Remove all connection lines from scene
            this.connections.forEach(({ line, geometry }) => {
                this.scene.remove(line);
                geometry.dispose();
            });
            this.connections = [];
            this.connectionIndex = 0;
            this.lastConnectionTime = Date.now();
            this.cycleCompleted = false;
        }

        // Update existing connection line positions
        this.connections.forEach((conn) => {
            const positions = conn.geometry.attributes.position.array;
            positions[0] = conn.cube1.position.x;
            positions[1] = conn.cube1.position.y;
            positions[2] = conn.cube1.position.z;
            positions[3] = conn.cube2.position.x;
            positions[4] = conn.cube2.position.y;
            positions[5] = conn.cube2.position.z;
            conn.geometry.attributes.position.needsUpdate = true;
        });
        
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