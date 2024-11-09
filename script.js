// DOM Elements
const loaderSection = document.getElementById('loaderSection');
const successMessage = document.getElementById('successMessage');
const mainContent = document.getElementById('main-content');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    // Hide main content initially
    mainContent.style.display = 'none';
    
    // Initialize all features
    initializeLoader();
    initializeNavigation();
    initializeCarousel();
    initializeContactForm();
    updateCopyrightYear();
    initializeScrollSpy();
});

// Loader Animation
function initializeLoader() {
    setTimeout(() => {
        // Hide loader elements
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.loading-text').style.display = 'none';
        // Show success message
        successMessage.style.display = 'block';

        // Show main content after delay
        setTimeout(() => {
            loaderSection.style.display = 'none';
            mainContent.style.display = 'block';
            // Trigger any entrance animations here if needed
        }, 1000);
    }, 2000);
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Animate hamburger icon if needed
    });

    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Account for fixed header offset
                const headerOffset = 70;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Carousel Class
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
        this.indicators = document.getElementById('carouselIndicators');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.createIndicators();
        this.setupControls();
        this.startAutoPlay();
        this.setupTouchEvents();
    }

    createIndicators() {
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                }
            });
            this.indicators.appendChild(indicator);
        });
    }

    setupControls() {
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');

        prevButton.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
                this.resetAutoPlay();
            }
        });

        nextButton.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);

        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        }, false);
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold && !this.isTransitioning) {
            if (diff > 0) {
                this.nextSlide(); // Swipe left
            } else {
                this.prevSlide(); // Swipe right
            }
            this.resetAutoPlay();
        }
    }

    updateSlides() {
        this.isTransitioning = true;
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        const indicators = this.indicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Reset transitioning flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500); // Match this with CSS transition duration
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlides();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize Carousel
function initializeCarousel() {
    const carouselElement = document.getElementById('heroCarousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
}

// Contact Form Handling
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Basic validation
    if (!validateForm(formData)) {
        return;
    }

    // Simulate form submission
    // In production, replace this with actual API call
    simulateFormSubmission(formData);
}

function validateForm(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Message validation
    if (data.message.length < 10) {
        alert('Please enter a message with at least 10 characters');
        return false;
    }

    return true;
}

function simulateFormSubmission(formData) {
    // Show loading state
    const submitButton = document.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        document.getElementById('contactForm').reset();
        
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Copyright Year Update
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Scroll Spy for Navigation
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

    // Detect when elements come into view
    function animateCardsOnScroll() {
        const cards = document.querySelectorAll('.service-card');
        const triggerHeight = window.innerHeight / 1.3;

        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerHeight) {
                card.classList.add('animate');
            }
        });
    }

    // Add scroll event listener
    window.addEventListener('scroll', animateCardsOnScroll);

    //Project-Section
    const projectContainer = document.querySelector('.project-container');
const loadMoreButton = document.getElementById('load-more');
const showAllButton = document.getElementById('show-all');
let visibleProjectItems = 4; // Initially show only 4 items
let allProjectItems = projectContainer.querySelectorAll('.project-item');

// Function to display only the currently visible items
function displayVisibleItems() {
    allProjectItems.forEach((item, index) => {
        item.style.display = index < visibleProjectItems ? 'block' : 'none';
    });
}

// Function to show more projects in increments of 4
function showMoreProjects() {
    visibleProjectItems += 4; // Increase the visible items by 4
    displayVisibleItems(); // Update the display

    // If all items are displayed, hide the buttons
    if (visibleProjectItems >= allProjectItems.length) {
        loadMoreButton.style.display = 'none';
        showAllButton.style.display = 'none';
    }
}

// Function to show all projects at once
function showAllProjects() {
    visibleProjectItems = allProjectItems.length; // Set visible items to total number
    displayVisibleItems(); // Update the display
    loadMoreButton.style.display = 'none'; // Hide "Check More" button
    showAllButton.style.display = 'none'; // Hide "Show All" button
}

// Initial display setup: show only 5 items by default
displayVisibleItems();

// Add event listeners to the buttons
loadMoreButton.addEventListener('click', showMoreProjects);
showAllButton.addEventListener('click', showAllProjects);
