document.addEventListener('DOMContentLoaded', function() {
    // Function to shuffle an array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // All carousel items
    const allItems = [
        'DeFi Protocols', 'NFT Projects', 'Metaverse', 'DePIN', 'RWA',
        'Layer 1 Ecosystems', 'Layer 2 Ecosystems', 'DAOs', 'Crypto Exchanges',
        'Launchpads', 'Wallet Providers', 'SocialFi Platforms', 'Venture Capital',
        'Marketing Agencies'
    ];

    // Initialize each carousel track
    document.querySelectorAll('.new-section .word-carousel .carousel-track').forEach((track, index) => {
        // Create a shuffled copy of the items
        const shuffledItems = shuffleArray([...allItems]);
        
        // Duplicate items to ensure seamless looping
        const itemsToShow = [...shuffledItems, ...shuffledItems, ...shuffledItems];
        
        // Clear existing items
        track.innerHTML = '';
        
        // Add items to the track
        itemsToShow.forEach(item => {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            div.textContent = item;
            track.appendChild(div);
        });

        // Set animation duration based on number of items
        const duration = 40 + (index * 5); // Each track has a different speed
        track.style.animationDuration = `${duration}s`;
    });
});
