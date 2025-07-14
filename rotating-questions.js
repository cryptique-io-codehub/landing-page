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
        }, 200);
    }
    
    // Start rotating questions if element exists
    if (rotatingQuestion) {
        // Initial rotation after 1 second, then every 1.5 seconds
        setTimeout(() => {
            setInterval(rotateQuestion, 1500);
        }, 1000);
    }
}); 