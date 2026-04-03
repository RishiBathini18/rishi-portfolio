/* =============================================
   RISHI PORTFOLIO — script.js
   Features: Navbar scroll, mobile menu,
             scroll-reveal, form validation
   ============================================= */

/* ── 1. NAVBAR: Add .scrolled class on scroll ─── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run once on load


/* ── 2. MOBILE HAMBURGER MENU ─────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});


/* ── 3. SCROLL-REVEAL ANIMATION ───────────────── */
// Elements with class "reveal" animate in when they
// enter the viewport using IntersectionObserver.

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing to save resources
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,      // Trigger when 12% is visible
    rootMargin: '0px 0px -40px 0px' // Slight offset from bottom
  }
);

revealElements.forEach(el => revealObserver.observe(el));


/* ── 4. ACTIVE NAV LINK HIGHLIGHTING ─────────── */
// Highlights the nav link whose section is in view

const sections  = document.querySelectorAll('section[id]');
const allLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  },
  {
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height')) || 72}px 0px -60% 0px`
  }
);

sections.forEach(sec => sectionObserver.observe(sec));

// Style the active link via JS (dynamic — no extra CSS class in stylesheet)
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link:not(.nav-cta) { color: var(--text-primary) !important; }
.nav-links a.active-link:not(.nav-cta)::after { width: 100% !important; }`;
document.head.appendChild(style);


/* ── 5. CONTACT FORM VALIDATION & SUBMISSION ──── */
const contactForm  = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
const formSuccess  = document.getElementById('formSuccess');

// Helper: show/clear error
function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (message) {
    input.classList.add('invalid');
    error.textContent = message;
  } else {
    input.classList.remove('invalid');
    error.textContent = '';
  }
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live validation: clear error as user types
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    const errorId = id + 'Error';
    const el = document.getElementById(id);
    if (el && document.getElementById(errorId)) {
      el.classList.remove('invalid');
      document.getElementById(errorId).textContent = '';
    }
  });
});

// Form submit
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;

  // Name validation
  if (!name) {
    setError('name', 'nameError', 'Please enter your name.');
    isValid = false;
  } else {
    setError('name', 'nameError', '');
  }

  // Email validation
  if (!email) {
    setError('email', 'emailError', 'Please enter your email.');
    isValid = false;
  } else if (!isValidEmail(email)) {
    setError('email', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  } else {
    setError('email', 'emailError', '');
  }

  // Message validation
  if (!message) {
    setError('message', 'messageError', 'Please write a message.');
    isValid = false;
  } else if (message.length < 15) {
    setError('message', 'messageError', 'Message must be at least 15 characters.');
    isValid = false;
  } else {
    setError('message', 'messageError', '');
  }

  if (!isValid) return;

  // Simulate async form submission
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending...';
  submitBtn.querySelector('.btn-icon').textContent = '⏳';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    submitBtn.querySelector('.btn-icon').textContent = '→';
    formSuccess.classList.add('show');
    contactForm.reset();

    // Hide success after 5 seconds
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});


/* ── 6. SMOOTH SCROLL POLYFILL (for older browsers) ── */
// Modern browsers handle this via CSS scroll-behavior,
// but this JS fallback handles edge cases.

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
    ) || 72;

    const top = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 7. TYPING EFFECT on hero subtitle (optional flair) ── */
(function typeEffect() {
  const roles = [
    'CSE Student | Web Developer',
    'Frontend Enthusiast',
    'Full-Stack Builder',
    'Open-Source Contributor',
  ];

  const el = document.querySelector('.hero-subtitle');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentText = '';

  function type() {
    const fullText = roles[roleIndex];

    if (isDeleting) {
      currentText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      currentText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }

    el.textContent = currentText;

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === fullText.length) {
      // Pause at end, then start deleting
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start the typing effect after initial animation settles
  setTimeout(type, 1200);
})();


/* ── 8. STAT COUNTER ANIMATION ───────────────── */
// Animates the numbers in the About stats when they scroll into view

function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = Math.ceil(target / (duration / 16));

  function update() {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start < target) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent; // e.g. "15+"
        const num = parseInt(raw);
        const suffix = raw.replace(/[0-9]/g, ''); // "+"
        animateCounter(el, num, suffix);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => counterObserver.observe(el));