// Carousel JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds between slides
    
    // Initialize the carousel
    function initCarousel() {
        // Start automatic sliding
        startSlideInterval();
        
        // Event listeners for navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                changeSlide(currentSlide - 1);
                resetInterval();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                changeSlide(currentSlide + 1);
                resetInterval();
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                changeSlide(index);
                resetInterval();
            });
        });
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', function() {
                clearInterval(slideInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', function() {
                startSlideInterval();
            });
        }
    }
    
    // Change slide function
    function changeSlide(index) {
        // Handle index bounds
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove('active');
        }
        
        // Add active class to new slide and dot
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }
    
    // Start automatic sliding
    function startSlideInterval() {
        slideInterval = setInterval(function() {
            changeSlide(currentSlide + 1);
        }, intervalTime);
    }
    
    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Initialize the carousel
    initCarousel();
});
