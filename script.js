document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    let lastScrollY = window.scrollY;
    
    function updateScrollBackground() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            if (currentTheme === 'dark') {
                nav.style.background = 'rgba(17, 24, 39, 0.98)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
            }
        } else {
            if (currentTheme === 'dark') {
                nav.style.background = 'rgba(17, 24, 39, 0.95)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        updateScrollBackground();
        
        if (currentScrollY > 100) {
            nav.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        
        updateActiveNavLink();
    }
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    document.querySelectorAll('.cta-button[href^="#"], .cta-button-outline[href^="#"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    window.addEventListener('scroll', handleScroll);
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.achievement-card, .work-card, .skill-category, .skill-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const workImage = this.querySelector('.work-image');
            workImage.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            const workImage = this.querySelector('.work-image');
            workImage.style.transform = 'scale(1)';
        });
        
        const workImage = card.querySelector('.work-image');
        workImage.style.transition = 'transform 0.3s ease';
    });
    
    const achievementNumbers = document.querySelectorAll('.achievement-number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                let numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                
                let currentValue = 0;
                const increment = Math.ceil(numericValue / 50);
                const duration = 1500;
                const stepTime = duration / (numericValue / increment);
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    
                    let displayValue = currentValue.toString();
                    if (isPlus && currentValue === numericValue) displayValue += '+';
                    if (isPercentage && currentValue === numericValue) displayValue += '%';
                    if (finalValue.includes('年')) displayValue += '年';
                    
                    target.textContent = displayValue;
                }, stepTime);
                
                numberObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    achievementNumbers.forEach(number => {
        numberObserver.observe(number);
    });
    
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard) {
        floatingCard.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        floatingCard.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'translateY(-10px) scale(1)';
        });
    }
    
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        ticking = false;
        requestTick();
    });
    
    updateActiveNavLink();
    
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
    
    if (!themeIcon) {
        console.error('Theme icon not found');
        return;
    }
    
    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('theme') || 'light';
    } catch (e) {
        console.warn('localStorage access denied:', e);
    }
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('localStorage write denied:', e);
        }
        
        updateThemeIcon(newTheme);
        
        updateScrollBackground();
    }
    
    themeToggle.addEventListener('click', toggleTheme);
});