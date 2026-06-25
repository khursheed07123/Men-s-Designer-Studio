/* ─────────────────────────────────────────
   Men's Designer Studio Vellore — script.js
   ───────────────────────────────────────── */

/* ── DOM READY ── */
/* ─────────────────────────────────────────
   FINAL script.js — COMPLETE DOMContentLoaded
   Replace your existing DOMContentLoaded
   block with this. All 6 steps combined.
   ───────────────────────────────────────── */
 
document.addEventListener('DOMContentLoaded', () => {
 
  /* ── STEP 1: HERO ── */
  initHeroSlideshow();    // rotating landing page images
  initTypewriter();       // typewriter phrases in hero
  initHeroParallax();     // subtle parallax scroll on hero
  initButtonRipple();     // gold ripple on all buttons
 
  /* ── STEP 2: GALLERY & LIGHTBOX ── */
  initGalleryFilter();    // filter with counts + stagger animation
  initLightbox();         // upgraded lightbox with pinch zoom + transitions
 
  /* ── STEP 3: ANIMATIONS ── */
  initScrollReveal();     // enhanced reveal (replaces old one — call only once)
  initTitleShimmer();     // gold shimmer sweep on section titles
  initSectionDividers();  // animated gold dividers between sections
  initServiceTilt();      // 3D tilt on service cards
  initParticleBurst();    // gold particle burst on CTA clicks
 
  /* ── STEP 4: MOBILE ── */
  initMobileMenu();       // upgraded slide-in menu (replaces old one)
  initTestimonialSwipe(); // horizontal scroll + dot indicators
  initIOSScrollFix();     // prevent iOS bounce in modals
  initAutoResizeTextarea(); // textarea grows as you type
  initViewportHeightFix(); // fix 100vh on iOS Safari
  initFocusVisible();     // focus outlines only on keyboard nav
 
  /* ── STEP 5: CONTACT FORM ── */
  initContactForm();      // WhatsApp submit, real-time validation, progress bar
 
  /* ── STEP 6: SEO & PERFORMANCE ── */
  fixBrokenImageSrcs();   // clean stray newlines in img src
  initLazyImages();       // native lazy load + decoding async
  initImageFallbacks();   // graceful placeholder on img error
  initGalleryPreload();   // prefetch adjacent gallery images
  initWillChange();       // add will-change only during hover
  checkSEOAssets();       // dev-only: warns about missing SEO files
 
  /* ── ORIGINAL (keep these) ── */
  initNavbar();           // shrink navbar on scroll
  initSmoothScroll();     // data-scroll buttons
  initStatCounters();     // count-up animation on stats
  initActiveNavLink();    // highlight active nav link on scroll
 
});
 



/* ─────────────────────────────────────────
   1. NAVBAR — shrink on scroll
   ───────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}


/* ─────────────────────────────────────────
   2. MOBILE MENU — open / close
   ───────────────────────────────────────── */
function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
}


/* ─────────────────────────────────────────
   3. SMOOTH SCROLL — data-scroll buttons
   ───────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('data-scroll'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


/* ─────────────────────────────────────────
   4. SCROLL REVEAL — fade-in on scroll
   ───────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings slightly for a cascade effect
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const delay    = siblings.indexOf(entry.target) * 80;

      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   5. STAT COUNTERS — count up on scroll
   ───────────────────────────────────────── */
function initStatCounters() {
  const countUp = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const steps    = 60;
    const stepTime = 1800 / steps;  // 1.8 s total
    let   current  = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = target >= 100
        ? current.toLocaleString() + '+'
        : current;
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────
   6. GALLERY FILTER — show / hide by category
   ───────────────────────────────────────── */
function initGalleryFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('hidden', !match);

        if (match) {
          // Trigger reflow so animation replays each time
          item.style.animation = 'none';
          void item.offsetWidth; // force reflow
          item.style.animation  = 'galleryFadeIn 0.4s ease forwards';
        }
      });
    });
  });
}


/* ─────────────────────────────────────────
   7. LIGHTBOX — full-screen image viewer
   ───────────────────────────────────────── */
