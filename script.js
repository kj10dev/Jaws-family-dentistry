// Initialize GSAP animations and page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading spinner after page loads
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.display = 'none';
        }, 1000);
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Page navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    if (navLinks.length && pages.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                const pageId = link.getAttribute('data-page');

                // If the link has a real href (points to a file or path) allow normal navigation.
                // Only handle links where href is '#' or a hash (internal navigation).
                if (href && href !== '#' && !href.startsWith('#')) {
                    return; // let browser follow the href (full page load)
                }

                // If no data-page available, nothing to handle here
                if (!pageId) return;

                e.preventDefault();

                // UI updates: set active link and show/hide sections (SPA-style for internal only)
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                pages.forEach(page => page.style.display = 'none');
                const targetPage = document.getElementById(`${pageId}-page`);
                if (targetPage) targetPage.style.display = 'block';
                if (window.innerWidth <= 768 && navMenu) navMenu.classList.remove('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // If this is internal navigation using hashes, update hash so URL reflects state.
                if (href && href.startsWith('#')) {
                    window.location.hash = href;
                }
            });
        });
    }

    // handle back/forward
    window.addEventListener('popstate', (e) => {
        const pageId = e.state?.page || 'home';
        // update UI to match state
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-page') === pageId));
        pages.forEach(page => page.style.display = (page.id === `${pageId}-page`) ? 'block' : 'none');
        window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // Book Appointment button
    const bookBtn = document.getElementById('book-appointment-btn');
    if (bookBtn && navLinks.length) {
        bookBtn.addEventListener('click', () => {
            const target = Array.from(navLinks).find(l => l.getAttribute('data-page') === 'appointment');
            if (target) {
                const href = target.getAttribute('href') || '';
                if (href && href !== '#' && !href.startsWith('#')) {
                    // follow the original page link
                    window.location.href = href;
                } else {
                    // trigger SPA/internal handler
                    target.click();
                }
            }
        });
    }

    // Contact Us button
    const contactBtn = document.getElementById('contact-us-btn');
    if (contactBtn && navLinks.length) {
        contactBtn.addEventListener('click', () => {
            const target = Array.from(navLinks).find(l => l.getAttribute('data-page') === 'contact');
            if (target) {
                const href = target.getAttribute('href') || '';
                if (href && href !== '#' && !href.startsWith('#')) {
                    window.location.href = href;
                } else {
                    target.click();
                }
            }
        });
    }

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const toggle = item.querySelector('.faq-toggle');
            if (toggle) {
                toggle.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    }

    // Form validation
    const appointmentForm = document.getElementById('appointment-form');
    const contactForm = document.getElementById('contact-form');

    function validateForm(form) {
        let isValid = true;

        // Get all form inputs
        const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');

        inputs.forEach(input => {
            input.classList.remove('error');
            const errorMessage = input.nextElementSibling;
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.style.display = 'none';
            }

            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.style.display = 'block';
                }
                isValid = false;
            } else if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('error');
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.textContent = 'Please enter a valid email address';
                        errorMessage.style.display = 'block';
                    }
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Handle form submission
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm(appointmentForm)) {
                // Simulate form submission
                alert('Thank you for your appointment request! We will contact you to confirm your appointment.');
                appointmentForm.reset();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm(contactForm)) {
                // Simulate form submission
                alert('Thank you for your message! We will respond to you as soon as possible.');
                contactForm.reset();
            }
        });
    }

    // Scroll reveal animations
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .fade-in');

    function checkScrollReveal() {
        scrollRevealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            const isVisible = elementTop < window.innerHeight && elementBottom >= 0;

            if (isVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Initial check
    checkScrollReveal();

    // Check on scroll
    window.addEventListener('scroll', checkScrollReveal);

    // GSAP animations for hero section (ensure GSAP is loaded)
    if (typeof gsap !== 'undefined') {
        try {
            gsap.from(".hero-content h1", {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: "power3.out"
            });

            gsap.from(".hero-content p", {
                duration: 1,
                y: 50,
                opacity: 0,
                delay: 0.2,
                ease: "power3.out"
            });

            gsap.from(".cta-buttons .btn", {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                delay: 0.4,
                ease: "power3.out"
            });
        } catch (e) {
            // ignore GSAP runtime issues
            // console.warn('GSAP animation failed', e);
        }
    }

    // Animate service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length && typeof gsap !== 'undefined') {
        serviceCards.forEach((card, index) => {
            try {
                gsap.from(card, {
                    duration: 0.6,
                    y: 50,
                    opacity: 0,
                    delay: index * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            } catch (e) {
                // ignore per-card animation errors
            }
        });
    }

    // Animate team members
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length && typeof gsap !== 'undefined') {
        teamMembers.forEach((member, index) => {
            try {
                gsap.from(member, {
                    duration: 0.6,
                    y: 50,
                    opacity: 0,
                    delay: index * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: member,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            } catch (e) {
                // ignore animation error
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .social-icon, .download-btn');

    if (buttons.length && typeof gsap !== 'undefined') {
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1.05,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    duration: 0.2,
                    scale: 1,
                    ease: "power2.out"
                });
            });
        });
    }

    // Add animation to logo
    if (typeof gsap !== 'undefined') {
        try {
            gsap.from(".logo img", {
                duration: 1.5,
                rotation: 360,
                scale: 0,
                ease: "back.out(1.7)"
            });
        } catch (e) {
            // ignore
        }
    }
});