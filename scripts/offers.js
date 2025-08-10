// Offers Page JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    initCountdown();
    
    // Initialize category tabs
    initCategoryTabs();
});

// Initialize countdown timer
function initCountdown() {
    // Set the countdown date (2 days from now)
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 2);
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countdownDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result in the elements
        document.getElementById("days").innerHTML = formatTime(days);
        document.getElementById("hours").innerHTML = formatTime(hours);
        document.getElementById("minutes").innerHTML = formatTime(minutes);
        document.getElementById("seconds").innerHTML = formatTime(seconds);
        
        // If the countdown is finished, clear the interval
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById("days").innerHTML = "00";
            document.getElementById("hours").innerHTML = "00";
            document.getElementById("minutes").innerHTML = "00";
            document.getElementById("seconds").innerHTML = "00";
        }
    }, 1000);
}

// Format time to always show two digits
function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

// Initialize category tabs
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const offerCards = document.querySelectorAll('.offer-card');
    
    if (!tabButtons.length || !offerCards.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the category to filter
            const category = this.getAttribute('data-category');
            
            // Show/hide offer cards based on category
            offerCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    // Add animation for smooth appearance
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Copy offer code to clipboard
function copyOfferCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert('Offer code copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Add click event to offer code elements
document.addEventListener('DOMContentLoaded', function() {
    const offerCodes = document.querySelectorAll('.offer-code strong');
    
    offerCodes.forEach(code => {
        code.addEventListener('click', function() {
            copyOfferCode(this.textContent);
        });
        
        // Add tooltip to indicate clickable
        code.title = "Click to copy";
        code.style.cursor = "pointer";
    });
});
