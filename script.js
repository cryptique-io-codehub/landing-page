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
    
    // Floating elements removed - Intelligence Prism handles interactions
}

// Tooltip functionality
let activeTooltip = null;

function showTooltip(text, element) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 40) + 'px';
    
    document.body.appendChild(tooltip);
    activeTooltip = tooltip;
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
}

function hideTooltip() {
    if (activeTooltip) {
        activeTooltip.style.opacity = '0';
        activeTooltip.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            if (activeTooltip && activeTooltip.parentNode) {
                activeTooltip.parentNode.removeChild(activeTooltip);
            }
            activeTooltip = null;
        }, 200);
    }
}

// Ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
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

// Observe elements for animation
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
            // Here you would typically send the email to your backend
            alert('Thank you for subscribing! We\'ll keep you updated with marketing tips.');
            e.target.querySelector('input[type="email"]').value = '';
        }
    });
}

// CTA button handlers
document.querySelectorAll('.cta-btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirect to booking demo page
        alert('Redirecting to demo booking page...');
        // window.location.href = 'https://your-demo-booking-link.com';
    });
});

document.querySelectorAll('.cta-btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirect to get started page
        alert('Redirecting to get started page...');
        // window.location.href = 'https://your-get-started-link.com';
    });
});

// Feature card interactions
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const interactiveElement = card.querySelector('.interactive-element');
        if (interactiveElement) {
            interactiveElement.style.animationPlayState = 'running';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const interactiveElement = card.querySelector('.interactive-element');
        if (interactiveElement) {
            interactiveElement.style.animationPlayState = 'paused';
        }
    });
});

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    const animations = document.querySelectorAll('.logo-track, .testimonial-track, .floating-element, .hero-bg-animation');
    
    animations.forEach(element => {
        if (document.hidden) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Particle system removed - Intelligence Prism is the main visual focus

// 3D Tilt Effect for Cards
function add3DTiltEffect() {
    document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Magnetic effect for buttons
function addMagneticEffect() {
    document.querySelectorAll('.learn-more-btn, .cta-btn-primary, .cta-btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Text scramble effect
function scrambleText(element, finalText) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iterations = 0;
    const speed = 30;
    
    const interval = setInterval(() => {
        element.textContent = finalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
            
        if (iterations >= finalText.length) {
            clearInterval(interval);
        }
        
        iterations += 1 / 3;
    }, speed);
}

// Intelligence Prism Interactive Features
function initializeIntelligencePrism() {
    const sourceIcons = document.querySelectorAll('.source-icon');
    const prism = document.querySelector('.cryptique-prism');
    const uiElements = document.querySelectorAll('.ui-element');
    
    // Add hover effects to source icons
    sourceIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
            icon.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
            
            // Trigger beam animation
            const beam = icon.querySelector('.light-beam');
            if (beam) {
                beam.style.animationPlayState = 'running';
                beam.style.opacity = '1';
            }
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = 'none';
        });
        
        // Add click effect
        icon.addEventListener('click', () => {
            createSourceRipple(icon);
            triggerPrismPulse();
        });
    });
    
    // Add prism interaction
    if (prism) {
        prism.addEventListener('mouseenter', () => {
            prism.style.filter = 'drop-shadow(0 0 30px rgba(29, 12, 70, 0.5)) brightness(1.3)';
        });
        
        prism.addEventListener('mouseleave', () => {
            prism.style.filter = 'drop-shadow(0 0 20px rgba(29, 12, 70, 0.3)) brightness(1.2)';
        });
        
        prism.addEventListener('click', () => {
            triggerPrismExplosion();
        });
    }
    
    // Add UI element interactions
    uiElements.forEach((element, index) => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateX(0) rotateY(0deg) scale(1.05)';
            element.style.boxShadow = '0 10px 30px rgba(29, 12, 70, 0.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateX(0) rotateY(0deg) scale(1)';
            element.style.boxShadow = 'none';
        });
    });
    
    // Add typing effect to insight card
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const originalText = typingText.textContent;
        
        setInterval(() => {
            typingText.textContent = '';
            typeWriter(typingText, originalText, 0);
        }, 12000); // Sync with animation loop
    }
}

// Create ripple effect for source icons
function createSourceRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '-50%';
    ripple.style.top = '-50%';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Trigger prism pulse effect
function triggerPrismPulse() {
    const prismCore = document.querySelector('.prism-light-core');
    if (prismCore) {
        prismCore.style.animation = 'none';
        setTimeout(() => {
            prismCore.style.animation = 'core-pulse 1s ease-out';
        }, 10);
    }
}

// Trigger prism explosion effect
function triggerPrismExplosion() {
    const reflections = document.querySelectorAll('.reflection');
    reflections.forEach((reflection, index) => {
        reflection.style.animation = 'none';
        setTimeout(() => {
            reflection.style.animation = `reflection-${index + 1} 2s ease-out`;
        }, index * 100);
    });
}

// Typewriter effect for insight text
function typeWriter(element, text, index) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1), 50);
    }
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Hero section focuses on Intelligence Prism animation
    
    // Initialize Intelligence Prism
    initializeIntelligencePrism();
    
    // Add 3D effects
    add3DTiltEffect();
    addMagneticEffect();
    
    // Animate hero title with scramble effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const spans = heroTitle.querySelectorAll('.gradient-text');
        spans.forEach((span, index) => {
            const originalText = span.textContent;
            span.textContent = '';
            
            setTimeout(() => {
                scrambleText(span, originalText);
            }, index * 200);
        });
    }
    
    // Staggered animation for feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + index * 150);
    });
});

// Add CSS for mobile menu animation
const style = document.createElement('style');
style.textContent = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 0 0 20px 20px;
        padding: 20px;
        gap: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .navbar.scrolled .nav-container {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(0, 0, 0, 0.1);
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body.loaded * {
        animation-play-state: running;
    }
    
    .custom-tooltip {
        position: fixed;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transform: translateX(-50%) translateY(-10px);
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(29, 12, 70, 0.3) 0%, transparent 70%);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .feature-card {
        transform-style: preserve-3d;
    }
    
    .testimonial-card {
        transform-style: preserve-3d;
    }
    
    .learn-more-btn, .cta-btn-primary, .cta-btn-secondary {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Enhanced glassmorphism effects */
    .nav-container, .feature-card, .testimonial-card {
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    }
    
    /* Interactive glow effects */
    .floating-element:hover {
        box-shadow: 
            0 10px 30px rgba(29, 12, 70, 0.2),
            0 0 20px rgba(202, 169, 104, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Enhanced hover states */
    .nav-link:hover {
        box-shadow: 0 4px 15px rgba(29, 12, 70, 0.1);
    }
    
    .logo-item:hover {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style); 