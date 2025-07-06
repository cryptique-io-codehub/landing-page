class BlockchainVisualization {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.blocks = [];
        this.connections = [];
        this.clock = new THREE.Clock();
        
        this.init();
        this.animate();
    }
    
    init() {
        // Set up renderer with better antialiasing
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.container.appendChild(this.renderer.domElement);
        
        // Store references to materials for theme updates
        this.materials = [];
        this.lights = [];
        
        // Camera position - top down view, zoomed in
        this.camera.position.set(0, 12, 0.1); // Closer to the scene for better zoom
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.x = -Math.PI / 2; // Pointing straight down
        
        // Add lights
        this.addLights();
        
        // Create blockchain blocks
        this.createBlockchain();
        
        // Add orbit controls with auto-rotate
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        
        // Set initial target to center of the scene
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Listen for theme changes
        document.documentElement.addEventListener('theme-change', () => this.handleThemeChange());
    }
    
    handleThemeChange() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Update all materials
        this.materials.forEach(material => {
            if (!material) return;
            
            switch (material.type) {
                case 'MeshPhongMaterial':
                    material.color.setStyle(isLightMode ? '#0f0623' : '#4a69bd');  // Darker purple for light mode
                    material.emissive.setStyle(isLightMode ? '#2d1a5e' : '#1e3799');  // Darker emissive for light mode
                    material.emissiveIntensity = isLightMode ? 0.4 : 0.3;
                    material.needsUpdate = true;
                    break;
                    
                case 'LineBasicMaterial':
                    material.color.setStyle(isLightMode ? '#2d1a5e' : '#6a89cc');  // Darker blue for light mode
                    material.opacity = isLightMode ? 0.8 : 0.4;  // More opaque in light mode
                    material.needsUpdate = true;
                    break;
                    
                case 'MeshBasicMaterial':
                    if (material.name === 'connectionParticleMaterial') {
                        material.color.setStyle(isLightMode ? '#5a0f7a' : '#9b59b6');  // Darker purple for particles in light mode
                        material.needsUpdate = true;
                    } else if (material.name === 'particleMaterial') {
                        material.color.setStyle(isLightMode ? '#2d1a5e' : '#6a89cc');  // Darker blue for particles in light mode
                        material.opacity = isLightMode ? 0.9 : 0.6;  // More opaque in light mode
                        material.needsUpdate = true;
                    }
                    break;
            }
        });
        
        // Update lights
        this.lights.forEach(light => {
            if (!light) return;
            
            if (light.isAmbientLight) {
                light.intensity = isLightMode ? 0.8 : 0.5;
            } else if (light.isDirectionalLight) {
                light.intensity = isLightMode ? 1.2 : 0.8;
            } else if (light.isPointLight) {
                light.intensity = isLightMode ? 2 : 1;
                light.distance = isLightMode ? 30 : 50;
            }
        });
    }
    
    addLights() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Ambient light - brighter in light mode
        const ambientIntensity = isLightMode ? 0.8 : 0.5;
        const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Directional light - stronger in light mode
        const dirLightIntensity = isLightMode ? 1.2 : 0.8;
        const directionalLight = new THREE.DirectionalLight(0xffffff, dirLightIntensity);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // Point lights for glow effect - more intense in light mode
        const pointLight1 = new THREE.PointLight(
            isLightMode ? 0x1d0c46 : 0x4a69bd, 
            isLightMode ? 2 : 1, 
            isLightMode ? 30 : 50
        );
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        this.lights.push(pointLight1);
        
        const pointLight2 = new THREE.PointLight(
            isLightMode ? 0x4a69bd : 0x6a89cc, 
            isLightMode ? 1.5 : 1, 
            isLightMode ? 40 : 50
        );
        pointLight2.position.set(-5, -5, -5);
        this.scene.add(pointLight2);
        this.lights.push(pointLight2);
    }
    
    createBlockchain() {
        const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
        const blockCount = 15;
        const radius = 8;
        
        // Create blocks in a circular formation
        for (let i = 0; i < blockCount; i++) {
            const angle = (i / blockCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 4;
            
            this.createBlock(x, y, z, i);
        }
        
        // Create web connections
        this.createWebConnections();
    }
    
    createBlock(x, y, z, index) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Check if we're in light mode
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        const material = new THREE.MeshPhongMaterial({
            name: 'blockMaterial',
            color: isLightMode ? 0x1d0c46 : 0x4a69bd, // Use brand color in light mode
            transparent: true,
            opacity: isLightMode ? 0.95 : 0.9,
            shininess: 150,
            emissive: isLightMode ? 0x4a69bd : 0x1e3799, // Brighter emissive in light mode
            emissiveIntensity: isLightMode ? 0.5 : 0.3,
            specular: isLightMode ? 0xffffff : 0x111111,
            flatShading: true
        });
        
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x, y, z);
        block.userData = { index, originalY: y, isLightMode };
        
        // Add blockchain-like details with better visibility in light mode
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeColor = isLightMode ? 0x4a69bd : 0xffffff;
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: edgeColor, 
            transparent: true, 
            opacity: isLightMode ? 0.8 : 0.5,
            linewidth: isLightMode ? 2 : 1
        });
        const line = new THREE.LineSegments(edges, lineMaterial);
        block.add(line);
        
        // Store materials for theme updates
        this.materials.push(material);
        this.materials.push(lineMaterial);
        
        this.scene.add(block);
        this.blocks.push(block);
        
        // Add data particles inside the block
        this.addDataParticles(block);
    }
    
    addDataParticles(block) {
        const particleCount = 30;
        const particles = new THREE.Group();
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.03 + Math.random() * 0.02;
            const geometry = new THREE.SphereGeometry(size, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                name: 'particleMaterial',
                color: isLightMode ? 0x4a69bd : 0x6a89cc,
                transparent: true,
                opacity: isLightMode ? 0.8 : 0.6,
                blending: THREE.AdditiveBlending
            });
            
            // Store material reference for theme updates
            this.materials.push(material);
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Position particles randomly within the block
            particle.position.x = (Math.random() - 0.5) * 0.8;
            particle.position.y = (Math.random() - 0.5) * 0.8;
            particle.position.z = (Math.random() - 0.5) * 0.8;
            
            // Add some movement properties
            particle.userData = {
                speed: Math.random() * 0.01 + 0.005,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize()
            };
            
            particles.add(particle);
        }
        
        block.add(particles);
        block.userData.particles = particles;
    }
    
    createWebConnections() {
        // Create connections between blocks
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = i + 1; j < this.blocks.length; j++) {
                // Only connect some blocks to create a web-like structure
                if (Math.random() > 0.7) {
                    this.createConnection(this.blocks[i], this.blocks[j]);
                }
            }
        }
    }
    
    createConnection(block1, block2) {
        const start = block1.position.clone();
        const end = block2.position.clone();
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Create a curve for the connection
        const curve = new THREE.QuadraticBezierCurve3(
            start,
            new THREE.Vector3(
                (start.x + end.x) / 2 + (Math.random() - 0.5) * 3,
                (start.y + end.y) / 2 + (Math.random() - 0.5) * 3,
                (start.z + end.z) / 2 + (Math.random() - 0.5) * 3
            ),
            end
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create a material with better visibility in light mode
        const material = new THREE.LineBasicMaterial({
            name: 'connectionMaterial',
            color: isLightMode ? 0x4a69bd : 0x6a89cc,
            transparent: true,
            opacity: isLightMode ? 0.5 : 0.3,
            linewidth: isLightMode ? 2 : 1
        });
        
        // Store material reference for theme updates
        this.materials.push(material);
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        this.connections.push({
            line,
            originalGeometry: geometry,
            time: Math.random() * Math.PI * 2
        });
        
        // Add pulsing particles along the connection
        this.addConnectionParticles(curve);
    }
    
    addConnectionParticles(curve) {
        const particleCount = 5;
        const particleGroup = new THREE.Group();
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                name: 'connectionParticleMaterial',
                color: isLightMode ? 0xffffff : 0x9b59b6,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });
            
            // Store material reference for theme updates
            this.materials.push(material);
            
            const particle = new THREE.Mesh(geometry, material);
            particle.userData = {
                progress: Math.random(),
                speed: 0.001 + Math.random() * 0.001,
                direction: Math.random() > 0.5 ? 1 : -1
            };
            
            particleGroup.add(particle);
        }
        
        this.scene.add(particleGroup);
        this.connections[this.connections.length - 1].particles = particleGroup;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update controls for smooth camera movement
        this.controls.update();
        
        // Animate blocks
        this.blocks.forEach((block, index) => {
            // Gentle floating animation
            block.position.y = block.userData.originalY + Math.sin(time * 0.5 + index) * 0.2;
            
            // Rotate blocks slightly
            block.rotation.x += 0.002;
            block.rotation.y += 0.003;
            
            // Animate particles inside blocks
            if (block.userData.particles) {
                block.userData.particles.children.forEach(particle => {
                    // Move particle
                    particle.position.add(
                        particle.userData.direction.clone().multiplyScalar(particle.userData.speed)
                    );
                    
                    // Bounce particles off the edges of the block
                    if (Math.abs(particle.position.x) > 0.4 || 
                        Math.abs(particle.position.y) > 0.4 || 
                        Math.abs(particle.position.z) > 0.4) {
                        // Reverse direction when hitting the edge
                        particle.userData.direction.negate();
                        // Add some randomness to the bounce
                        particle.userData.direction.add(
                            new THREE.Vector3(
                                (Math.random() - 0.5) * 0.5,
                                (Math.random() - 0.5) * 0.5,
                                (Math.random() - 0.5) * 0.5
                            )
                        ).normalize();
                    }
                });
            }
        });
        
        // Animate connections
        this.connections.forEach(connection => {
            connection.time += delta * 0.5;
            
            // Update connection line
            const points = connection.originalGeometry.attributes.position.array;
            for (let i = 0; i < points.length; i += 3) {
                // Add subtle wave effect to the connection line
                const offset = (i / points.length) * Math.PI * 2 + connection.time;
                points[i + 1] += Math.sin(offset) * 0.03;
            }
            connection.originalGeometry.attributes.position.needsUpdate = true;
            
            // Animate connection particles
            if (connection.particles) {
                connection.particles.children.forEach((particle, i) => {
                    particle.userData.progress += particle.userData.speed * particle.userData.direction;
                    
                    // Reverse direction at ends
                    if (particle.userData.progress > 1) {
                        particle.userData.progress = 1;
                        particle.userData.direction *= -1;
                    } else if (particle.userData.progress < 0) {
                        particle.userData.progress = 0;
                        particle.userData.direction *= -1;
                    }
                    
                    // Position particle along the curve
                    const point = connection.originalGeometry.attributes.position.getX(
                        Math.floor(particle.userData.progress * (points.length / 3 - 1)) * 3
                    );
                    const y = connection.originalGeometry.attributes.position.getY(
                        Math.floor(particle.userData.progress * (points.length / 3 - 1)) * 3 + 1
                    );
                    const z = connection.originalGeometry.attributes.position.getZ(
                        Math.floor(particle.userData.progress * (points.length / 3 - 1)) * 3 + 2
                    );
                    
                    particle.position.set(point, y, z);
                    
                    // Fade in/out based on position
                    particle.material.opacity = Math.sin(particle.userData.progress * Math.PI) * 0.7;
                });
            }
        });
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize the visualization when the page loads
window.addEventListener('load', () => {
    const visualization = new BlockchainVisualization();
});
