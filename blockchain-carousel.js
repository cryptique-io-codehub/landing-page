document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.blockchain-carousel .carousel-track');
    const slide = document.querySelector('.blockchain-carousel .carousel-slide');
    
    if (!track || !slide) return;
    
    // Clone the slide for seamless looping
    const slideClone = slide.cloneNode(true);
    track.appendChild(slideClone);
    
    // Set initial position
    let position = 0;
    const speed = 0.5; // Pixels per frame
    let animationId;
    let isPaused = false;
    
    // Pause on hover
    track.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    track.addEventListener('mouseleave', () => {
        isPaused = false;
        if (!animationId) {
            animate();
        }
    });
    
    // Animation function
    function animate() {
        if (isPaused) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        position -= speed;
        
        // Reset position when we've scrolled one full slide width
        if (position <= -50) { // 50% because we have two slides (original + clone)
            position = 0;
        }
        
        track.style.transform = `translateX(${position}%)`;
        animationId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();
    
    // Clean up on window unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});
