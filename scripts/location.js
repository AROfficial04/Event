// Location Selection JavaScript for EvAnia

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const locationSelector = document.querySelector('.location-selector');
    const locationText = document.querySelector('.location-selector span');
    const locationModal = document.getElementById('locationModal');
    const closeModal = document.querySelector('.close-modal');
    const cityItems = document.querySelectorAll('.city-item');
    const useMyLocationBtn = document.querySelector('.use-my-location');
    const citySearchInput = document.querySelector('.location-search input');
    
    // Check if location is stored in local storage
    function initLocationSelector() {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation && locationText) {
            locationText.textContent = savedLocation;
        }
    }
    
    // Open location modal
    function openLocationModal() {
        if (locationModal) {
            locationModal.style.display = 'block';
        }
    }
    
    // Close location modal
    function closeLocationModal() {
        if (locationModal) {
            locationModal.style.display = 'none';
        }
    }
    
    // Set user location
    function setUserLocation(city) {
        if (locationText) {
            locationText.textContent = city;
            localStorage.setItem('userLocation', city);
            closeLocationModal();
            
            // In a real app, you would update content based on location
            updateContentBasedOnLocation(city);
        }
    }
    
    // Get user location using Geolocation API
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, you would use reverse geocoding to get the city name
                    // For this demo, we'll use a placeholder
                    reverseGeocode(position.coords.latitude, position.coords.longitude);
                },
                function(error) {
                    console.error("Error getting location:", error);
                    alert("Could not detect your location. Please select a city manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser. Please select a city manually.");
        }
    }
    
    // Simulated reverse geocoding function
    function reverseGeocode(lat, lng) {
        // In a real app, you would call a geocoding API here
        // For this demo, we'll just use a placeholder
        const city = "Your Location";
        setUserLocation(city);
    }
    
    // Update content based on location
    function updateContentBasedOnLocation(city) {
        // In a real app, you would fetch location-specific content
        console.log(`Updating content for ${city}`);
        
        // Example: Update heading or featured content
        const featuredHeading = document.querySelector('.section-title h2');
        if (featuredHeading) {
            featuredHeading.textContent = `Featured Décor in ${city}`;
        }
    }
    
    // Filter cities based on search input
    function filterCities(searchTerm) {
        if (!cityItems.length) return;
        
        searchTerm = searchTerm.toLowerCase();
        
        cityItems.forEach(city => {
            const cityName = city.textContent.toLowerCase();
            if (cityName.includes(searchTerm)) {
                city.style.display = 'block';
            } else {
                city.style.display = 'none';
            }
        });
    }
    
    // Event listeners
    if (locationSelector) {
        locationSelector.addEventListener('click', openLocationModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeLocationModal);
    }
    
    if (cityItems.length) {
        cityItems.forEach(city => {
            city.addEventListener('click', function() {
                const selectedCity = this.textContent;
                setUserLocation(selectedCity);
            });
        });
    }
    
    if (useMyLocationBtn) {
        useMyLocationBtn.addEventListener('click', getUserLocation);
    }
    
    if (citySearchInput) {
        citySearchInput.addEventListener('input', function() {
            filterCities(this.value);
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === locationModal) {
            closeLocationModal();
        }
    });
    
    // Initialize location selector
    initLocationSelector();
});
