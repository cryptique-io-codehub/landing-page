document.addEventListener('DOMContentLoaded', function() {
    const featureSections = document.querySelectorAll('.feature-section');
    let lastScrollY = window.scrollY;
    let animationFrame;
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        // Get scroll direction
        const scrollingDown = window.scrollY > lastScrollY;
        lastScrollY = window.scrollY;

        entries.forEach(entry => {
            const currentSection = entry.target;
            const currentIndex = Array.from(featureSections).indexOf(currentSection);

            // Cancel any existing animation frame
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            // Use requestAnimationFrame for smooth animations
            animationFrame = requestAnimationFrame(() => {
                if (entry.isIntersecting) {
                    // Add visible class to current section with a slight delay
                    setTimeout(() => {
                        currentSection.classList.add('visible');
                        currentSection.classList.remove('exit');
                    }, 50);

                    // Handle other sections based on scroll direction
                    featureSections.forEach((section, index) => {
                        if (index !== currentIndex) {
                            if (scrollingDown && index < currentIndex) {
                                // Sections above current when scrolling down
                                section.classList.add('exit');
                                section.classList.remove('visible');
                            } else if (!scrollingDown && index > currentIndex) {
                                // Sections below current when scrolling up
                                section.classList.remove('visible', 'exit');
                            }
                        }
                    });
                } else {
                    // When section leaves viewport
                    if (scrollingDown && entry.boundingClientRect.top < 0) {
                        // Section scrolled up out of view
                        currentSection.classList.add('exit');
                    } else if (!scrollingDown && entry.boundingClientRect.top > window.innerHeight) {
                        // Section scrolled down out of view
                        currentSection.classList.remove('visible', 'exit');
                    }
                }
            });
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px'
    });

    // Observe all feature sections
    featureSections.forEach(section => observer.observe(section));

    // Handle initial state on page load
    featureSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.classList.add('visible');
        }
    });
}); 