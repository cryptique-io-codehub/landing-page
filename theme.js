// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved user preference, if any, on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            
            // Save the current theme to localStorage
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Add dark mode class to user cards for proper styling
    const style = document.createElement('style');
    style.textContent = `
        /* Dark mode styles for user cards */
        body.dark-mode .user-card {
            background-color: rgba(255, 255, 255, 0.02) !important;
            border-color: rgba(255, 255, 255, 0.05) !important;
        }
        
        body.dark-mode .user-card:hover {
            background-color: rgba(255, 255, 255, 0.06) !important;
        }
        
        body.dark-mode .user-icon {
            background-color: rgba(255, 255, 255, 0.04) !important;
        }
        
        body.dark-mode .user-icon svg {
            color: #ffffff !important;
        }
        
        body.dark-mode .user-name {
            color: #ffffff !important;
        }
        
        body.dark-mode .user-description {
            color: #a0a0a0 !important;
        }

        /* Ensure workflow nodes are transparent in all themes */
        .workflow-node {
            background: transparent !important;
            border: none !important;
        }
    `;
    document.head.appendChild(style);
});