function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const closeBtn   = document.getElementById('lightboxClose');
  const prevBtn    = document.getElementById('lightboxPrev');
  const nextBtn    = document.getElementById('lightboxNext');
  const imageWrap  = document.getElementById('lightboxImageWrap');
  const catEl      = document.getElementById('lightboxCat');
  const nameEl     = document.getElementById('lightboxName');
  const counterEl  = document.getElementById('lightboxCounter');

  let currentIndex = 0;
  let visibleItems = [];

  const getVisible = () =>
    Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));

  const open = (index) => {
    visibleItems  = getVisible();
    currentIndex  = index;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeBtn.focus(), 50); // accessibility focus trap
  };

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const render = () => {
    visibleItems = getVisible();
    const item   = visibleItems[currentIndex];
    if (!item) return;

    const name     = item.getAttribute('data-name')     || '';
    const category = item.getAttribute('data-category') || '';
    const emoji    = item.getAttribute('data-emoji')    || '🎽';
    const realImg  = item.querySelector('img');

    imageWrap.innerHTML = '';

    if (realImg) {
      const img = document.createElement('img');
      img.src   = realImg.src;
      img.alt   = name;
      imageWrap.appendChild(img);
    } else {
      imageWrap.innerHTML = `
        <div class="lightbox-placeholder">
          <span class="lightbox-placeholder-emoji">${emoji}</span>
          <span class="lightbox-placeholder-hint">Photo coming soon</span>
        </div>`;
    }

    catEl.textContent     = category.charAt(0).toUpperCase() + category.slice(1);
    nameEl.textContent    = name;
    counterEl.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    prevBtn.disabled      = currentIndex === 0;
    nextBtn.disabled      = currentIndex === visibleItems.length - 1;
  };

  const goNext = () => { if (currentIndex < visibleItems.length - 1) { currentIndex++; render(); } };
  const goPrev = () => { if (currentIndex > 0)                       { currentIndex--; render(); } };

  // Open on gallery item click
  document.getElementById('galleryGrid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item:not(.hidden)');
    if (!item) return;
    visibleItems = getVisible();
    const index  = visibleItems.indexOf(item);
    if (index !== -1) open(index);
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click',  goPrev);
  nextBtn.addEventListener('click',  goNext);

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  }, { passive: true });

  // Re-sync visible items when filter changes
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { visibleItems = getVisible(); });
  });
}


/* ─────────────────────────────────────────
   8. STICKY WHATSAPP — hide near contact
   ───────────────────────────────────────── */
function initStickyWhatsApp() {
  const btn     = document.getElementById('stickyWhatsapp');
  const contact = document.getElementById('contact');
  if (!btn || !contact) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      btn.style.opacity       = entry.isIntersecting ? '0' : '1';
      btn.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      btn.style.transform     = entry.isIntersecting ? 'translateY(20px)' : '';
    });
  }, { threshold: 0.4 });

  observer.observe(contact);
}


/* ─────────────────────────────────────────
   9. CONTACT FORM — validation + submit UX
   ───────────────────────────────────────── */
function initContactForm() {
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const nameInput   = document.getElementById('name');
  const phoneInput  = document.getElementById('phone');
  const occasionSel = document.getElementById('occasion');
  const garmentSel  = document.getElementById('garment');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    clearErrors();
    let valid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name'); valid = false;
    }
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
      showError(phoneInput, 'Please enter a valid phone number'); valid = false;
    }
    if (!occasionSel.value) {
      showError(occasionSel, 'Please select an occasion'); valid = false;
    }
    if (!garmentSel.value) {
      showError(garmentSel, 'Please select a garment type'); valid = false;
    }
    if (!valid) return;

    // Simulate submission (replace with Formspree / EmailJS in production)
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled    = true;

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formSuccess.classList.add('visible');
      setTimeout(resetForm, 5000);
    }, 1200);
  });

  function showError(field, message) {
    field.style.borderColor = '#E24B4A';
    const err = document.createElement('span');
    err.className   = 'field-error';
    err.textContent = message;
    err.style.cssText = `
      display: block;
      font-size: 0.65rem;
      color: #E24B4A;
      margin-top: 0.2rem;
      font-family: var(--font-accent);
      letter-spacing: 0.05em;
    `;
    field.parentElement.appendChild(err);
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    [nameInput, phoneInput, occasionSel, garmentSel].forEach(el => {
      el.style.borderColor = '';
    });
  }

  function resetForm() {
    [nameInput, phoneInput, occasionSel, garmentSel].forEach(el => el.value = '');
    document.getElementById('message').value = '';
    submitBtn.textContent   = 'Send Enquiry';
    submitBtn.disabled      = false;
    submitBtn.style.display = '';
    formSuccess.classList.remove('visible');
    clearErrors();
  }
}


/* ─────────────────────────────────────────
   10. ACTIVE NAV LINK — highlight on scroll
   ───────────────────────────────────────── */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.45 });

  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}


/* ─────────────────────────────────────────
   GLOBAL CSS ANIMATIONS (injected once)
   ───────────────────────────────────────── */
const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes galleryFadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleTag);
/* ─────────────────────────────────────────
   HERO UPGRADES — add inside DOMContentLoaded
   in your script.js
   ───────────────────────────────────────── */
 
