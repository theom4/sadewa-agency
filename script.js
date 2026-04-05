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

    // ─── i18n Translation Engine ───
    const translations = {
        en: {
            nav_case_studies: 'CASE STUDIES',
            nav_services: 'SERVICES',
            nav_about: 'ABOUT US',
            nav_demo: 'DEMO',
            nav_get_started: 'Get Started',

            hero_title_pre: 'Drive more sales with our ',
            hero_title_accent: 'AI Upsell System',
            hero_btn_demo: 'VIEW DEMO',
            hero_btn_call: 'BOOK A CALL',

            stats_title_pre: 'an AI consulting company with the scope of driving ',
            stats_title_accent: 'more sales',
            stats_title_mid: ' using ',
            stats_card_clients: '20+ Happy B2B Clients',
            stats_card_revenue_label: 'revenue generated by our ai systems',
            stats_card_revenue_text: 'Generated with AI sales to power smarter business strategies.',
            stats_card_calls_label: 'Automated AI calls',
            stats_card_calls_text: 'AI calls run and analyzed monthly.',
            stats_card_ops_label: 'Yearly AI Operations',
            stats_card_ops_text: 'AI operations ran every year globally.',

            pain_title_pre: 'Eliminate the bottlenecks',
            pain_title_accent: 'that hold you back',
            pain_1: 'Teams spend too much time on repetitive tasks.',
            pain_2: 'Data entry errors lead to costly business mistakes.',
            pain_3: 'Leads slip away without consistent follow-up.',
            pain_4: 'Manual reporting takes hours away from strategy.',
            pain_5: 'Scaling operations requires expensive new hiring.',
            pain_6: 'Customers wait too long for basic answers.',
            pain_7: 'Inconsistent communication damages brand trust.',

            services_title_pre: 'Automation solutions',
            services_title_accent: 'that drive results',
            svc1_name: 'Lead Database Reactivation',
            svc1_desc: 'Breathe new life into stagnant leads with automated, intelligent re-engagement campaigns that turn old contacts into fresh opportunities.',
            svc2_name: 'AI Post-purchase Upselling',
            svc2_desc: 'Maximize customer lifetime value with automated, personalized upsells that trigger right after a purchase to drive immediate revenue.',
            svc3_name: 'AI Outreach System',
            svc3_desc: 'Scale your top-of-funnel growth with high-precision, automated outreach that sounds human and delivers consistent replies.',
            svc4_name: 'AI Customer Support',
            svc4_desc: 'Deliver instant, accurate, and empathetic support 24/7, reducing ticket volume and boosting overall satisfaction.',

            cases_title: 'Success stories',
            case1_badge: 'AI SALES AGENT – ROMANIA',
            case1_title: 'AI Upselling Agent',
            case1_sub: '€8,000 generated every month in sales',
            case1_desc: 'Implemented a custom sales agent for a leading skincare shop in Romania, driving significant revenue through intelligent automated upsells and cross-sells.',
            case2_badge: 'VOICE AI – SWITZERLAND',
            case2_title: 'Voice Booking Agent',
            case2_sub: '2,000+ monthly calls handled with 98% accuracy',
            case2_desc: 'Deploying a sophisticated Voice AI that handles 2000+ monthly calls for a premium pest control company in Switzerland with near-human accuracy.',

            pricing_title: 'Choose your plan',
            plan1_label: 'STARTER PLAN',
            plan1_intro: 'Perfect for small teams beginning to explore AI and automation.',
            plan1_f1: 'Strategy consultation',
            plan1_f2: 'Business process mapping',
            plan1_f3: 'Basic AI workflow setup',
            plan1_f4: 'Email support',
            plan2_label: 'GROWTH PLAN',
            plan2_intro: 'Designed for growing companies ready to integrate AI into their operations.',
            plan2_f1: 'Dedicated consultant',
            plan2_f2: 'End-to-end automation setup',
            plan2_f3: 'Predictive analytics dashboards',
            plan2_f4: 'AI-driven reporting & insights',
            plan3_label: 'ENTERPRISE PLAN',
            plan3_intro: 'Custom-built for enterprises seeking full-scale transformation optimization.',
            plan3_price: 'Contact Us',
            plan3_f1: 'Tailored AI implementation roadmap',
            plan3_f2: 'Custom automation architecture',
            plan3_f3: 'Advanced data analytics',
            plan3_f4: '24/7 premium support',
            price_mo: '/month',
            plan_cta: 'GET STARTED',

            footer_newsletter_label: 'Subscribe our newsletter',
            footer_newsletter_placeholder: 'Enter your email',
            footer_newsletter_btn: 'SUBMIT ↗',
            footer_legal: 'Legal',
            footer_terms: 'Terms and Conditions',
            footer_company: 'Company',
            footer_about: 'About us',
            footer_services: 'Services',
            footer_contact: 'Contact',
            footer_resources: 'Resources',
            footer_blog: 'Blog',
            footer_pricing: 'Pricing',
            footer_copy: '© 2026 Nanoassist Agency. All rights reserved.',
        },
        ro: {
            nav_case_studies: 'STUDII DE CAZ',
            nav_services: 'SERVICII',
            nav_about: 'DESPRE NOI',
            nav_demo: 'DEMO',
            nav_get_started: 'Începe Acum',

            hero_title_pre: 'Crește vânzările cu ajutorul ',
            hero_title_accent: 'Sistemului AI de Upsell',
            hero_btn_demo: 'VEZI DEMO',
            hero_btn_call: 'PROGRAMEAZĂ UN APEL',

            stats_title_pre: 'o companie de consultanță AI cu scopul de a genera ',
            stats_title_accent: 'mai multe vânzări',
            stats_title_mid: ' folosind ',
            stats_card_clients: '20+ Clienți B2B Mulțumiți',
            stats_card_revenue_label: 'venituri generate de sistemele noastre AI',
            stats_card_revenue_text: 'Generat prin vânzări AI pentru strategii de afaceri mai inteligente.',
            stats_card_calls_label: 'Apeluri AI automatizate',
            stats_card_calls_text: 'Apeluri AI rulate și analizate lunar.',
            stats_card_ops_label: 'Operațiuni AI Anuale',
            stats_card_ops_text: 'Operațiuni AI rulate în fiecare an la nivel global.',

            pain_title_pre: 'Elimină blocajele',
            pain_title_accent: 'care te țin pe loc',
            pain_1: 'Echipele pierd prea mult timp pe sarcini repetitive.',
            pain_2: 'Erorile de introducere a datelor duc la greșeli costisitoare.',
            pain_3: 'Lead-urile se pierd fără un follow-up constant.',
            pain_4: 'Raportarea manuală consumă ore din timp strategic.',
            pain_5: 'Scalarea operațiunilor necesită angajări costisitoare.',
            pain_6: 'Clienții așteaptă prea mult pentru răspunsuri de bază.',
            pain_7: 'Comunicarea inconsistentă dăunează încrederii în brand.',

            services_title_pre: 'Soluții de automatizare',
            services_title_accent: 'care aduc rezultate',
            svc1_name: 'Reactivare Bază de Date Lead-uri',
            svc1_desc: 'Dă viață nouă lead-urilor inactive cu campanii automate și inteligente de re-engagement care transformă contactele vechi în oportunități noi.',
            svc2_name: 'Upselling Post-cumpărare cu AI',
            svc2_desc: 'Maximizează valoarea pe termen lung a clienților cu upsell-uri personalizate și automate, declanșate imediat după o achiziție.',
            svc3_name: 'Sistem AI de Outreach',
            svc3_desc: 'Scalează creșterea top-of-funnel cu outreach automat, de înaltă precizie, care sună uman și generează răspunsuri consistente.',
            svc4_name: 'Suport Clienți cu AI',
            svc4_desc: 'Oferă suport instant, precis și empatic 24/7, reducând volumul de tichete și îmbunătățind satisfacția generală.',

            cases_title: 'Povești de succes',
            case1_badge: 'AGENT AI DE VÂNZĂRI – ROMÂNIA',
            case1_title: 'Agent AI de Upselling',
            case1_sub: '€8.000 generați lunar din vânzări',
            case1_desc: 'Am implementat un agent de vânzări personalizat pentru un magazin de top de produse cosmetice din România, generând venituri semnificative prin upsell-uri și cross-sell-uri automate.',
            case2_badge: 'VOICE AI – ELVEȚIA',
            case2_title: 'Agent AI de Programări Telefonice',
            case2_sub: 'Peste 2.000 de apeluri lunare gestionate cu 98% acuratețe',
            case2_desc: 'Deployăm un Voice AI sofisticat care gestionează peste 2000 de apeluri lunare pentru o companie premium de pest control din Elveția, cu acuratețe aproape umană.',

            pricing_title: 'Alege planul tău',
            plan1_label: 'PLAN STARTER',
            plan1_intro: 'Perfect pentru echipe mici care încep să exploreze AI și automatizarea.',
            plan1_f1: 'Consultanță strategică',
            plan1_f2: 'Maparea proceselor de business',
            plan1_f3: 'Configurare workflow AI de bază',
            plan1_f4: 'Suport prin email',
            plan2_label: 'PLAN GROWTH',
            plan2_intro: 'Conceput pentru companii în creștere, gata să integreze AI în operațiunile lor.',
            plan2_f1: 'Consultant dedicat',
            plan2_f2: 'Configurare automatizare end-to-end',
            plan2_f3: 'Dashboarduri de analiză predictivă',
            plan2_f4: 'Raportare și insights bazate pe AI',
            plan3_label: 'PLAN ENTERPRISE',
            plan3_intro: 'Construit personalizat pentru întreprinderi care caută o transformare la scară largă.',
            plan3_price: 'Contactează-ne',
            plan3_f1: 'Foaie de parcurs personalizată pentru implementare AI',
            plan3_f2: 'Arhitectură de automatizare personalizată',
            plan3_f3: 'Analiză avansată a datelor',
            plan3_f4: 'Suport premium 24/7',
            price_mo: '/lună',
            plan_cta: 'ÎNCEPE ACUM',

            footer_newsletter_label: 'Abonează-te la newsletter',
            footer_newsletter_placeholder: 'Introdu adresa de email',
            footer_newsletter_btn: 'TRIMITE ↗',
            footer_legal: 'Legal',
            footer_terms: 'Termeni și Condiții',
            footer_company: 'Companie',
            footer_about: 'Despre noi',
            footer_services: 'Servicii',
            footer_contact: 'Contact',
            footer_resources: 'Resurse',
            footer_blog: 'Blog',
            footer_pricing: 'Prețuri',
            footer_copy: '© 2026 Nanoassist Agency. Toate drepturile rezervate.',
        }
    };

    function applyLanguage(lang) {
        const dict = translations[lang];
        if (!dict) return;

        // Swap textContent for all [data-i18n] elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) el.textContent = dict[key];
        });

        // Swap placeholder for inputs
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
        });

        // Update <html lang>
        document.documentElement.lang = lang;
    }

    // ─── Language Toggle Interaction ───
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        // Apply EN on load to set correct label text
        applyLanguage('en');

        langToggle.addEventListener('click', (e) => {
            const options = langToggle.querySelectorAll('.lang-option');
            const clickedOption = e.target.closest('.lang-option');

            if (clickedOption && !clickedOption.classList.contains('active')) {
                options.forEach(opt => opt.classList.remove('active'));
                clickedOption.classList.add('active');

                const lang = clickedOption.getAttribute('data-lang');
                applyLanguage(lang);

                // Bounce animation feedback
                langToggle.style.transform = 'scale(0.95) translateY(-2px)';
                setTimeout(() => {
                    langToggle.style.transform = 'translateY(-2px)';
                }, 100);
            }
        });
    }

});
