// Categories Slider JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevBtn = document.querySelector('.slider-container .slider-btn.prev');
    const nextBtn = document.querySelector('.slider-container .slider-btn.next');
    
    if (!sliderWrapper) return;
    
    const categoryCards = document.querySelectorAll('.category-card');
    const cardWidth = categoryCards[0]?.offsetWidth + 20; // Card width + gap
    const visibleCards = Math.floor(sliderWrapper.offsetWidth / cardWidth);
    let currentPosition = 0;
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    
    // Initialize the slider
    function initSlider() {
        // Event listeners for navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                slideLeft();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                slideRight();
            });
        }
        
        // Make slider draggable
        setupDraggableSlider();
        
        // Make slider touch-enabled for mobile
        setupTouchSlider();
        
        // Categories are now <a> elements with href attributes
        // We need to handle the dragging vs clicking behavior
        categoryCards.forEach(card => {
            let isDraggingCard = false;
            let startX = 0;
            
            // Handle mouse events
            card.addEventListener('mousedown', function(e) {
                isDraggingCard = false;
                startX = e.pageX;
            });
            
            card.addEventListener('mousemove', function(e) {
                if (Math.abs(e.pageX - startX) > 10) {
                    isDraggingCard = true;
                }
            });
            
            card.addEventListener('click', function(e) {
                // If we were dragging, prevent navigation
                if (isDraggingCard) {
                    e.preventDefault();
                }
            });
            
            // Handle touch events
            card.addEventListener('touchstart', function(e) {
                isDraggingCard = false;
                startX = e.touches[0].clientX;
            });
            
            card.addEventListener('touchmove', function(e) {
                if (Math.abs(e.touches[0].clientX - startX) > 10) {
                    isDraggingCard = true;
                }
            });
            
            card.addEventListener('touchend', function(e) {
                if (isDraggingCard) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Slide left function
    function slideLeft() {
        if (currentPosition > 0) {
            currentPosition--;
            updateSliderPosition();
        }
    }
    
    // Slide right function
    function slideRight() {
        if (currentPosition < categoryCards.length - visibleCards) {
            currentPosition++;
            updateSliderPosition();
        }
    }
    
    // Update slider position
    function updateSliderPosition() {
        currentTranslate = -currentPosition * cardWidth;
        sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }
    
    // Setup draggable functionality
    function setupDraggableSlider() {
        sliderWrapper.addEventListener('mousedown', dragStart);
        sliderWrapper.addEventListener('mouseup', dragEnd);
        sliderWrapper.addEventListener('mouseleave', dragEnd);
        sliderWrapper.addEventListener('mousemove', drag);
    }
    
    // Setup touch functionality for mobile
    function setupTouchSlider() {
        sliderWrapper.addEventListener('touchstart', dragStart);
        sliderWrapper.addEventListener('touchend', dragEnd);
        sliderWrapper.addEventListener('touchmove', drag);
    }
    
    // Drag start event
    function dragStart(e) {
        isDragging = true;
        startPosition = getPositionX(e);
        sliderWrapper.style.cursor = 'grabbing';
        sliderWrapper.style.transition = 'none';
    }
    
    // Dragging event
    function drag(e) {
        if (!isDragging) return;
        
        const currentX = getPositionX(e);
        const diff = currentX - startPosition;
        const maxTranslate = -(categoryCards.length - visibleCards) * cardWidth;
        
        let newTranslate = currentTranslate + diff;
        
        // Limit dragging beyond the first and last cards
        if (newTranslate > 0) {
            newTranslate = 0;
        } else if (newTranslate < maxTranslate) {
            newTranslate = maxTranslate;
        }
        
        sliderWrapper.style.transform = `translateX(${newTranslate}px)`;
    }
    
    // Drag end event
    function dragEnd(e) {
        if (!isDragging) return;
        
        isDragging = false;
        sliderWrapper.style.cursor = 'grab';
        sliderWrapper.style.transition = 'transform var(--transition-normal)';
        
        const currentX = getPositionX(e);
        const diff = currentX - startPosition;
        
        // Determine if we should move to the next or previous slide based on drag distance
        if (Math.abs(diff) > cardWidth / 3) {
            if (diff > 0) {
                slideLeft();
            } else {
                slideRight();
            }
        } else {
            // Snap back to current position
            updateSliderPosition();
        }
    }
    
    // Helper function to get position X from mouse or touch event
    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // Initialize the slider
    initSlider();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Reset position on resize
        currentPosition = 0;
        updateSliderPosition();
    });
});
