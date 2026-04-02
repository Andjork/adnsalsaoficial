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
    function setupCarousel(trackId) {
        const track = document.getElementById(trackId);
        if (!track) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // Auto-scroll Carousels (Optional - lets make it interactive)
    // For now we'll allow horizontal scroll via CSS overflow if preferred, 
    // but the track logic above makes it feel more "app-like" on desktop.
    
    // Ensure CSS allows scrolling
    const tracks = ['track1', 'track2', 'track3'];
    tracks.forEach(id => {
        const t = document.getElementById(id);
        if(t) {
            t.style.overflowX = 'auto';
            t.style.scrollbarWidth = 'none'; // Firefox
            t.style.msOverflowStyle = 'none'; // IE
            t.classList.add('hide-scrollbar');
        }
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
