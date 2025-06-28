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

    gsap.set(solutionSection, { opacity: 0 });
    gsap.set(problemSection, { opacity: 1 });

    let dataFlowInterval;
    let insightCardInterval;

    const masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: visualSection,
            start: 'top top',
            end: '+=3000', // Adjusted scroll duration
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            onEnter: () => {
                if (statsInterval) clearInterval(statsInterval);
                if (!dataFlowInterval) dataFlowInterval = setInterval(createDataArray, 300);
                if (!insightCardInterval) insightCardInterval = setInterval(createInsightCard, 3000);
            },
            onLeave: () => {
                clearInterval(dataFlowInterval);
                clearInterval(insightCardInterval);
                dataFlowInterval = null;
                insightCardInterval = null;
            },
            onEnterBack: () => {
                if (statsInterval) clearInterval(statsInterval);
                if (!dataFlowInterval) dataFlowInterval = setInterval(createDataArray, 300);
                if (!insightCardInterval) insightCardInterval = setInterval(createInsightCard, 3000);
            },
            onLeaveBack: () => {
                clearInterval(dataFlowInterval);
                clearInterval(insightCardInterval);
                dataFlowInterval = null;
                insightCardInterval = null;
                initProblemStatsCarousel();
            },
            onUpdate: (self) => {
                const progress = self.progress;
                if (progress > 0.2 && !cubeContainer.classList.contains('cube-assembled')) {
                    cubeContainer.classList.add('cube-assembled');
                } else if (progress <= 0.2 && cubeContainer.classList.contains('cube-assembled')) {
                    cubeContainer.classList.remove('cube-assembled');
                }
            }
        }
    });

    // 1. Fade out problem stats and assemble cube
    masterTimeline
        .to('.problem-stats-container', {
            opacity: 0,
            scale: 0.8,
            duration: 2,
            ease: 'power2.in'
        }, "start")
        .add(gsap.to('.cube-face', {
            x: 0, y: 0, scale: 1, rotationZ: 0,
            duration: 4,
            stagger: 0.1,
            ease: 'power3.inOut'
        }), "start")
    
    // 2. Fade in solution section and new title
        .to(solutionSection, { opacity: 1, duration: 1 }, "start+=2.5")
        .to('.solution-text-top-left', { opacity: 1, duration: 1.5, ease: 'power2.out' }, "start+=2.8")
        .to('.solution-text-bottom-right', { opacity: 1, duration: 1.5, ease: 'power2.out' }, "start+=3.1");

    // --- Continuous Data Flow Functions ---
    const dataContainer = document.getElementById('data-arrays-container');
    const createDataArray = () => {
        if (!cubeContainer) return;
        const cubeRect = cubeContainer.getBoundingClientRect();
        if (cubeRect.width === 0) return; // Don't run if not visible

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
        switch (type) {
            case 'line':
                const points = Array.from({length: 7}, (_, i) => `${i * 50},${60 - Math.random() * 40}`).join(' ');
                return `<svg viewBox="0 0 320 60"><defs><linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#caa968;stop-opacity:0.5"/><stop offset="100%" style="stop-color:#caa968;stop-opacity:0"/></linearGradient></defs><polygon class="area" points="0,60 ${points} 320,60"/><polyline class="line" points="${points}"/></svg>`;
            case 'pie':
                const r = () => Math.random() * 360;
                let a=r(), b=r(), c=r();
                return `<div class="pie-chart" style="background: conic-gradient(#1d0c46 ${a}deg, #caa968 0 ${b}deg, #888 0 ${c}deg);"></div>`;
            case 'geo':
                const pointsHTML = Array.from({length: 3}, () => `<circle class="geo-point" cx="${10 + Math.random() * 80}%" cy="${20 + Math.random() * 60}%" r="3" />`).join('');
                return `<svg viewBox="0 0 100 50"><path d="M49,1 C27,1 11,9 1,24 C11,39 27,48 49,48 C71,48 87,39 99,24 C87,9 71,1 49,1 Z" /></svg>${pointsHTML}`;
            case 'retention':
                let cellsHTML = '';
                for (let i = 0; i < 40; i++) {
                    cellsHTML += `<div class="cell" style="opacity: ${Math.max(0.1, (1 - (i % 8) / 8) * Math.random())}"></div>`;
                }
                return `<div class="retention-grid">${cellsHTML}</div>`;
            case 'scatter':
                 let dotsHTML = '';
                for (let i = 0; i < 15; i++) {
                    const highlight = Math.random() > 0.8 ? 'highlight' : '';
                    dotsHTML += `<div class="dot ${highlight}" style="left: ${10 + Math.random() * 80}%; top: ${10 + Math.random() * 80}%"></div>`;
                }
                return `<div class="scatter-plot">${dotsHTML}</div>`;
            case 'bar':
            default:
                let barHTML = '';
                for(let i = 0; i < 10; i++) { barHTML += `<div class="bar" style="height: ${Math.random() * 80 + 20}%"></div>`; }
                return barHTML;
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