document.addEventListener('DOMContentLoaded', function() {
    // Rotating questions
    const questions = [
        "Don't know WHERE your users are coming from?",
        "Don't know WHAT your users are doing?",
        "Don't know WHO your users are?"
    ];
    
    const rotatingQuestion = document.getElementById('rotating-question');
    let currentQuestionIndex = 0;
    
    function rotateQuestion() {
        if (!rotatingQuestion) return;
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        rotatingQuestion.style.opacity = '0';
        
        setTimeout(() => {
            rotatingQuestion.textContent = questions[currentQuestionIndex];
            rotatingQuestion.style.opacity = '1';
        }, 300);
    }
    
    // Initialize tab switching functionality
    function initTabSwitching() {
        const tabs = document.querySelectorAll('.feature-tab');
        const dashboardContent = document.querySelector('.dashboard-content');
        const walletContent = document.querySelector('.wallet-content');
        const intelligenceContent = document.querySelector('.intelligence-content');
        
        // Hide all content sections initially except dashboard
        if (walletContent) walletContent.style.display = 'none';
        if (intelligenceContent) intelligenceContent.style.display = 'none';
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Update content based on tab
                const tabName = tab.getAttribute('data-tab');
                showTabContent(tabName);
            });
        });
        
        function showTabContent(tabName) {
            console.log('Switching to tab:', tabName);
            
            // Hide all content sections
            if (dashboardContent) dashboardContent.style.display = 'none';
            if (walletContent) walletContent.style.display = 'none';
            if (intelligenceContent) intelligenceContent.style.display = 'none';
            
            // Show the selected content
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
        }
    }
    
    // Initialize tab switching
    initTabSwitching();
    
    // Start rotating questions if element exists
    if (rotatingQuestion) {
        // Initial rotation after 2 seconds, then every 3 seconds
        setTimeout(() => {
            setInterval(rotateQuestion, 3000);
        }, 2000);
    }


});
