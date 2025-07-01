// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

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

// Smart Navbar behavior on scroll
let lastScrollTop = 0;
let scrollDirection = 'up';
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const currentScrollTop = window.scrollY;
    
    // Determine scroll direction
    if (currentScrollTop > lastScrollTop) {
        scrollDirection = 'down';
    } else if (currentScrollTop < lastScrollTop) {
        scrollDirection = 'up';
    }
    
    // Determine if we're at the very top (small threshold for immediate disappearance)
    const scrollThreshold = 50; // Small threshold for immediate response
    const isAtTop = currentScrollTop <= scrollThreshold;
    
    // Apply navbar behavior based on position and scroll direction
    if (isAtTop) {
        // At the very top - show pinned navbar
        navbar.classList.remove('floating', 'hidden');
    } else {
        // Past threshold - use floating navbar with show/hide behavior
        navbar.classList.add('floating');
        
        if (scrollDirection === 'down') {
            // Scrolling down - hide navbar
            navbar.classList.add('hidden');
        } else if (scrollDirection === 'up') {
            // Scrolling up - show floating navbar
            navbar.classList.remove('hidden');
        }
    }
    
    lastScrollTop = currentScrollTop;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Initialize navbar state on page load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure navbar starts in the correct state
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Remove any existing classes to start fresh
        navbar.classList.remove('floating', 'hidden');
        // Force initial state update
        updateNavbar();
    }
});

// Hero section animation
gsap.from(".about-hero-title", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power3.out"
});

gsap.from(".about-hero-subtitle", {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.3,
    ease: "power3.out"
});

// Mission section animations
gsap.from(".mission-text", {
    scrollTrigger: {
        trigger: ".mission-section",
        start: "top 80%"
    },
    duration: 1,
    x: -50,
    opacity: 0,
    ease: "power3.out"
});

gsap.from(".mission-visual", {
    scrollTrigger: {
        trigger: ".mission-section",
        start: "top 80%"
    },
    duration: 1,
    x: 50,
    opacity: 0,
    delay: 0.3,
    ease: "power3.out"
});

// Founder cards animation
gsap.from(".founder-card", {
    scrollTrigger: {
        trigger: ".team-section",
        start: "top 80%"
    },
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.3,
    ease: "power3.out"
});

// Contact cards animation
gsap.from(".contact-card", {
    scrollTrigger: {
        trigger: ".join-us-section",
        start: "top 80%"
    },
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
}); 