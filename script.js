// DOM Elements
const themeToggles = document.querySelectorAll('.theme-toggle');
const html = document.documentElement;
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
} else {
    const defaultTheme = systemPrefersDark ? 'dark' : 'light';
    html.setAttribute('data-theme', defaultTheme);
    localStorage.setItem('theme', defaultTheme);
}

// Theme Toggle Function
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add animation class
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
    
    // Dispatch a custom event when theme changes
    const event = new CustomEvent('theme-change', { detail: { theme: newTheme } });
    document.documentElement.dispatchEvent(event);
}

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Close mobile menu when a link is clicked
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
    // Close mobile menu when theme is toggled on mobile
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle .theme-toggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Set active nav link
function setActiveNavLink() {
    const scrollPosition = window.scrollY;
    
    // For demo purposes, we'll just highlight the first link
    // In a real implementation, you'd check scroll position against sections
    navLinks.forEach(link => link.classList.remove('active'));
    mobileNavLinks.forEach(link => link.classList.remove('active'));
    
    if (scrollPosition < 100) {
        navLinks[0]?.classList.add('active');
        mobileNavLinks[0]?.classList.add('active');
    }
}

// Event Listeners
themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
});

mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Set active nav link on scroll
window.addEventListener('scroll', setActiveNavLink);

// Initialize
setActiveNavLink();

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Initial check
animateOnScroll();
