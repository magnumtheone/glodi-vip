/**
 * Glodi VIP - Premium Interactions & Animations
 * Advanced JavaScript for luxury hotel website
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  
  const revealElements = document.querySelectorAll('[class*="scroll-reveal"]');
  
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementBottom = el.getBoundingClientRect().bottom;
      
      if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
        el.classList.add('visible');
      } else {
        el.classList.remove('visible');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();

  // ========================================
  // PARALLAX EFFECT
  // ========================================
  
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      let scrollPosition = window.pageYOffset;
      element.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
  }, { passive: true });

  // ========================================
  // SMOOTH SCROLL FOR ANCHORS
  // ========================================
  
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

  // ========================================
  // COUNTER ANIMATION
  // ========================================
  
  function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(interval);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // ========================================
  // INTERACTIVE CARDS
  // ========================================
  
  const cards = document.querySelectorAll('.luxury-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-12px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ========================================
  // FORM VALIDATION & SUBMISSION
  // ========================================
  
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Show success message
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', data);
        submitBtn.textContent = '✅ Envoyé avec succès!';
        submitBtn.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          this.reset();
        }, 2000);
      }, 1500);
    });
  });

  // ========================================
  // DARK MODE TOGGLE
  // ========================================
  
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon') || document.getElementById('icon-sun');
  const moonIcon = document.getElementById('moonIcon') || document.getElementById('icon-moon');
  const html = document.documentElement;

  function updateThemeIcons(theme) {
    if (!sunIcon || !moonIcon) return;

    if (theme === 'dark') {
      sunIcon.classList.add('hidden');
      sunIcon.classList.remove('block');
      moonIcon.classList.remove('hidden');
      moonIcon.classList.add('block');
    } else {
      sunIcon.classList.remove('hidden');
      sunIcon.classList.add('block');
      moonIcon.classList.add('hidden');
      moonIcon.classList.remove('block');
    }
  }

  // Prevent duplicate listeners from multiple script blocks
  if (themeToggle && !themeToggle.dataset.themeBound) {
    themeToggle.dataset.themeBound = 'true';
    themeToggle.addEventListener('click', () => {
      const isDark = html.classList.contains('dark');

      if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
      }
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    updateThemeIcons('dark');
  } else {
    html.classList.remove('dark');
    updateThemeIcons('light');
  }

  // ========================================
  // NAVIGATION HIGHLIGHT
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // ========================================
  // LAZY LOAD IMAGES
  // ========================================
  
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ========================================
  // FLOATING BUTTON (CTA)
  // ========================================
  
  const ctaButton = document.querySelector('a[href="#contact"]');
  
  if (ctaButton) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const elementHeight = window.innerHeight;
      
      if (scrollTop > elementHeight * 0.5) {
        ctaButton.classList.add('sticky-cta');
      } else {
        ctaButton.classList.remove('sticky-cta');
      }
    }, { passive: true });
  }

  // ========================================
  // MOBILE MENU
  // ========================================
  
  const menuBtn = document.querySelector('[aria-controls="mobileMenu"]');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // ========================================
  // ANALYTICS & TRACKING
  // ========================================
  
  // Track button clicks
  document.querySelectorAll('a[href*="tel:"], a[href*="mailto:"], a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      console.log('Contact action:', link.href);
    });
  });

  // ========================================
  // PERFORMANCE MONITORING
  // ========================================
  
  if ('PerformanceObserver' in window) {
    try {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('Performance:', entry.name, entry.duration);
        }
      });
      
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      console.log('Performance monitoring not available');
    }
  }

  // ========================================
  // ACCESSIBILITY ENHANCEMENTS
  // ========================================
  
  // Focus visible for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  console.log('✨ Glodi VIP Premium Scripts Loaded Successfully!');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Smoothly scroll to element
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Debounce function for performance
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Add animation to element
 */
function animateElement(element, animationName, duration = 600) {
  element.style.animation = `${animationName} ${duration}ms ease-out`;
  
  setTimeout(() => {
    element.style.animation = '';
  }, duration);
}
