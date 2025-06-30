// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
}));

// Custom Cursor for Hero Section
const heroCursor = document.querySelector('.hero-cursor');
const heroSection = document.querySelector('.hero');

if (heroCursor && heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        heroCursor.style.left = e.clientX + 'px';
        heroCursor.style.top = e.clientY + 'px';
        heroCursor.style.opacity = '1';
    });
    
    heroSection.addEventListener('mouseleave', () => {
        heroCursor.style.opacity = '0';
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar visibility and background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;
    
    if (window.scrollY > scrollThreshold) {
        navbar.classList.add('visible');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        }
    } else {
        navbar.classList.remove('visible');
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card, .section-title').forEach(el => {
    observer.observe(el);
});

// Newsletter form handling
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (email) {
            alert('Thank you for subscribing! We\'ll keep you updated with marketing tips.');
            e.target.querySelector('input[type="email"]').value = '';
        }
    });
}

// --- REVISED ANIMATION LOGIC ---

let statsInterval;

const problemStats = [
    { number: "$12B", description: "spent on Web3 marketing, yet most projects can't track if off-chain leads convert to on-chain actions." },
    { number: "70%", description: "of marketing efficiency is lost because teams cannot connect leads to on-chain conversions." }
];
let currentStatIndex = 0;

function initProblemStatsCarousel() {
    const numberEl = document.querySelector('.stat-number');
    const descriptionEl = document.querySelector('.stat-description');
    const cubeEl = document.querySelector('.blockchain-cube');

    if (!numberEl || !descriptionEl || !cubeEl) return;

    const updateStat = () => {
        currentStatIndex = (currentStatIndex + 1) % problemStats.length;
        
        gsap.timeline()
            .to([numberEl, descriptionEl], {
                opacity: 0,
                y: -10,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    numberEl.textContent = problemStats[currentStatIndex].number;
                    descriptionEl.textContent = problemStats[currentStatIndex].description;
                }
            })
            .to([numberEl, descriptionEl], {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });

        gsap.to(cubeEl, {
            rotationY: `+=${20 + Math.random() * 20}`,
            rotationX: `+=${10 + Math.random() * 10}`,
            duration: 1.5,
            ease: 'power3.inOut'
        });
    };

    numberEl.textContent = problemStats[0].number;
    descriptionEl.textContent = problemStats[0].description;
    gsap.set([numberEl, descriptionEl], { opacity: 1 });

    if (statsInterval) clearInterval(statsInterval);
    statsInterval = setInterval(updateStat, 3000);
}

function initBlockchainCubeAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const visualSection = document.querySelector('.blockchain-visual-section');
    const cubeContainer = document.querySelector('.blockchain-cube-container');
    const problemSection = document.querySelector('.problem-section');
    const solutionSection = document.querySelector('.solution-section');

    if (!visualSection || !cubeContainer || !problemSection || !solutionSection) return;

    // Initialize states
    gsap.set(solutionSection, { opacity: 0 });
    gsap.set(problemSection, { opacity: 1 });
    gsap.set(['.solution-text-top-left', '.solution-text-bottom-right'], { opacity: 0 });

    let dataFlowInterval;
    let insightCardInterval;

    const masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: visualSection,
            start: 'top top',
            end: '+=3000',
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => {
                const solutionIsVisible = self.progress > 0.6; 
                if (solutionIsVisible) {
                    if (!dataFlowInterval) dataFlowInterval = setInterval(createDataArray, 300);
                    if (!insightCardInterval) insightCardInterval = setInterval(createInsightCard, 3000);
                } else {
                    clearInterval(dataFlowInterval);
                    clearInterval(insightCardInterval);
                    dataFlowInterval = null;
                    insightCardInterval = null;
                }
            },
            onEnter: () => {
                if (statsInterval) clearInterval(statsInterval);
                gsap.killTweensOf('.blockchain-cube'); 
            },
            onLeaveBack: () => {
                clearInterval(dataFlowInterval);
                clearInterval(insightCardInterval);
                dataFlowInterval = null;
                insightCardInterval = null;
                initProblemStatsCarousel();
            }
        }
    });

    masterTimeline
        .to('.problem-stats-container', {
            opacity: 0,
            scale: 0.8,
            duration: 2.5,
            ease: 'power2.in'
        }, "start")
        .to('.cube-face', {
            x: 0, y: 0, scale: 1, rotationZ: 0,
            duration: 4,
            stagger: 0.1,
            ease: 'power3.inOut'
        }, "start")
        .to(solutionSection, {
            opacity: 1,
            duration: 3,
            ease: 'power2.inOut'
        }, "start+=1")
        .to(['.solution-text-top-left', '.solution-text-bottom-right'], {
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            stagger: 0.3
        }, "start+=2")
        .call(() => {
            cubeContainer.classList.remove('cube-assembled');
        }, [], "start+=3.9")
        .call(() => {
            cubeContainer.classList.add('cube-assembled');
        }, [], "start+=4");

    const dataContainer = document.getElementById('data-arrays-container');
    const createDataArray = () => {
        if (!cubeContainer) return;
        const cubeRect = cubeContainer.getBoundingClientRect();
        if (cubeRect.width === 0) return;

        const arrayEl = document.createElement('div');
        arrayEl.className = 'data-array';
        arrayEl.textContent = `0x${Math.random().toString(16).substr(2, 10)}`;
        dataContainer.appendChild(arrayEl);

        gsap.fromTo(arrayEl, 
            { x: -300, y: window.innerHeight / 2 + (Math.random() - 0.5) * 400, opacity: 0 },
            {
                x: cubeRect.left - 150,
                opacity: 1,
                duration: 1.5 + Math.random() * 1.5,
                ease: 'power1.in',
                onComplete: () => {
                    gsap.to(arrayEl, { opacity: 0, duration: 0.3, onComplete: () => arrayEl.remove() });
                }
            }
        );
    };
    
    // --- Insight Card Generation ---
    const insightDataPool = [
        { title: 'User Growth', text: 'Daily Active Users have increased by <span class="highlight">15% week-over-week</span>.', kpi1: 'DAU', val1: '1.8M', kpi2: 'Source', val2: 'Organic', graphType: 'line' },
        { title: 'Campaign Conversion', text: `The <span class="highlight">NFT Drop</span> campaign led to 300 new mints from off-chain leads.`, kpi1: 'Cost/Mint', val1: '$12.50', kpi2: 'Value', val2: '$30,000', graphType: 'bar' },
        { title: 'Geographic Distribution', text: 'New sign-ups are emerging from <span class="highlight">Southeast Asia</span>.', kpi1: 'Top Country', val1: 'Vietnam', kpi2: 'Growth', val2: '+40%', graphType: 'geo' },
        { title: 'Token Holder Stats', text: 'Wallet distribution shows a healthy balance between whales and retail.', kpi1: 'Whales (>1M)', val1: '5%', kpi2: 'Retail (<1k)', val2: '60%', graphType: 'pie' },
        { title: 'User Retention', text: 'Week 1 retention for the new cohort is at <span class="highlight">35%</span>.', kpi1: 'W1', val1: '35%', kpi2: 'W4', val2: '15%', graphType: 'retention' },
        { title: 'Transaction Analysis', text: 'A cluster of high-value, low-frequency transactions has been identified.', kpi1: 'Avg. Size', val1: '$1,500', kpi2: 'Count', val2: '1,200', graphType: 'scatter' }
    ];
    let dataIndex = 0;

    const generateGraphHTML = (type) => {
        // --- IMPROVED GRAPH GENERATORS ---
        switch (type) {
            case 'line': {
                let lastY = 35 + (Math.random() - 0.5) * 10;
                const points = Array.from({length: 10}, (_, i) => {
                    lastY += (Math.random() - 0.5) * 8;
                    lastY = Math.max(10, Math.min(50, lastY));
                    return `${i * 35},${lastY}`;
                }).join(' ');
                return `<svg viewBox="0 0 320 60" class="chart-svg"><defs><linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#1d0c46;stop-opacity:0.4"/><stop offset="100%" style="stop-color:#1d0c46;stop-opacity:0"/></linearGradient></defs><polygon class="area" points="0,60 ${points} 315,60"/><polyline class="line" points="${points}"/></svg>`;
            }
            case 'pie': {
                const p1 = 45; const p2 = 30;
                const end1 = p1; const end2 = p1 + p2;
                return `<div class="pie-chart" style="background: conic-gradient(#1d0c46 ${end1}%, #caa968 0 ${end2}%, #cccccc 0 100%);"></div>`;
            }
            case 'geo': {
                const worldPath = "M178.6,83.1l-2.8-1.4l-1.9-3.2l-3.2-2.1c0,0-0.2-1.4-0.4-1.9c-0.2-0.5-0.2-0.8-0.2-0.8l-1.9-2.8l-3.2-1.9l-1-0.2l-3.2-2.1l0.2-2.2l-2.1-3l-2.1-1.2l-2.4-0.6l-2.2-2.8l-0.8-2.6l-2.1-1.9l-1.9-3.2l-3.7-2.6l-3.2-1.4l-3-2.6l-1.4-2.4l-3-3.2l-1.2-3.2l0-2.8l1.4-3l-0.5-3.5l-2.1-2.4l-3,0l-2.2-1.9l-2.2,0.5l-2.1,2.4l-3.2,1.9l-3.5-0.2l-2.6,1.2l-3.2,0.5l-2.8-1.2l-2.6-1.9l-3.5-0.8l-2.6,0.5l-3.2-0.8l-3-1.9l-3.2,0.8l-2.4-0.5l-3.2-1.4l-3.2,0.5l-3,2.2l-3.2-0.8l-2.1,0.8l-2.6-1.4l-3,0.5l-3.2-1.4l-2.6,1.4l-1.7,3.5l-1,1.4l-1.7,1.2l-0.8,2.4l0.2,2.1l-1.2,1.7l-0.5,2.6l-1.9,1.9l-1,2.1l-1.2,1.9l-0.8,2.6l-1.4,1.4l-0.8,2.1l0.2,2.4l1.4,1.9l-0.2,2.2l-1.4,1.9l-0.5,2.6l0.8,1.9l0.8,2.8l0.2,3.5l1.4,1.4l1.4,2.2l-0.2,2.4l0.5,2.1l1.2,1.9l0.8,2.1l1.9,1.4l2.6,1.9l1,2.2l1.9,1.4l2.4,1.9l1.4,2.2l1.9,1.2l2.6,1.9l2.4,1l2.8,1.4l3.2,1l2.4,1.4l3.2,0.8l3.2,1.2l2.6,0.8l3.2,0.5l3.2,0.8l2.8-0.2l3,1.2l3.2-0.5l2.6,0.5l3.2-0.5l3.2,0.5l2.6,0.2l3.2-0.5l2.8,0.2l3.2,0.8l2.8-0.5l3,0.5l6,1.2l3-0.2l3,1.2L178.6,83.1z";
                const locations = [{cx: "60", cy: "35"}, {cx: "115", cy: "30"}, {cx: "155", cy: "50"}];
                const pointsHTML = locations.map(loc => `<circle class="geo-point" cx="${loc.cx}" cy="${loc.cy}" r="2" />`).join('');
                return `<svg viewBox="30 10 160 80"><path class="land" d="${worldPath}" /></svg>${pointsHTML}`;
            }
            case 'retention': {
                let cellsHTML = '';
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 8; col++) {
                        if (col > (4 - row) + 3) continue;
                        const baseOpacity = (col === 0) ? 0.9 : 0.7 - (col / 12);
                        const noise = (Math.random() - 0.5) * 0.15;
                        const finalOpacity = Math.max(0.1, Math.min(1, baseOpacity + noise));
                        cellsHTML += `<div class="cell" style="background-color: #1d0c46; opacity: ${finalOpacity};"></div>`;
                    }
                }
                return `<div class="retention-grid">${cellsHTML}</div>`;
            }
            case 'scatter': {
                 let dotsHTML = '';
                for (let i = 0; i < 20; i++) {
                    let x = 10 + Math.random() * 80;
                    let y = x - 15 + (Math.random() * 30);
                    if (Math.random() > 0.9) { y = 10 + Math.random() * 80; }
                    x = Math.max(5, Math.min(95, x)); y = Math.max(5, Math.min(95, y));
                    dotsHTML += `<div class="dot" style="left: ${x}%; top: ${y}%"></div>`;
                }
                return `<div class="scatter-plot">${dotsHTML}</div>`;
            }
            case 'bar':
            default: {
                let barHTML = '';
                for(let i = 0; i < 10; i++) { barHTML += `<div class="bar" style="height: ${Math.random() * 80 + 20}%"></div>`; }
                return barHTML;
            }
        }
    }
    
    const cardsContainer = document.getElementById('insight-cards-container');
    const createInsightCard = () => {
        const cubeRect = cubeContainer.getBoundingClientRect();
        if (cubeRect.width === 0) return;
        
        const data = insightDataPool[dataIndex % insightDataPool.length];
        dataIndex++;

        const cardEl = document.createElement('div');
        cardEl.className = 'insight-card-detailed';
        
        const graphHTML = generateGraphHTML(data.graphType);

        cardEl.innerHTML = `
            <div class="card-header">
                <span class="card-title">${data.title}</span>
                <span class="card-timestamp">Just now</span>
            </div>
            <div class="card-body">
                <p class="card-text-data">${data.text}</p>
                <div class="mini-graph" data-graph-type="${data.graphType}">${graphHTML}</div>
                <div class="card-kpi-row">
                    <div class="kpi-item">
                        <span class="kpi-label">${data.kpi1}</span>
                        <span class="kpi-value">${data.val1}</span>
                    </div>
                     <div class="kpi-item">
                        <span class="kpi-label">${data.kpi2}</span>
                        <span class="kpi-value">${data.val2}</span>
                    </div>
                </div>
            </div>
        `;
        
        cardsContainer.appendChild(cardEl);
        
        const randomYDrift = (Math.random() - 0.5) * 200;
        const cardWidth = 350;

        const cardTimeline = gsap.timeline({
            onComplete: () => {
                cardEl.remove();
            }
        });

        cardTimeline.fromTo(cardEl, {
            left: cubeRect.left + (cubeRect.width / 2) - (cardWidth / 2),
            top: cubeRect.top + (cubeRect.height / 2) - 100,
            opacity: 0,
            scale: 0.2,
            x: 0
        }, {
            x: 50,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        }).to(cardEl, {
            x: window.innerWidth - cubeRect.left,
            y: randomYDrift,
            opacity: 0,
            scale: 0.7,
            duration: 3.5,
            ease: 'power1.inOut'
        }, '+=0.2');
    };
}


