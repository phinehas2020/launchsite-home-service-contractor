document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');

    // Initial check
    if (window.scrollY > 50) header.classList.add('scrolled');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');

            // Toggle icon between menu and x
            const icon = mobileBtn.querySelector('[data-lucide]');
            if (nav.classList.contains('mobile-open')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            window.lucide.createIcons();
        });
    }

    // 4. Reveal Animations
    const animatedElements = document.querySelectorAll(
        '.hero-content, .hero-visual, .service-card, .section-header, .process-text, .process-image, .testimonial-card, .cta-box'
    );

    // Add initial class
    animatedElements.forEach((el, index) => {
        el.classList.add('reveal-up');
        // Stagger delays for siblings in grids
        if (el.classList.contains('service-card')) {
            el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
});
