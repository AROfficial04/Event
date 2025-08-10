// Main JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.querySelector('.close-menu');
    
    if (menuToggle && mobileMenu && closeMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
        
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }
    
    // Mobile Category Accordions
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const categoryItems = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            categoryItems.classList.toggle('active');
            
            if (categoryItems.classList.contains('active')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Location Modal
    const locationSelector = document.querySelector('.location-selector');
    const locationModal = document.getElementById('locationModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (locationSelector && locationModal && closeModal) {
        locationSelector.addEventListener('click', function() {
            locationModal.style.display = 'block';
        });
        
        closeModal.addEventListener('click', function() {
            locationModal.style.display = 'none';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === locationModal) {
                locationModal.style.display = 'none';
            }
        });
    }
    
    // City Selection
    const cityItems = document.querySelectorAll('.city-item');
    const locationText = document.querySelector('.location-selector span');
    const useMyLocation = document.querySelector('.use-my-location');
    
    if (cityItems && locationText) {
        // Check if location is stored in local storage
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            locationText.textContent = savedLocation;
        }
        
        cityItems.forEach(city => {
            city.addEventListener('click', function() {
                const selectedCity = this.textContent;
                locationText.textContent = selectedCity;
                localStorage.setItem('userLocation', selectedCity);
                locationModal.style.display = 'none';
            });
        });
    }
    
    if (useMyLocation) {
        useMyLocation.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // In a real app, you would use a reverse geocoding API to get the city name
                        // For this demo, we'll just set a placeholder
                        const city = "Your Location";
                        locationText.textContent = city;
                        localStorage.setItem('userLocation', city);
                        locationModal.style.display = 'none';
                    },
                    function(error) {
                        console.error("Error getting location:", error);
                        alert("Could not detect your location. Please select a city manually.");
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser. Please select a city manually.");
            }
        });
    }
});
