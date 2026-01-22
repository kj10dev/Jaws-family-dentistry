// Initialize GSAP animations and page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Ensure spinner is removed early so it can't cover the page if other code fails
    const loading = document.getElementById('loading');
    if (loading) {
        // hide immediately (will be hidden again in finally)
        loading.style.display = 'none';
    }

    try {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Page navigation (defensive)
        const navLinks = document.querySelectorAll('.nav-link') || [];
        const pages = document.querySelectorAll('.page') || [];

        if (navLinks.length && pages.length) {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href') || '';
                    const pageId = link.getAttribute('data-page');

                    // allow real links to navigate
                    if (href && href !== '#' && !href.startsWith('#')) {
                        return;
                    }

                    if (!pageId) return;
                    e.preventDefault();

                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    pages.forEach(page => page.style.display = 'none');
                    const targetPage = document.getElementById(`${pageId}-page`);
                    if (targetPage) targetPage.style.display = 'block';
                    if (window.innerWidth <= 768 && navMenu) navMenu.classList.remove('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
        }

        // Book Appointment button (defensive)
        const appointmentBtn = document.getElementById('appointment-btn');
        appointmentBtn?.addEventListener('click', () => {
            const href = appointmentBtn.getAttribute('data-href') || '';
            if (href) {
                window.location.href = href;
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // follow default behavior (hash) but ensure smooth scroll
                const href = this.getAttribute('href');
                if (href && href.length > 1) {
                    e.preventDefault();
                    const el = document.querySelector(href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    // update hash without page jump in some browsers
                    history.replaceState(null, '', href);
                }
            });
        });

        // Initialize ScrollReveal only if available
        if (typeof ScrollReveal !== 'undefined') {
            const sr = ScrollReveal({
                origin: 'bottom',
                distance: '30px',
                duration: 700,
                delay: 100,
                reset: true
            });
            sr.reveal('.reveal', { interval: 100 });
        } else {
            // fallback: mark .scroll-reveal elements visible so they are not permanently hidden
            document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('visible'));
        }

        // FAQ toggle: make question headers expand/collapse their answer
        (function initFAQ() {
            const toggles = document.querySelectorAll('.faq-toggle');
            if (!toggles.length) return;

            toggles.forEach(toggle => {
                // ensure accessible button-like behaviour
                if (!toggle.hasAttribute('role')) toggle.setAttribute('role', 'button');
                if (!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', '0');

                // find nearest .faq-item and its answer
                const item = toggle.closest('.faq-item');
                const answer = item ? item.querySelector('.faq-answer') : null;

                // set initial aria-expanded based on existing .active class
                const isActive = item && item.classList.contains('active');
                toggle.setAttribute('aria-expanded', String(Boolean(isActive)));

                // click handler
                toggle.addEventListener('click', (e) => {
                    if (!item) return;
                    const now = item.classList.toggle('active');
                    toggle.setAttribute('aria-expanded', String(Boolean(now)));
                    // optional: smooth reveal (keeps CSS responsibility for display)
                    if (answer) {
                        if (now) {
                            answer.style.display = 'block';
                        } else {
                            answer.style.display = 'none';
                        }
                    }
                });

                // keyboard support: Enter and Space activate the toggle
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                        toggle.click();
                    }
                });
            });

            // Ensure answers' initial state matches .active class (defensive)
            document.querySelectorAll('.faq-item').forEach(fi => {
                const ans = fi.querySelector('.faq-answer');
                if (!ans) return;
                ans.style.display = fi.classList.contains('active') ? 'block' : 'none';
            });
        })();

        // 3D Tilt Logic for Logo
        (function initTilt() {
            const tiltContainer = document.querySelector('.tilt-container');
            if (!tiltContainer) return;

            tiltContainer.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = tiltContainer.getBoundingClientRect();
                const centerX = left + width / 2;
                const centerY = top + height / 2;

                // Calculate position relative to center
                const mouseX = e.clientX - centerX;
                const mouseY = e.clientY - centerY;

                // Rotation calculation (max 20 degrees)
                // RotateX is based on Y axis movement (up/down tilts X axis)
                // RotateY is based on X axis movement (left/right tilts Y axis)
                // Invert X for natural feel: moving mouse up (negative Y) should look down (negative rotation)? 
                // Actually usually: mouse up -> top tilts away -> positive rotateX? 
                // Standard 3D tilt: mouse top -> top goes back.
                const rotateX = ((mouseY / height) * -20).toFixed(2);
                const rotateY = ((mouseX / width) * 20).toFixed(2);

                tiltContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            tiltContainer.addEventListener('mouseleave', () => {
                tiltContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        })();

        // Slideshow functionality
        (function initSlideshow() {
            const slides = document.querySelectorAll('.slide');
            if (!slides.length) return;

            let currentSlide = 0;

            // Show first slide
            slides[currentSlide].classList.add('active');

            // Function to show next slide
            function showNextSlide() {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }

            // Auto-advance slides every 5 seconds
            setInterval(showNextSlide, 5000);
        })();

        // Reviews Modal functionality
        (function initReviewsModal() {
            const modal = document.getElementById('reviews-modal');
            const modalClose = document.getElementById('modal-close');
            const modalContainer = document.getElementById('modal-reviews-container');
            const readMoreReviewsBtn = document.querySelector('.reviews-cta .btn-primary');
            const mainReviewsGrid = document.getElementById('reviews-grid-main');
            const hiddenReviewsContainer = document.getElementById('hidden-reviews-container');

            if (!modal || !readMoreReviewsBtn) return;

            // Get all reviews (both visible and hidden)
            function getAllReviews() {
                const reviews = [];
                
                // Get reviews from main grid
                const mainReviewCards = mainReviewsGrid.querySelectorAll('.review-card');
                mainReviewCards.forEach(card => {
                    reviews.push(cloneReviewCard(card));
                });

                // Get reviews from hidden container
                if (hiddenReviewsContainer) {
                    const hiddenReviewCards = hiddenReviewsContainer.querySelectorAll('.review-card');
                    hiddenReviewCards.forEach(card => {
                        reviews.push(cloneReviewCard(card));
                    });
                }

                return reviews;
            }

            // Clone review card data
            function cloneReviewCard(card) {
                return card.cloneNode(true);
            }

            // Populate modal with reviews
            function populateModal() {
                const reviews = getAllReviews();
                modalContainer.innerHTML = '';

                reviews.forEach(reviewCard => {
                    modalContainer.appendChild(reviewCard);
                });
            }

            // Open modal
            function openModal() {
                populateModal();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scrolling
            }

            // Close modal
            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // restore scrolling
            }

            // Event listeners
            readMoreReviewsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });

            if (modalClose) {
                modalClose.addEventListener('click', closeModal);
            }

            // Close modal when clicking outside the modal content
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Close modal on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    closeModal();
                }
            });
        })();

        // other DOM initialization (animations, forms, etc.)...
        // ...existing code...

    } catch (err) {
        console.error('Initialization error:', err);
    } finally {
        // ensure loading removed even if initialization throws
        if (loading) loading.style.display = 'none';
    }
});

