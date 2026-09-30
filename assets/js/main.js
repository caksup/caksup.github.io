// ============================================
// main.js | 30/09/2026 • 14:28:00 |
// JEC - JAGAT EDUCATION CENTER - MAIN JS
// SPA-like Interactions, Lazy Load, Slider
// ============================================

(function() {
  'use strict';

  // -------------------------------------------
  // 1. HEADER SCROLL EFFECT
  // -------------------------------------------
  const header = document.getElementById('jec-header');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  // -------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // -------------------------------------------
  const menuToggle = document.getElementById('jec-menu-toggle');
  const navMenu = document.getElementById('jec-nav');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('.material-icons');
      icon.textContent = navMenu.classList.contains('open') ? 'close' : 'menu';
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.jec-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.querySelector('.material-icons').textContent = 'menu';
      });
    });
  }

  // -------------------------------------------
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // -------------------------------------------
  document.querySelectorAll('a[href^="#"], .jec-scroll-to').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Update active nav
          document.querySelectorAll('.jec-nav-link').forEach(l => l.classList.remove('active'));
          const navLink = document.querySelector(`.jec-nav-link[data-section="${href.substring(1)}"]`);
          if (navLink) navLink.classList.add('active');
        }
      }
    });
  });

  // -------------------------------------------
  // 4. ACTIVE NAV ON SCROLL (SPA-like)
  // -------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.jec-nav-link');
  
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // -------------------------------------------
  // 5. HERO SLIDER / CAROUSEL
  // -------------------------------------------
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDots = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  
  if (sliderTrack && sliderDots) {
    const slides = sliderTrack.querySelectorAll('.jec-slider__slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;
    
    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'jec-slider__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      sliderDots.appendChild(dot);
    });
    
    const dots = sliderDots.querySelectorAll('.jec-slider__dot');
    
    function goToSlide(index) {
      currentSlide = index;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    function nextSlide() {
      goToSlide((currentSlide + 1) % totalSlides);
    }
    
    function prevSlide() {
      goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
    
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 4500);
    }
    
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }
    
    startAutoPlay();
    
    // Pause on hover
    const slider = document.getElementById('heroSlider');
    slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    slider.addEventListener('mouseleave', startAutoPlay);
  }

  // -------------------------------------------
  // 6. REVEAL ANIMATION (Intersection Observer)
  // -------------------------------------------
  const revealElements = document.querySelectorAll('.jec-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // -------------------------------------------
  // 7. ENHANCED LAZY LOAD WITH FADE-IN
  // -------------------------------------------
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Already has src via native lazy load, just add class when loaded
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          if (img.complete) {
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // -------------------------------------------
  // 8. BACK TO TOP
  // -------------------------------------------
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------
  // 9. INITIAL STATE
  // -------------------------------------------
  handleScroll();
  updateActiveNav();

})();
