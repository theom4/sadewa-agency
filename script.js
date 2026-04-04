/* ═══════════════════════════════════════════════════════════════
   SADEWA — Interactive Scripts
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Scroll Reveal Observer ───
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // ─── Bottlenecks Sticky Scroll Stagger ───
    const painSection = document.getElementById('pain-points');
    const painCards = document.querySelectorAll('.pain-card');
    
    if (painSection && painCards.length > 0) {
        painCards.forEach((card, i) => {
            // Store the initial rotation from CSS
            const style = window.getComputedStyle(card);
            const matrix = new WebKitCSSMatrix(style.transform);
            const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180/Math.PI));
            card.dataset.rot = angle || 0;
            
            card.style.opacity = '0';
            card.style.transform = `translateY(60px) scale(0.9) rotate(${card.dataset.rot}deg)`;
            card.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        window.addEventListener('scroll', () => {
            const rect = painSection.getBoundingClientRect();
            const scrollDistance = painSection.offsetHeight - window.innerHeight;
            
            let progress = 0;
            if (rect.top <= 0) {
                progress = Math.min(1, Math.abs(rect.top) / scrollDistance);
            }
            
            painCards.forEach((card, i) => {
                const threshold = (i * 0.12) + 0.05;
                const rot = card.dataset.rot;
                
                if (progress > threshold) {
                    card.style.opacity = '1';
                    card.style.transform = `translateY(0) scale(1) rotate(${rot}deg)`;
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = `translateY(60px) scale(0.9) rotate(${rot}deg)`;
                    card.style.pointerEvents = 'none';
                }
            });
        });
    }

    // Pain title
    const painTitle = document.querySelector('.pain-title');
    if (painTitle) revealObserver.observe(painTitle);

    // Approach steps
    document.querySelectorAll('.approach-step').forEach(step => {
        revealObserver.observe(step);
    });

    // General animate-on-scroll elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Sticky Header ───
    const header = document.getElementById('site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 40) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
            header.classList.add('scrolled');
        } else {
            header.style.boxShadow = 'none';
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ─── Mobile Menu Toggle ───
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileBtn.classList.toggle('active');
        });

        // Close nav on link click
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileBtn.classList.remove('active');
            });
        });
    }

    // ─── Pricing Toggle ───
    const toggleMonthly = document.getElementById('toggle-monthly');
    const toggleYearly = document.getElementById('toggle-yearly');
    const priceAmounts = document.querySelectorAll('.price-amount');

    function setPricing(type) {
        if (type === 'monthly') {
            toggleMonthly.classList.add('active');
            toggleYearly.classList.remove('active');
            priceAmounts.forEach(el => {
                el.textContent = `$${el.dataset.monthly}`;
            });
        } else {
            toggleYearly.classList.add('active');
            toggleMonthly.classList.remove('active');
            priceAmounts.forEach(el => {
                el.textContent = `$${el.dataset.yearly}`;
            });
        }
    }

    if (toggleMonthly && toggleYearly) {
        toggleMonthly.addEventListener('click', () => setPricing('monthly'));
        toggleYearly.addEventListener('click', () => setPricing('yearly'));
    }

    // ─── Smooth Scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Parallax subtle effect on hero 3D image ───
    const hero3d = document.getElementById('hero-3d');
    if (hero3d) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            hero3d.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        }, { passive: true });
    }

    // ─── Counter Animation for Case Study Stats ───
    const statValues = document.querySelectorAll('.stat-value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statObserver.observe(stat));

    function animateCounter(el) {
        const text = el.textContent;
        const numMatch = text.match(/[\d.]+/);
        if (!numMatch) return;

        const num = parseFloat(numMatch[0]);
        const prefix = text.split(numMatch[0])[0];
        const suffix = text.split(numMatch[0])[1];
        const isDecimal = text.includes('.');
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = num * eased;

            if (isDecimal && !text.includes('M')) {
                el.textContent = `${prefix}${current.toFixed(0)}${suffix}`;
            } else if (text.includes('M')) {
                el.textContent = `${prefix}${current.toFixed(1)}${suffix}`;
            } else {
                el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = text;
            }
        }

        requestAnimationFrame(update);
    }

    // ─── Service cards stagger animation ───
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                serviceObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        serviceObserver.observe(card);
    });



    // ─── Pricing cards stagger ───
    const pricingCards = document.querySelectorAll('.pricing-card');
    const pricingObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 150);
                pricingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    pricingCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        pricingObserver.observe(card);
    });

    // ─── Case study cards reveal ───
    const caseCards = document.querySelectorAll('.case-study-card');
    const caseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                caseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    caseCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        caseObserver.observe(card);
    });

    // ─── Tech stack items reveal ───
    const techItems = document.querySelectorAll('.tech-item');
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    techItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        techObserver.observe(item);
    });

    // ─── Comparison table reveal ───
    const compTable = document.querySelector('.comparison-table');
    if (compTable) {
        const compObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    compTable.style.opacity = '1';
                    compTable.style.transform = 'scale(1)';
                    compObserver.unobserve(compTable);
                }
            });
        }, { threshold: 0.2 });

        compTable.style.opacity = '0';
        compTable.style.transform = 'scale(0.95)';
        compTable.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        compObserver.observe(compTable);
    }

    // ─── CTA reveal ───
    const ctaContent = document.getElementById('cta-content');
    if (ctaContent) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ctaContent.style.opacity = '1';
                    ctaContent.style.transform = 'translateY(0)';
                    ctaObserver.unobserve(ctaContent);
                }
            });
        }, { threshold: 0.2 });

        ctaContent.style.opacity = '0';
        ctaContent.style.transform = 'translateY(40px)';
        ctaContent.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        ctaObserver.observe(ctaContent);
    }

    // ─── Language Toggle Interaction ───
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            const options = langToggle.querySelectorAll('.lang-option');
            const clickedOption = e.target.closest('.lang-option');
            
            if (clickedOption && !clickedOption.classList.contains('active')) {
                options.forEach(opt => opt.classList.remove('active'));
                clickedOption.classList.add('active');
                
                // Add a small scale animation feedback
                langToggle.style.transform = 'scale(0.95) translateY(-2px)';
                setTimeout(() => {
                    langToggle.style.transform = 'translateY(-2px)';
                }, 100);
            }
        });
    }

});