document.addEventListener('DOMContentLoaded', () => {
    initProblemStatsCarousel();
    initBlockchainCubeAnimation();
});

// Mobile hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Mobile touch improvements
    if ('ontouchstart' in window) {
        // Add touch class for mobile-specific styles
        document.body.classList.add('touch-device');
        
        // Improve scroll performance on mobile
        let ticking = false;
        
        function updateScrollPosition() {
            // Your scroll-based animations here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Prevent zoom on double tap for buttons
        const buttons = document.querySelectorAll('.hero-btn, .cta-btn-primary, .cta-btn-secondary, .newsletter-btn');
        buttons.forEach(button => {
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            });
        });
    }
    
    // Viewport height fix for mobile browsers
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Smooth scrolling for anchor links on mobile
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Smooth scroll to target
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Optimize images for mobile
    if (window.innerWidth <= 768) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Optimize image sizes for mobile
            if (img.src.includes('feature') || img.src.includes('testimonial')) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }
    
    // Mobile-specific feature tracker improvements
    const trackerNodes = document.querySelectorAll('.tracker-node');
    trackerNodes.forEach((node, index) => {
        node.addEventListener('click', function() {
            // Remove active class from all nodes
            trackerNodes.forEach(n => n.classList.remove('active'));
            
            // Add active class to clicked node
            this.classList.add('active');
            
            // Scroll to corresponding feature section
            const featureId = this.getAttribute('data-feature');
            const targetSection = document.getElementById(`feature-${featureId}`);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile testimonial swipe improvements
    const testimonialTrack = document.querySelector('.testimonial-track');
    if (testimonialTrack && 'ontouchstart' in window) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        testimonialTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.style.transition = 'none';
        }, { passive: true });
        
        testimonialTrack.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            // Add some resistance to the swipe
            const resistance = 0.5;
            this.style.transform = `translateX(${deltaX * resistance}px)`;
        }, { passive: true });
        
        testimonialTrack.addEventListener('touchend', function() {
            if (!isDragging) return;
            
            isDragging = false;
            this.style.transition = '';
            this.style.transform = '';
            
            const deltaX = currentX - startX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                // Trigger testimonial navigation based on swipe direction
                if (deltaX > 0) {
                    // Swipe right - previous testimonial
                    console.log('Previous testimonial');
                } else {
                    // Swipe left - next testimonial
                    console.log('Next testimonial');
                }
            }
        });
    }
    
    // Intersection Observer for mobile animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for mobile animations
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .metric-card, .contact-card, .founder-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Mobile-specific performance optimizations
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        const complexAnimations = document.querySelectorAll('.floating-element, .hero-canvas');
        complexAnimations.forEach(el => {
            el.style.display = 'none';
        });
        
        // Optimize scroll listeners for mobile
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Debounced scroll handler for mobile
                const scrollTop = window.pageYOffset;
                
                // Update navbar visibility
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    if (scrollTop > 100) {
                        navbar.classList.add('visible');
                    } else {
                        navbar.classList.remove('visible');
                    }
                }
            }, 10);
        }, { passive: true });
    }
});

// Mobile-specific CSS custom properties
if (window.innerWidth <= 768) {
    document.documentElement.style.setProperty('--mobile-padding', '15px');
    document.documentElement.style.setProperty('--mobile-font-size', '14px');
    document.documentElement.style.setProperty('--mobile-line-height', '1.5');
} else {
    document.documentElement.style.setProperty('--mobile-padding', '20px');
    document.documentElement.style.setProperty('--mobile-font-size', '16px');
    document.documentElement.style.setProperty('--mobile-line-height', '1.6');
}