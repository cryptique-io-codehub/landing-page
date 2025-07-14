// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Blog posts data
    const blogPosts = [
        {
            id: 1,
            title: "Cryptique Secures Strategic Angel Investment to Build for the future of the Internet",
            excerpt: "Cryptique is proud to announce the successful close of its angel investment round, marking a significant milestone in our mission to build the foundational infrastructure for Web3 marketing.",
            category: "news",
            author: "Parth Agarwal",
            authorInitial: "P",
            date: "2025-05-15",
            readTime: 3,
            image: "angel-investment/images/blog1.JPG",
            featured: true,
            url: "angel-investment/index.html"
        }
    ];

    // DOM elements
    const blogGrid = document.getElementById('blogGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Initialize
    init();

    function init() {
        renderPosts();
        setupEventListeners();
        updateTheme();
    }

    function setupEventListeners() {
        // Theme toggle integration
        const themeToggle = document.getElementById('themeToggle');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', updateTheme);
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', updateTheme);
        }



        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }
    }

    function renderPosts() {
        // Clear existing content
        blogGrid.innerHTML = '';

        // Render all posts (just one for now)
        blogPosts.forEach(post => {
            const postElement = createPostElement(post);
            blogGrid.appendChild(postElement);
        });

        // Hide load more button since we only have one post
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }

        // Add click listeners to post cards
        addPostClickListeners();
    }

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-post-card';
        postDiv.dataset.postId = post.id;

        postDiv.innerHTML = `
            <div class="blog-post-image">
                <img src="${post.image}" alt="${post.title}" onerror="this.src='images/placeholder-image.jpg'">
            </div>
            <div class="blog-post-content">
                <div class="blog-post-category">${post.category}</div>
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <div class="blog-post-meta">
                    <div class="blog-post-author">
                        <div class="author-avatar">${post.authorInitial}</div>
                        <span>${post.author}</span>
                    </div>
                    <div class="blog-post-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
        `;

        return postDiv;
    }

    function addPostClickListeners() {
        const postCards = document.querySelectorAll('.blog-post-card');
        postCards.forEach(card => {
            card.addEventListener('click', handlePostClick);
        });
    }

    function handlePostClick(e) {
        const postId = e.currentTarget.dataset.postId;
        const post = blogPosts.find(p => p.id == postId);
        
        if (post) {
            // Navigate to the specific blog post
            if (post.url) {
                window.location.href = post.url;
            } else {
                // For other posts, show alert (you can create more blog post files)
                alert(`Navigate to blog post: ${post.title}\n\nCreate a new blog post file for this article using the template.`);
            }
        }
    }



    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function updateTheme() {
        // This function integrates with the existing theme system
        setTimeout(() => {
            const isDark = document.body.classList.contains('dark-mode');
            const root = document.documentElement;
            
            if (isDark) {
                root.setAttribute('data-theme', 'dark');
            } else {
                root.setAttribute('data-theme', 'light');
            }
        }, 100);
    }

    function handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // In a real implementation, you would send this to your backend
        alert(`Thank you for subscribing with email: ${email}\n\nIn a real implementation, this would be sent to your newsletter service.`);
        
        // Reset form
        e.target.reset();
    }

    // Utility function to create placeholder image if needed
    function createPlaceholderImage(width = 400, height = 200) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#1d0c46');
        gradient.addColorStop(1, '#caa968');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Blog Image', width / 2, height / 2);
        
        return canvas.toDataURL();
    }

    // Mobile menu integration
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for internal links
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

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Initialize theme on page load
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});

// Export functions for potential use in other scripts
window.blogUtils = {
    formatDate: function(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },
    
    createSlug: function(title) {
        return title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    },
    
    estimateReadTime: function(content) {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        return Math.ceil(words / wordsPerMinute);
    }
}; 