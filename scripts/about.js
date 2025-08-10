// About Page JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonial slider
    initTestimonialSlider();
});

// Initialize testimonial slider
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!slides.length || !dots.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 seconds between slides
    
    // Show only the first slide initially
    showSlide(0);
    
    // Start automatic sliding
    startSlideInterval();
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetInterval();
        });
    });
    
    // Show the specified slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide
        slides[index].style.display = 'block';
        
        // Add active class to current dot
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Start automatic sliding
    function startSlideInterval() {
        slideInterval = setInterval(function() {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= slides.length) {
                nextSlide = 0;
            }
            showSlide(nextSlide);
        }, intervalTime);
    }
    
    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to a server
            // For this demo, we'll just show a success message
            
            // Get form inputs
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            this.reset();
        });
    }
});
