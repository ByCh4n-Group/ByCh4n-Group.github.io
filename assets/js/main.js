/**
 * ByCh4n Group - Modern Static Site
 * Dynamic language switching, content loading from JSON
 * Ultra-modern animations and effects
 */

class ByCh4nSite {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = {};
        this.blogPosts = [];
        this.docs = [];
        this.isLoading = true;
        
        this.init();
    }

    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('bych4n-language');
        if (savedLang && ['tr', 'en'].includes(savedLang)) {
            return savedLang;
        }
        
        // Check URL path
        const path = window.location.pathname;
        if (path.startsWith('/en/')) {
            return 'en';
        }
        
        // Check browser language
        const browserLang = navigator.language.slice(0, 2);
        return ['tr', 'en'].includes(browserLang) ? browserLang : 'tr';
    }

    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Load all data
            await Promise.all([
                this.loadTranslations(),
                this.loadBlogPosts(),
                this.loadDocs()
            ]);
            
            // Initialize components
            this.setupNavigation();
            this.setupLanguageSwitcher();
            this.renderContent();
            this.initializeAnimations();
            this.setupScrollEffects();
            
            // Hide loading screen
            setTimeout(() => this.hideLoadingScreen(), 1500);
            
        } catch (error) {
            console.error('Site initialization failed:', error);
            this.hideLoadingScreen();
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            
            // Animate loading bar
            const progressBar = loadingScreen.querySelector('.loading-progress');
            if (progressBar) {
                gsap.to(progressBar, {
                    width: '100%',
                    duration: 1.5,
                    ease: 'power2.out'
                });
            }
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                    this.isLoading = false;
                    // Trigger entry animations
                    this.triggerEntryAnimations();
                }
            });
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch('/data/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback translations
            this.translations = {
                tr: { site: { title: 'ByCh4n Group' } },
                en: { site: { title: 'ByCh4n Group' } }
            };
        }
    }

    async loadBlogPosts() {
        try {
            const response = await fetch('/data/blog-posts.json');
            this.blogPosts = await response.json();
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            this.blogPosts = [];
        }
    }

    async loadDocs() {
        try {
            const response = await fetch('/data/docs.json');
            this.docs = await response.json();
        } catch (error) {
            console.error('Failed to load docs:', error);
            this.docs = [];
        }
    }

    setupNavigation() {
        const navbarToggle = document.getElementById('navbar-toggle');
        const navbarMenu = document.getElementById('navbar-menu');
        
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
                
                // Animate hamburger icon
                const icon = navbarToggle.querySelector('i');
                if (navbarMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navbarMenu.classList.remove('active');
                    navbarToggle.querySelector('i').className = 'fas fa-bars';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!navbarToggle.contains(event.target) && !navbarMenu.contains(event.target)) {
                    navbarMenu.classList.remove('active');
                    navbarToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        }

        // Setup smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
                
                // Hide/show navbar on scroll
                if (window.scrollY > lastScrollY && window.scrollY > 300) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });
    }

    setupLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('[data-lang]');
        languageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });

        // Update active language button
        this.updateLanguageButtons();
    }

    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('bych4n-language', lang);
        
        // Re-render content with new language
        this.renderContent();
        this.updateLanguageButtons();
        
        // Animate language switch
        gsap.fromTo('main', {
            opacity: 0.7,
            y: 20
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    updateLanguageButtons() {
        const languageButtons = document.querySelectorAll('[data-lang]');
        languageButtons.forEach(button => {
            if (button.getAttribute('data-lang') === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    renderContent() {
        const t = this.translations[this.currentLanguage] || this.translations.tr;
        
        // Update document title and meta
        document.title = `${t.site?.title || 'ByCh4n Group'} - ${t.site?.description || 'We Learn Together'}`;
        document.querySelector('meta[name="description"]')?.setAttribute('content', t.site?.description || '');
        document.documentElement.lang = this.currentLanguage;

        // Render navigation
        this.renderNavigation(t);
        
        // Render hero section
        this.renderHero(t);
        
        // Render features
        this.renderFeatures(t);
        
        // Render latest blog posts
        this.renderLatestBlogPosts();
        
        // Render footer
        this.renderFooter(t);
        
        // Update all i18n elements
        this.updateI18nElements(t);
    }

    renderNavigation(t) {
        const brandText = document.querySelector('.brand-text');
        if (brandText) brandText.textContent = t.site?.title || 'ByCh4n Group';

        const navItems = {
            'nav-home': t.nav?.home || 'Ana Sayfa',
            'nav-blog': t.nav?.blog || 'Blog',
            'nav-docs': t.nav?.docs || 'Dökümanlar',
            'nav-projects': t.nav?.projects || 'Projeler',
            'nav-contact': t.nav?.contact || 'İletişim'
        };

        Object.entries(navItems).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = text;
        });
    }

    renderHero(t) {
        const hero = t.hero || {};
        
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const primaryCta = document.querySelector('.btn-primary');
        const secondaryCta = document.querySelector('.btn-secondary');

        if (heroTitle) heroTitle.textContent = hero.title || 'ByCh4n Group';
        if (heroSubtitle) heroSubtitle.textContent = hero.subtitle || 'Birlikte Öğreniyoruz';
        if (heroDescription) heroDescription.textContent = hero.description || '';
        if (primaryCta) primaryCta.textContent = hero.cta?.primary || 'Blog\'u Keşfet';
        if (secondaryCta) secondaryCta.textContent = hero.cta?.secondary || 'Dökümanlar';
    }

    renderFeatures(t) {
        const features = t.features || {};
        const featuresTitle = document.querySelector('.features-title');
        const featuresContainer = document.querySelector('.features-grid');

        if (featuresTitle) featuresTitle.textContent = features.title || 'Neler Yapıyoruz?';

        if (featuresContainer && features.items) {
            featuresContainer.innerHTML = features.items.map(feature => `
                <div class="feature-card" data-aos="fade-up">
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p class="feature-description">${feature.description}</p>
                </div>
            `).join('');
        }
    }

    renderLatestBlogPosts() {
        const blogContainer = document.querySelector('.blog-posts-grid');
        if (!blogContainer) return;

        const latestPosts = this.blogPosts.slice(0, 3);
        blogContainer.innerHTML = latestPosts.map(post => `
            <article class="blog-card" data-aos="fade-up">
                <div class="blog-image">
                    <img src="${post.image || '/assets/images/blog/default.jpg'}" 
                         alt="${post.title[this.currentLanguage]}" loading="lazy">
                    <div class="blog-overlay">
                        <a href="/blog/${post.id}.html" class="btn btn-white btn-sm">
                            ${this.currentLanguage === 'tr' ? 'Devamını Oku' : 'Read More'}
                        </a>
                    </div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${this.formatDate(post.date)}</span>
                        <span class="blog-author">${post.author}</span>
                    </div>
                    <h3 class="blog-title">
                        <a href="/blog/${post.id}.html">${post.title[this.currentLanguage]}</a>
                    </h3>
                    <p class="blog-excerpt">${post.excerpt[this.currentLanguage]}</p>
                    <div class="blog-tags">
                        ${(post.tags || []).slice(0, 3).map(tag => 
                            `<span class="blog-tag">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    renderFooter(t) {
        const footer = t.footer || {};
        const copyright = document.querySelector('.footer-copyright');
        if (copyright) {
            copyright.innerHTML = `© ${new Date().getFullYear()} ByCh4n Group. ${footer.copyright || 'Tüm hakları saklıdır'}.`;
        }
    }

    updateI18nElements(t) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedProperty(t, key);
            if (value) {
                element.textContent = value;
            }
        });
    }

    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString(
            this.currentLanguage === 'tr' ? 'tr-TR' : 'en-US', 
            options
        );
    }

    initializeAnimations() {
        // Initialize particle background
        if (typeof initParticles === 'function') {
            initParticles();
        }

        // Initialize hero 3D background
        if (typeof initHero3D === 'function') {
            initHero3D();
        }

        // Initialize scroll animations
        if (typeof initScrollAnimations === 'function') {
            initScrollAnimations();
        }

        // Initialize hover effects
        if (typeof initHoverEffects === 'function') {
            initHoverEffects();
        }

        // Initialize counters
        if (typeof initCounters === 'function') {
            initCounters();
        }

        // Initialize text animations
        if (typeof initTextAnimations === 'function') {
            initTextAnimations();
        }
    }

    setupScrollEffects() {
        // Parallax effect for hero background
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                const heroBackground = document.querySelector('.hero-background');
                if (heroBackground) {
                    gsap.set(heroBackground, {
                        y: self.progress * 200
                    });
                }
            }
        });

        // Fade in animation for sections
        gsap.utils.toArray('section').forEach(section => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    triggerEntryAnimations() {
        // Animate navbar
        gsap.fromTo('.navbar', {
            y: -100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate hero content
        gsap.timeline({ delay: 0.3 })
            .fromTo('.hero-title', {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            })
            .fromTo('.hero-subtitle', {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .fromTo('.hero-description', {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4')
            .fromTo('.hero-buttons .btn', {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out',
                stagger: 0.1
            }, '-=0.3');
    }
}

// Initialize the site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bych4nSite = new ByCh4nSite();
});

// Legacy function for backward compatibility
function switchLanguage(lang) {
    if (window.bych4nSite) {
        window.bych4nSite.switchLanguage(lang);
    }
}

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Copy Code Button for Code Blocks
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        pre.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
        });
        
        pre.addEventListener('mouseleave', () => {
            button.style.opacity = '0';
        });
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
    });
});

// Search Functionality (if needed)
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchData = [];
        
        // Load search data
        fetch('/search.json')
            .then(response => response.json())
            .then(data => {
                searchData = data;
            });
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            const results = searchData.filter(item => 
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query)
            ).slice(0, 5);
            
            if (results.length > 0) {
                searchResults.innerHTML = results.map(item => `
                    <a href="${item.url}" class="search-result">
                        <h4>${item.title}</h4>
                        <p>${item.excerpt}</p>
                    </a>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<p class="no-results">No results found</p>';
                searchResults.style.display = 'block';
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', initSearch);
