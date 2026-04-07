document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect & Mobile Menu Logic
    const header = document.getElementById('header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksA = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            mobileNavToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : ''; // Lock scrolling
        });

        // Close menu on link click
        navLinksA.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Reveal Animations on Scroll
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Simple Carousel Logic
    // 3. Enhanced Carousel & Video Hover Logic
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function setupCarousel(trackId, dotsId) {
        const track = document.getElementById(trackId);
        const dotsContainer = document.getElementById(dotsId);
        if (!track) return;

        const items = track.querySelectorAll('.carousel-item');
        if (items.length === 0) return;

        let isDown = false;
        let isPaused = false;
        let isProgrammaticScroll = false;
        let startX;
        let scrollLeft;
        let scrollInterval;
        let scrollTimeout;

        // Generate dots
        if (dotsContainer) {
            items.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    const itemWidth = items[0].offsetWidth + 30;
                    isProgrammaticScroll = true;
                    track.scrollTo({
                        left: index * itemWidth,
                        behavior: 'smooth'
                    });
                    setTimeout(() => { isProgrammaticScroll = false; }, 1000);
                });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const itemWidth = items[0].offsetWidth + 30;
            const scrollPos = track.scrollLeft;
            const activeIndex = Math.round(scrollPos / itemWidth);
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex % items.length);
            });
        };

        // Sync dots on scroll
        track.addEventListener('scroll', () => {
            updateDots();

            // Only pause if the scroll was initiated by the user (not by auto-scroll)
            if (!isProgrammaticScroll) {
                isPaused = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isPaused = false;
                }, 4000); // Resume after 4s of inactivity
            }
        });

        // Slide-by-slide Auto Scroll
        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!isDown && !isPaused) {
                    const itemWidth = items[0].offsetWidth + 30;
                    const maxScroll = track.scrollWidth - track.offsetWidth;

                    isProgrammaticScroll = true;

                    if (track.scrollLeft >= maxScroll - 10) {
                        track.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: itemWidth, behavior: 'smooth' });
                    }

                    // Reset flag after animation completes
                    setTimeout(() => {
                        isProgrammaticScroll = false;
                    }, 1000);
                }
            }, 5000); // Change slide every 5 seconds
        };

        startAutoScroll();

        // Desktop Hover Pause
        track.parentElement.addEventListener('mouseenter', () => { isPaused = true; });
        track.parentElement.addEventListener('mouseleave', () => { isPaused = false; });

        // Desktop Dragging logic
        if (!isTouchDevice) {
            track.addEventListener('mousedown', (e) => {
                isDown = true;
                isPaused = true;
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
                track.style.scrollBehavior = 'auto';
            });

            track.addEventListener('mouseleave', () => { isDown = false; });
            track.addEventListener('mouseup', () => {
                isDown = false;
                track.style.scrollBehavior = 'smooth';
                // Delay resume
                setTimeout(() => { isPaused = false; }, 2000);
            });

            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 2;
                track.scrollLeft = scrollLeft - walk;
            });
        }
    }

    // Initialize Enhanced Carousels
    setupCarousel('track-events', 'dots-events');
    setupCarousel('track-allied', 'dots-allied');
    setupCarousel('track-emisora', 'dots-emisora');
    setupCarousel('track-patrocinadores', 'dots-patrocinadores');

    // Video Hover Logic for "Nuestros Eventos"
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const video = card.querySelector('video');

        card.addEventListener('mouseenter', () => {
            card.classList.add('video-active');
            if (video) {
                video.muted = false; // Enable sound on hover
                video.play().catch(e => {
                    // Browsers block unmuted play without previous interaction
                    console.warn("Autoplay with sound blocked, playing muted", e);
                    video.muted = true;
                    video.play();
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('video-active');
            if (video) {
                video.pause();
                video.muted = true; // Re-mute for next time
            }
        });
    });

    // 4. Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'ENVIANDO...';
            btn.disabled = true;

            setTimeout(() => {
                alert('¡Gracias por unirte a ADN Salsa! Pronto nos pondremos en contacto contigo.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // 5. Membership Modal Logic
    const modalOverlay = document.getElementById('membership-modal');
    const closeModalIcon = document.getElementById('close-modal');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (modalOverlay) {
        const openModal = (e) => {
            e.preventDefault();
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        };

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
        };

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', openModal);
        });

        if (closeModalIcon) {
            closeModalIcon.addEventListener('click', closeModal);
        }

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Smooth Scroll for Navigation Links (Excluding modal triggers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || this.classList.contains('modal-trigger')) return; // Let modal logic handle it

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
