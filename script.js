document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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
    const tracks = ['track1', 'track2'];
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

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
