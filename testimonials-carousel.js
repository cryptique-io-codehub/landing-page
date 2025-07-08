document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const carousel = document.querySelector('.testimonials-carousel');
    let cardWidth = 0;
    let isTransitioning = false;
    
    // Handle individual card hover for flip effect (including cloned cards)
    function attachCardHoverListeners() {
        const allTestimonialCards = document.querySelectorAll('.testimonial-card');
        allTestimonialCards.forEach(card => {
            // Remove existing listeners to avoid duplicates
            card.removeEventListener('mouseenter', handleCardMouseEnter);
            card.removeEventListener('mouseleave', handleCardMouseLeave);
            
            // Add listeners
            card.addEventListener('mouseenter', handleCardMouseEnter);
            card.addEventListener('mouseleave', handleCardMouseLeave);
        });
    }
    
    function handleCardMouseEnter() {
        // Pause carousel when hovering over individual cards
        isTransitioning = true;
        cancelAnimationFrame(animationId);
    }
    
    function handleCardMouseLeave() {
        // Resume carousel when leaving individual cards
        setTimeout(() => {
            if (!carousel.matches(':hover')) {
                isTransitioning = false;
                moveCarousel();
            }
        }, 100);
    }
    
    // Clone first few cards and append to the end for seamless looping
    const firstCard = cards[0].cloneNode(true);
    const secondCard = cards[1].cloneNode(true);
    track.appendChild(firstCard);
    track.appendChild(secondCard);
    
    // Get updated card list with clones
    const allCards = document.querySelectorAll('.testimonial-card');
    const cardCount = allCards.length;
    
    // Reattach listeners to cloned cards
    attachCardHoverListeners();
    
    // Set initial position
    let currentPosition = 0;
    const scrollSpeed = 1; // Pixels per frame (adjust for speed)
    let animationId;
    
    function calculateCardWidth() {
        if (allCards.length > 0) {
            const style = window.getComputedStyle(allCards[0]);
            const margin = parseFloat(style.marginRight) || 0;
            return allCards[0].offsetWidth + margin;
        }
        return 300; // Default width if calculation fails
    }
    
    function updateCardWidth() {
        cardWidth = calculateCardWidth();
    }
    
    function moveCarousel() {
        if (isTransitioning) return;
        
        currentPosition += scrollSpeed;
        
        // If we've scrolled past all cards, reset to the beginning
        if (currentPosition >= (cardCount - 4) * cardWidth) {
            // Disable transition for the reset
            track.style.transition = 'none';
            currentPosition = 0;
            // Force reflow
            track.offsetHeight;
        }
        
        // Re-enable transition for smooth scrolling
        track.style.transition = 'transform 0.1s linear';
        track.style.transform = `translateX(-${currentPosition}px)`;
        
        animationId = requestAnimationFrame(moveCarousel);
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCardWidth();
            // Reset position to avoid visual glitches
            track.style.transition = 'none';
            currentPosition = 0;
            track.style.transform = 'translateX(0)';
            track.offsetHeight; // Force reflow
        }, 250);
    });
    
    // Pause on hover and handle flip interactions
    // Pause carousel on hover
    carousel.addEventListener('mouseenter', () => {
        isTransitioning = true;
        cancelAnimationFrame(animationId);
    });
    
    carousel.addEventListener('mouseleave', () => {
        isTransitioning = false;
        moveCarousel();
    });
    
    // Initial attachment of listeners
    attachCardHoverListeners();
    
    // Initialize
    updateCardWidth();
    moveCarousel();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
});
