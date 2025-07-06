document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Rotating questions with touch support
    const questions = [
        "Don't know WHERE your users are coming from?",
        "Don't know WHAT your users are doing?",
        "Don't know WHO your users are?"
    ];
    
    const rotatingQuestion = document.getElementById('rotating-question');
    let currentQuestionIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    
    function rotateQuestion(direction = 'next') {
        if (!rotatingQuestion) return;
        
        if (direction === 'next') {
            currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        } else {
            currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
        }
        
        rotatingQuestion.style.opacity = '0';
        
        setTimeout(() => {
            rotatingQuestion.textContent = questions[currentQuestionIndex];
            rotatingQuestion.style.opacity = '1';
        }, 300);
    }
    
    // Add touch events for mobile swipe
    if (isMobile && rotatingQuestion) {
        rotatingQuestion.style.cursor = 'grab';
        
        rotatingQuestion.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        rotatingQuestion.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance to trigger swipe
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next question
                    rotateQuestion('next');
                } else {
                    // Swipe right - previous question
                    rotateQuestion('prev');
                }
            }
        }
    }
    
    // Initialize tab switching functionality with touch support
    function initTabSwitching() {
        const tabs = document.querySelectorAll('.feature-tab');
        const dashboardContent = document.querySelector('.dashboard-content');
        const walletContent = document.querySelector('.wallet-content');
        const intelligenceContent = document.querySelector('.intelligence-content');
        
        // Hide all content sections initially except dashboard
        if (walletContent) walletContent.style.display = 'none';
        if (intelligenceContent) intelligenceContent.style.display = 'none';
        
        function activateTab(tab) {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update content based on tab
            const tabName = tab.getAttribute('data-tab');
            showTabContent(tabName);
        }
        
        tabs.forEach(tab => {
            // Click event for mouse users
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                activateTab(tab);
            });
            
            // Touch event for better mobile support
            tab.addEventListener('touchend', (e) => {
                e.preventDefault();
                activateTab(tab);
            }, { passive: true });
            
            // Add touch feedback
            tab.style.transition = 'transform 0.1s ease';
            tab.addEventListener('touchstart', () => {
                tab.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            tab.addEventListener('touchend', () => {
                tab.style.transform = 'scale(1)';
            }, { passive: true });
        });
        
        function showTabContent(tabName) {
            // Hide all content sections
            if (dashboardContent) dashboardContent.style.display = 'none';
            if (walletContent) walletContent.style.display = 'none';
            if (intelligenceContent) intelligenceContent.style.display = 'none';
            
            // Show the selected content with smooth transition
            setTimeout(() => {
                switch(tabName) {
                    case 'attribution':
                        if (dashboardContent) dashboardContent.style.display = 'block';
                        break;
                    case 'wallet':
                        if (walletContent) walletContent.style.display = 'block';
                        break;
                    case 'intelligence':
                        if (intelligenceContent) intelligenceContent.style.display = 'block';
                        break;
                }
            }, 10);
        }
    }
    
    // Initialize tab switching
    initTabSwitching();
    
    // Initialize chat interface for mobile
    function initChatInterface() {
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.querySelector('.send-button');
        
        if (chatInput && sendButton) {
            // Make chat input more touch-friendly
            chatInput.style.padding = '12px 15px';
            chatInput.style.fontSize = '16px'; // Larger font for better touch
            
            // Make send button larger on mobile
            if (isMobile) {
                sendButton.style.padding = '12px 20px';
                sendButton.style.fontSize = '16px';
            }
            
            // Prevent keyboard from covering input on mobile
            if (isMobile) {
                chatInput.addEventListener('focus', () => {
                    window.scrollTo(0, document.body.scrollHeight);
                });
            }
        }
    }
    
    // Initialize chat interface
    initChatInterface();
    
    // Start rotating questions if element exists
    if (rotatingQuestion) {
        // Only auto-rotate on non-mobile or if mobile user hasn't interacted
        let userInteracted = false;
        
        const handleUserInteraction = () => {
            if (!userInteracted) {
                userInteracted = true;
                // User has interacted, we can stop auto-rotation
                clearInterval(rotationInterval);
            }
        };
        
        // Add event listeners for user interaction
        document.addEventListener('touchstart', handleUserInteraction, { once: true });
        document.addEventListener('mousedown', handleUserInteraction, { once: true });
        
        // Initial rotation after 2 seconds, then every 3 seconds
        const rotationInterval = setInterval(() => {
            if (!userInteracted) {
                rotateQuestion('next');
            } else {
                clearInterval(rotationInterval);
            }
        }, 3000);
    }
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-initialize components that need to adjust to new screen size
            initChatInterface();
        }, 250);
    });
});
