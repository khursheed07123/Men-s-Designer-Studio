/* ─────────────────────────────────────────
   Men's Designer Studio Vellore — script.js
   ───────────────────────────────────────── */

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initStatCounters();
  initGalleryFilter();
  initLightbox();
  initStickyWhatsApp();
  initContactForm();
  initActiveNavLink();
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