function initHeroSlideshow() {
  const slideshow = document.getElementById('heroSlideshow');
  if (!slideshow) return;

  const images = [
    'i1.png',
    'i2.png',
    'i3.png',
    'i4.png',
    'i5.png',
    'i6.png'
  ];

  images.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide${index === 0 ? ' active' : ''}`;
    slide.style.backgroundImage = `url("${src}")`;
    slideshow.appendChild(slide);
  });

  const slides = slideshow.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  let current = 0;
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');

  const updateSlide = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === current);
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + slides.length) % slides.length;
      updateSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % slides.length;
      updateSlide();
    });
  }
}

/* ── A. TYPEWRITER EFFECT ── */
function initTypewriter() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;
 
  const phrases = [
    'Commands the Room',
    'Walks the Aisle',
    'Leads the Boardroom',
    'Makes an Entrance',
  ];
 
  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let loopTimer;
 
  const TYPING_SPEED   = 70;   // ms per char while typing
  const DELETING_SPEED = 35;   // ms per char while deleting
  const PAUSE_END      = 2200; // ms pause at end of phrase
  const PAUSE_START    = 300;  // ms pause before retyping
 
  function tick() {
    const current = phrases[phraseIndex];
 
    if (!isDeleting) {
      // Type one character
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
 
      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        el.classList.add('done');
        loopTimer = setTimeout(() => {
          isDeleting = true;
          el.classList.remove('done');
          tick();
        }, PAUSE_END);
        return;
      }
    } else {
      // Delete one character
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
 
      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        loopTimer = setTimeout(tick, PAUSE_START);
        return;
      }
    }
 
    loopTimer = setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }
 
  // Start after hero animation finishes (1.5s delay)
  setTimeout(tick, 1500);
 
  // Cleanup on page unload (optional — good practice)
  window.addEventListener('beforeunload', () => clearTimeout(loopTimer));
}
 
 
/* ── B. PARALLAX SCROLL on Hero ── */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
 
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
  let ticking = false;
 
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const heroH    = hero.offsetHeight;
 
      if (scrolled > heroH) { ticking = false; return; } // skip when out of view
 
      // Subtle upward drift on hero content
      const content = hero.querySelector('.hero-content');
      const glow    = hero.querySelector('.hero-bg-glow');
      if (content) content.style.transform = `translateY(${scrolled * 0.18}px)`;
      if (glow)    glow.style.transform    = `translateY(${scrolled * 0.08}px)`;
 
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}
 
 
/* ── C. BUTTON RIPPLE EFFECT ── */
function initButtonRipple() {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
 
    btn.addEventListener('click', function (e) {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
 
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}
 
 
/* ── CALL ALL THREE ── */
/* Add these three lines inside your existing DOMContentLoaded callback: */
/*
  initTypewriter();
  initHeroParallax();
  initButtonRipple();
*/
/* ─────────────────────────────────────────
   GALLERY & LIGHTBOX — UPGRADED SCRIPT
   Replace your initGalleryFilter() and
   initLightbox() functions with these.
   ───────────────────────────────────────── */
 
 
/* ─────────────────────────────────────────
   6. GALLERY FILTER (upgraded)
   ───────────────────────────────────────── */
function initGalleryFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const emptyState   = document.getElementById('galleryEmpty');
 
  /* ── Populate filter counts ── */
  const counts = { all: galleryItems.length };
  galleryItems.forEach(item => {
    const cat = item.getAttribute('data-category');
    counts[cat] = (counts[cat] || 0) + 1;
  });
  Object.entries(counts).forEach(([cat, n]) => {
    const el = document.getElementById(`fc-${cat}`);
    if (el) el.textContent = n;
  });
 
  /* ── Filter logic ── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
 
      const filter  = btn.getAttribute('data-filter');
      let   visible = 0;
 
      galleryItems.forEach((item, i) => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
 
        if (match) {
          item.classList.remove('hidden');
          // Staggered fade-in animation
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = `galleryFadeIn 0.38s ease ${i * 35}ms both`;
          visible++;
        } else {
          item.classList.add('hidden');
          item.style.animation = 'none';
        }
      });
 
      // Show/hide empty state
      if (emptyState) {
        emptyState.classList.toggle('visible', visible === 0);
      }
    });
  });
 
  /* ── Keyboard: Enter/Space opens lightbox ── */
  galleryItems.forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}
 
 
/* ─────────────────────────────────────────
   7. LIGHTBOX (upgraded)
   ───────────────────────────────────────── */
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');
  const imageWrap   = document.getElementById('lightboxImageWrap');
  const catEl       = document.getElementById('lightboxCat');
  const nameEl      = document.getElementById('lightboxName');
  const counterEl   = document.getElementById('lightboxCounter');
  const zoomHint    = document.getElementById('lightboxZoomHint');
 
  let currentIndex  = 0;
  let visibleItems  = [];
  let isTransition  = false;
 
  /* ─── Helpers ─── */
  const getVisible = () =>
    Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
 
  const isTouchDevice = () =>
    window.matchMedia('(hover: none)').matches;
 
  /* ─── Open ─── */
  const open = (index) => {
    visibleItems = getVisible();
    currentIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
 
    // Show zoom hint only on touch
    if (zoomHint) {
      zoomHint.classList.toggle('hidden', !isTouchDevice());
      // Auto-hide hint after 3s
      setTimeout(() => zoomHint && zoomHint.classList.add('hidden'), 3000);
    }
 
    setTimeout(() => closeBtn && closeBtn.focus(), 50);
  };
 
  /* ─── Close ─── */
  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();
  };
 
  /* ─── Render current item ─── */
  const render = (direction = 0) => {
    visibleItems = getVisible();
    const item = visibleItems[currentIndex];
    if (!item) return;
 
    const name     = item.getAttribute('data-name')     || '';
    const category = item.getAttribute('data-category') || '';
    const emoji    = item.getAttribute('data-emoji')    || '🎽';
    const realImg  = item.querySelector('img');
 
    // Slide transition
    if (direction !== 0) {
      imageWrap.classList.add('transitioning');
    }
 
    setTimeout(() => {
      imageWrap.innerHTML = '';
      resetZoom();
 
      if (realImg) {
        const img = document.createElement('img');
        img.src   = realImg.src;
        img.alt   = name;
        img.style.cssText = 'width:100%; height:100%; object-fit:contain; display:block; transition:transform 0.3s ease;';
        imageWrap.appendChild(img);
        // Lazy-load fallback
        img.addEventListener('error', () => {
          imageWrap.innerHTML = buildPlaceholder(emoji, name);
        });
      } else {
        imageWrap.innerHTML = buildPlaceholder(emoji, name);
      }
 
      catEl.textContent     = category.charAt(0).toUpperCase() + category.slice(1);
      nameEl.textContent    = name;
      counterEl.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
      prevBtn.disabled      = currentIndex === 0;
      nextBtn.disabled      = currentIndex === visibleItems.length - 1;
 
      imageWrap.classList.remove('transitioning');
      isTransition = false;
    }, direction !== 0 ? 180 : 0);
  };
 
  const buildPlaceholder = (emoji, name) => `
    <div class="lightbox-placeholder">
      <span class="lightbox-placeholder-emoji">${emoji}</span>
      <span class="lightbox-placeholder-hint">Photo coming soon</span>
    </div>`;
 
  /* ─── Navigation ─── */
  const goNext = () => {
    if (isTransition || currentIndex >= visibleItems.length - 1) return;
    isTransition = true;
    currentIndex++;
    render(1);
  };
  const goPrev = () => {
    if (isTransition || currentIndex <= 0) return;
    isTransition = true;
    currentIndex--;
    render(-1);
  };
 
  /* ─── Click on gallery grid ─── */
  document.getElementById('galleryGrid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item:not(.hidden)');
    if (!item) return;
    visibleItems = getVisible();
    const index = visibleItems.indexOf(item);
    if (index !== -1) open(index);
  });
 
  /* ─── Controls ─── */
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
 
  /* ─── Keyboard ─── */
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });
 
  /* ─── Touch swipe ─── */
  let touchStartX = 0;
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
 
  lightbox.addEventListener('touchend', (e) => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    const dy = touchStartY - e.changedTouches[0].clientY;
    // Only swipe if horizontal movement is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx > 0 ? goNext() : goPrev();
    }
  }, { passive: true });
 
  /* ─── Pinch-to-zoom (touch only) ─── */
  let initialPinchDist = 0;
  let currentScale     = 1;
  const MIN_SCALE = 1;
  const MAX_SCALE = 3.5;
 
  const getPinchDist = (e) => {
    const [t1, t2] = [e.touches[0], e.touches[1]];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };
 
  const resetZoom = () => {
    currentScale = 1;
    const img = imageWrap.querySelector('img');
    if (img) img.style.transform = 'scale(1)';
    imageWrap.classList.remove('zoomed');
  };
 
  imageWrap.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialPinchDist = getPinchDist(e);
    }
  }, { passive: false });
 
  imageWrap.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist  = getPinchDist(e);
      const delta = dist / initialPinchDist;
      currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentScale * delta));
      initialPinchDist = dist;
 
      const img = imageWrap.querySelector('img');
      if (img) img.style.transform = `scale(${currentScale})`;
      imageWrap.classList.toggle('zoomed', currentScale > 1.05);
    }
  }, { passive: false });
 
  imageWrap.addEventListener('touchend', () => {
    if (currentScale < 1.1) resetZoom();
  });
 
  /* Double-tap to reset zoom */
  let lastTap = 0;
  imageWrap.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) { resetZoom(); }
    lastTap = now;
  });
 
  /* ─── Re-sync on filter change ─── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { visibleItems = getVisible(); });
  });
}
/* ─────────────────────────────────────────
   ANIMATIONS & EFFECTS — UPGRADED SCRIPT
   Add these functions to your script.js
   and call them inside DOMContentLoaded
   ───────────────────────────────────────── */
 
 
/* ══════════════════════════════════════════
   A. GOLD SHIMMER ON SECTION TITLES
   ══════════════════════════════════════════ */
function initTitleShimmer() {
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
 
      // Small delay so it fires after the reveal animation
      setTimeout(() => {
        el.classList.add('shimmer-active');
        // Remove after animation so it doesn't persist as clipped text
        el.addEventListener('animationend', () => {
          el.classList.remove('shimmer-active');
        }, { once: true });
      }, 300);
 
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
 
  titles.forEach(t => observer.observe(t));
}
 
 
/* ══════════════════════════════════════════
   B. ENHANCED SCROLL REVEAL
   (replaces initScrollReveal — more control)
   ══════════════════════════════════════════ */
function initScrollReveal() {
  // Add directional classes to specific elements
  const aboutImg  = document.querySelector('.about-img');
  const aboutText = document.querySelector('.about-text');
  if (aboutImg)  { aboutImg.classList.remove('reveal');  aboutImg.classList.add('reveal-left');  }
  if (aboutText) { aboutText.classList.remove('reveal'); aboutText.classList.add('reveal-right'); }
 
  // Scale reveal for badges and stat items
  document.querySelectorAll('.badge, .stat').forEach(el => {
    el.classList.add('reveal-scale');
  });
 
  // Observe ALL reveal variants
  const allReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
 
      const el       = entry.target;
      const siblings = Array.from(
        el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      );
      const delay = siblings.indexOf(el) * 90;
 
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
 
  allReveal.forEach(el => observer.observe(el));
}
 
 
/* ══════════════════════════════════════════
   C. CURSOR TRAIL (desktop only)
   ══════════════════════════════════════════ */
function initCursorTrail() {
  // Skip on touch devices or reduced motion
  if (
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) return;
 
  // Create cursor elements
  const main = document.createElement('div');
  main.className = 'cursor-dot cursor-dot-main';
  const ring = document.createElement('div');
  ring.className = 'cursor-dot cursor-dot-ring';
  document.body.append(main, ring);
 
  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;
 
  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    main.style.left = `${mouseX}px`;
    main.style.top  = `${mouseY}px`;
  }, { passive: true });
 
  // Smooth ring follow
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    rafId = requestAnimationFrame(animateRing);
  };
  rafId = requestAnimationFrame(animateRing);
 
  // Expand on hoverable elements
  const hoverEls = 'a, button, .gallery-item, .service-card, .testimonial-card, .filter-btn, .nav-cta';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
 
  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => {
    main.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    main.style.opacity = '1';
    ring.style.opacity = '1';
  });
 
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
}
 
 
/* ══════════════════════════════════════════
   D. SECTION DIVIDERS
   (inject + animate between sections)
   ══════════════════════════════════════════ */
function initSectionDividers() {
  // Insert a divider between each top-level section
  const sections = document.querySelectorAll('body > section.section, body > .stats-bar');
  sections.forEach((sec, i) => {
    if (i === 0) return; // skip before first section
    const divider = document.createElement('div');
    divider.className = 'section-divider';
    sec.parentElement.insertBefore(divider, sec);
  });
 
  // Animate dividers in when they enter the viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
 
  document.querySelectorAll('.section-divider').forEach(d => observer.observe(d));
}
 
 
/* ══════════════════════════════════════════
   E. SERVICE CARD — TILT on mouse move
   ══════════════════════════════════════════ */
function initServiceTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
      const dy    = (e.clientY - cy) / (rect.height / 2); // -1 to 1
      const tiltX = dy * -5;  // max 5deg
      const tiltY = dx *  5;
 
      card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
 
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), border-color 0.25s, box-shadow 0.25s, background 0.25s';
    });
  });
}
 
 
/* ══════════════════════════════════════════
   F. GOLD PARTICLE BURST on CTA click
   ══════════════════════════════════════════ */
function initParticleBurst() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
  const COLORS = ['#C9A84C', '#F0C040', '#E8B84B', '#D4A017'];
 
  const burst = (x, y) => {
    const COUNT = 12;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      const angle  = (i / COUNT) * Math.PI * 2;
      const speed  = 40 + Math.random() * 50;
      const size   = 3 + Math.random() * 4;
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
 
      p.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        left: ${x}px;
        top:  ${y}px;
        width:  ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        transform: translate(-50%, -50%);
        transition: transform 0.55s ease-out, opacity 0.55s ease-out;
      `;
      document.body.appendChild(p);
 
      requestAnimationFrame(() => {
        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;
        p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.2)`;
        p.style.opacity   = '0';
      });
 
      p.addEventListener('transitionend', () => p.remove(), { once: true });
    }
  };
 
  // Trigger on primary CTA buttons only
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      burst(e.clientX, e.clientY);
    });
  });
}
 
 
/* ══════════════════════════════════════════
   CALL ALL NEW FUNCTIONS
   Add these inside your DOMContentLoaded:
   ══════════════════════════════════════════ */
/*
  initTitleShimmer();
  initScrollReveal();      // replaces old initScrollReveal()
  initSectionDividers();
  initServiceTilt();
  initParticleBurst();
*/
/* ─────────────────────────────────────────
   MOBILE EXPERIENCE — UPGRADED SCRIPT
   Replace initMobileMenu() with the new
   version, and add the other functions.
   Call all of them in DOMContentLoaded.
   ───────────────────────────────────────── */
 
 
/* ══════════════════════════════════════════
   A. MOBILE MENU (upgraded)
   Replace old initMobileMenu()
   ══════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');
 
  if (!hamburger || !mobileMenu) return;
 
  // Inject footer into mobile menu if not already there
  if (!mobileMenu.querySelector('.mobile-menu-footer')) {
    mobileMenu.insertAdjacentHTML('beforeend', `
      <div class="mobile-menu-footer">
        <a href="#contact" class="mobile-menu-cta mobile-link">Book a Consultation</a>
        <div class="mobile-menu-social">
          <a href="https://instagram.com/mens_designer_studio_vellore"
             class="social-link" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
          <a href="https://wa.me/916379535934"
             class="social-link" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
        </div>
      </div>
    `);
  }
 
  // Upgrade close button styles (swap old ✕ button)
  if (mobileClose) {
    mobileClose.className = 'mobile-close-btn';
    mobileClose.setAttribute('aria-label', 'Close menu');
  }
 
  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
    // Focus first link for accessibility
    const firstLink = mobileMenu.querySelector('a');
    if (firstLink) setTimeout(() => firstLink.focus(), 400);
  };
 
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  };
 
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'mobileMenu');
 
  hamburger.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
 
  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  // Also close new footer CTA
  mobileMenu.querySelectorAll('.mobile-menu-cta').forEach(el =>
    el.addEventListener('click', closeMenu)
  );
 
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
 
  // Swipe right to close menu
  let touchStartX = 0;
  mobileMenu.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  mobileMenu.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 60) closeMenu(); // swipe right closes
  }, { passive: true });
}
 
 
/* ══════════════════════════════════════════
   B. TESTIMONIALS — swipe + dot indicators
   ══════════════════════════════════════════ */
function initTestimonialSwipe() {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;
 
  // Only activate on mobile
  if (!window.matchMedia('(max-width: 768px)').matches) return;
 
  const cards = Array.from(grid.querySelectorAll('.testimonial-card'));
  if (cards.length < 2) return;
 
  // Inject dot container after the grid
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'testimonials-dots';
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testimonials-dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(dot);
  });
  grid.parentElement.insertAdjacentElement('afterend', dotsContainer);
 
  const dots = Array.from(dotsContainer.querySelectorAll('.testimonials-dot'));
 
  // Update dots on scroll
  const updateDots = () => {
    const scrollLeft  = grid.scrollLeft;
    const cardWidth   = cards[0].offsetWidth + 12; // card + gap
    const activeIndex = Math.round(scrollLeft / cardWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
  };
 
  grid.addEventListener('scroll', updateDots, { passive: true });
 
  // Scroll to card programmatically
  const scrollToCard = (index) => {
    const cardWidth = cards[0].offsetWidth + 12;
    grid.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };
}
 
 
/* ══════════════════════════════════════════
   C. PREVENT iOS BOUNCE SCROLL in modals
   ══════════════════════════════════════════ */
function initIOSScrollFix() {
  // Prevent body scroll bounce when lightbox or mobile menu is open
  const lockTargets = [
    document.getElementById('lightbox'),
    document.getElementById('mobileMenu'),
  ].filter(Boolean);
 
  lockTargets.forEach(el => {
    el.addEventListener('touchmove', (e) => {
      // Allow scroll inside scrollable children
      if (e.target === el) e.preventDefault();
    }, { passive: false });
  });
}
 
 
/* ══════════════════════════════════════════
   D. FORM — auto-resize textarea on mobile
   ══════════════════════════════════════════ */
function initAutoResizeTextarea() {
  const textarea = document.getElementById('message');
  if (!textarea) return;
 
  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
 
  textarea.addEventListener('input', resize);
 
  // Reset on form clear (called from resetForm in contact logic)
  textarea.addEventListener('reset-height', () => {
    textarea.style.height = '';
  });
}
 
 
/* ══════════════════════════════════════════
   E. VIEWPORT HEIGHT FIX (mobile browsers)
   Fixes the infamous 100vh issue on iOS
   ══════════════════════════════════════════ */
function initViewportHeightFix() {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
 
  setVH();
  window.addEventListener('resize', setVH, { passive: true });
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 200); // slight delay after orientation change
  });
}
 
/* Usage: in CSS, replace `100vh` with `calc(var(--vh, 1vh) * 100)` */
/* The hero section already uses min-height: 100vh — update it to: */
/* .hero { min-height: calc(var(--vh, 1vh) * 100); } */
 
 
/* ══════════════════════════════════════════
   F. FOCUS VISIBLE POLYFILL
   Better keyboard focus only (not on touch)
   ══════════════════════════════════════════ */
function initFocusVisible() {
  let usingMouse = false;
 
  document.addEventListener('mousedown', () => { usingMouse = true; });
  document.addEventListener('keydown',   () => { usingMouse = false; });
 
  document.addEventListener('focusin', (e) => {
    if (usingMouse) {
      e.target.setAttribute('data-focus-mouse', '');
    } else {
      e.target.removeAttribute('data-focus-mouse');
    }
  });
}
 
/* In CSS, add this to remove outlines on mouse focus: */
/* [data-focus-mouse]:focus { outline: none !important; } */
 
 
/* ══════════════════════════════════════════
   CALL ALL NEW FUNCTIONS
   In your DOMContentLoaded:
   ══════════════════════════════════════════ */
/*
  initMobileMenu();           // replaces old initMobileMenu()
  initTestimonialSwipe();
  initIOSScrollFix();
  initAutoResizeTextarea();
  initViewportHeightFix();
  initFocusVisible();
*/
/* ─────────────────────────────────────────
   CONTACT FORM — UPGRADED SCRIPT
   Replace your existing initContactForm()
   with this version in script.js
   ───────────────────────────────────────── */
 
function initContactForm() {
 
  /* ── Element refs ── */
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');
  const formReset    = document.getElementById('formReset');
  const progressBar  = document.getElementById('formProgressBar');
  const charCounter  = document.getElementById('charCounter');
 
  const nameInput    = document.getElementById('name');
  const phoneInput   = document.getElementById('phone');
  const occasionSel  = document.getElementById('occasion');
  const garmentSel   = document.getElementById('garment');
  const messageArea  = document.getElementById('message');
 
  if (!submitBtn) return;
 
  const REQUIRED_FIELDS = [nameInput, phoneInput, occasionSel, garmentSel];
  const PHONE_NUMBER    = '916379535934'; // WhatsApp number
 
  /* ════════════════════════════════════════
     VALIDATORS
  ════════════════════════════════════════ */
  const validators = {
    name(val) {
      if (!val.trim())          return { ok: false, msg: 'Please enter your name' };
      if (val.trim().length < 2) return { ok: false, msg: 'Name is too short' };
      return { ok: true, msg: '✓ Looks good' };
    },
    phone(val) {
      const digits = val.replace(/\D/g, '');
      if (!val.trim())    return { ok: false, msg: 'Please enter your phone number' };
      if (digits.length < 8)  return { ok: false, msg: 'Phone number too short' };
      if (digits.length > 15) return { ok: false, msg: 'Phone number too long' };
      return { ok: true, msg: '✓ Valid number' };
    },
    occasion(val) {
      if (!val) return { ok: false, msg: 'Please select an occasion' };
      return { ok: true, msg: '' };
    },
    garment(val) {
      if (!val) return { ok: false, msg: 'Please select a garment type' };
      return { ok: true, msg: '' };
    },
  };
 
  /* ════════════════════════════════════════
     FIELD STATE HELPERS
  ════════════════════════════════════════ */
  const setFieldState = (input, state, msg = '') => {
    const group   = input.closest('.form-group');
    const msgEl   = group.querySelector('.field-msg');
    if (!group) return;
 
    group.classList.remove('is-valid', 'is-error');
    if (state === 'valid')   group.classList.add('is-valid');
    if (state === 'error')   group.classList.add('is-error');
    if (msgEl) msgEl.textContent = msg;
  };
 
  const clearFieldState = (input) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('is-valid', 'is-error');
    const msgEl = group.querySelector('.field-msg');
    if (msgEl) msgEl.textContent = '';
  };
 
  /* ════════════════════════════════════════
     PROGRESS BAR
  ════════════════════════════════════════ */
  const updateProgress = () => {
    if (!progressBar) return;
    const filled = REQUIRED_FIELDS.filter(f => f && f.value.trim()).length;
    const pct    = (filled / REQUIRED_FIELDS.length) * 100;
    progressBar.style.width = `${pct}%`;
  };
 
  /* ════════════════════════════════════════
     REAL-TIME VALIDATION
  ════════════════════════════════════════ */
 
  // Name — validate on blur, clear on focus
  nameInput.addEventListener('blur', () => {
    const result = validators.name(nameInput.value);
    setFieldState(nameInput, result.ok ? 'valid' : 'error', result.msg);
  });
  nameInput.addEventListener('focus', () => clearFieldState(nameInput));
  nameInput.addEventListener('input', updateProgress);
 
  // Phone — auto-format + validate on blur
  phoneInput.addEventListener('input', (e) => {
    let val    = e.target.value.replace(/[^\d+\s\-()]/g, '');
    e.target.value = val;
    updateProgress();
  });
  phoneInput.addEventListener('blur', () => {
    const result = validators.phone(phoneInput.value);
    setFieldState(phoneInput, result.ok ? 'valid' : 'error', result.msg);
  });
  phoneInput.addEventListener('focus', () => clearFieldState(phoneInput));
 
  // Selects — validate on change
  occasionSel.addEventListener('change', () => {
    const result = validators.occasion(occasionSel.value);
    setFieldState(occasionSel, result.ok ? 'valid' : 'error', result.msg);
    updateProgress();
  });
  garmentSel.addEventListener('change', () => {
    const result = validators.garment(garmentSel.value);
    setFieldState(garmentSel, result.ok ? 'valid' : 'error', result.msg);
    updateProgress();
  });
 
  /* ════════════════════════════════════════
     CHARACTER COUNTER for textarea
  ════════════════════════════════════════ */
  if (messageArea && charCounter) {
    const MAX = parseInt(messageArea.getAttribute('maxlength') || '500', 10);
 
    const updateCounter = () => {
      const len  = messageArea.value.length;
      charCounter.textContent = `${len} / ${MAX}`;
      charCounter.classList.remove('near-limit', 'at-limit');
      if (len >= MAX)          charCounter.classList.add('at-limit');
      else if (len >= MAX * 0.8) charCounter.classList.add('near-limit');
 
      // Auto-resize height
      messageArea.style.height = 'auto';
      messageArea.style.height = `${messageArea.scrollHeight}px`;
    };
 
    messageArea.addEventListener('input', updateCounter);
  }
 
  /* ════════════════════════════════════════
     URL-PARAM PREFILL
     e.g. site.com/?occasion=wedding&garment=sherwani
  ════════════════════════════════════════ */
  const params = new URLSearchParams(window.location.search);
  if (params.get('occasion') && occasionSel) {
    occasionSel.value = params.get('occasion');
    updateProgress();
  }
  if (params.get('garment') && garmentSel) {
    garmentSel.value = params.get('garment');
    updateProgress();
  }
 
  /* ════════════════════════════════════════
     SERVICE CARD → PREFILL GARMENT
     Clicking a service card auto-selects garment
  ════════════════════════════════════════ */
  const serviceMap = {
    'Wedding Suits':   'wedding-suit',
    'Sherwani':        'sherwani',
    'Corporate Suits': 'corporate-suit',
    'Blazers':         'blazer',
    'Indo-Western':    'indo-western',
    'Shirts & Trousers': 'shirt-trouser',
  };
 
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const title   = card.querySelector('h3')?.textContent?.trim();
      const mapKey  = Object.keys(serviceMap).find(k => title && title.includes(k.split(' ')[0]));
      if (mapKey && garmentSel) {
        garmentSel.value = serviceMap[mapKey];
        garmentSel.dispatchEvent(new Event('change'));
        updateProgress();
        // Scroll to contact
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
 
  /* ════════════════════════════════════════
     BUILD WHATSAPP MESSAGE
  ════════════════════════════════════════ */
  const buildWhatsAppURL = () => {
    const name     = nameInput.value.trim();
    const phone    = phoneInput.value.trim();
    const occasion = occasionSel.options[occasionSel.selectedIndex]?.text || '';
    const garment  = garmentSel.options[garmentSel.selectedIndex]?.text  || '';
    const message  = messageArea?.value.trim() || '';
 
    const text = [
      `Hi! I'd like to book a consultation at Men's Designer Studio.`,
      ``,
      `👤 Name: ${name}`,
      `📱 Phone: ${phone}`,
      `🎉 Occasion: ${occasion}`,
      `👔 Garment: ${garment}`,
      message ? `📝 Notes: ${message}` : '',
    ].filter(Boolean).join('\n');
 
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  };
 
  /* ════════════════════════════════════════
     SUBMIT
  ════════════════════════════════════════ */
  submitBtn.addEventListener('click', () => {
    // Validate all required fields
    let valid = true;
 
    const checks = [
      { field: nameInput,   key: 'name'    },
      { field: phoneInput,  key: 'phone'   },
      { field: occasionSel, key: 'occasion'},
      { field: garmentSel,  key: 'garment' },
    ];
 
    checks.forEach(({ field, key }) => {
      const result = validators[key](field.value);
      setFieldState(field, result.ok ? 'valid' : 'error', result.msg);
      if (!result.ok) valid = false;
    });
 
    if (!valid) {
      // Scroll to first error
      const firstError = document.querySelector('.form-group.is-error input, .form-group.is-error select');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
 
    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
 
    // Short delay for UX feel, then open WhatsApp
    setTimeout(() => {
      const url = buildWhatsAppURL();
      window.open(url, '_blank', 'noopener,noreferrer');
 
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
 
      // Show success
      const formWrap = document.getElementById('contactFormWrap');
      if (formWrap) {
        Array.from(formWrap.children).forEach(child => {
          if (child.id !== 'formSuccess') child.style.display = 'none';
        });
      }
      if (formSuccess) formSuccess.classList.add('visible');
    }, 800);
  });
 
  /* ════════════════════════════════════════
     RESET
  ════════════════════════════════════════ */
  if (formReset) {
    formReset.addEventListener('click', resetForm);
  }
 
  function resetForm() {
    // Hide success, show form
    if (formSuccess) formSuccess.classList.remove('visible');
 
    const formWrap = document.getElementById('contactFormWrap');
    if (formWrap) {
      Array.from(formWrap.children).forEach(child => {
        child.style.display = '';
      });
    }
 
    // Clear values
    [nameInput, phoneInput, occasionSel, garmentSel].forEach(f => {
      if (f) f.value = '';
      clearFieldState(f);
    });
    if (messageArea)  {
      messageArea.value  = '';
      messageArea.style.height = '';
    }
    if (charCounter)  charCounter.textContent = '0 / 500';
    if (progressBar)  progressBar.style.width = '0%';
  }
 
  // Initial progress update
  updateProgress();
}
