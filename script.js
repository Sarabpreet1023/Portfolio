/**
 * SARABPREET SINGH – PORTFOLIO JAVASCRIPT
 * Features:
 *  - Custom cursor tracking
 *  - Navbar scroll behaviour + active section highlighting
 *  - Intersection Observer reveal animations
 *  - Counter number animations
 *  - Skill bar animations
 *  - Mobile nav toggle
 *  - Contact form handler
 *  - Scroll progress indicator
 */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot  = document.getElementById('cursor-dot');

if (cursorGlow && cursorDot) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth glow follows with lerp
  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .skill-pill, .stat-card, .contact-card, .project-card, .award-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
  });
}

/* ============================================================
   2. NAVBAR – SCROLL & ACTIVE SECTION
   ============================================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  // Scrolled style
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link based on section in view
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ============================================================
   3. MOBILE NAV TOGGLE
   ============================================================ */
const navToggle  = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');

if (navToggle && navLinksEl) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   4. SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #9b59f5, #22d3ee);
  z-index: 2000;
  width: 0%;
  transition: width 0.1s;
  transform-origin: left;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
}, { passive: true });

/* ============================================================
   5. INTERSECTION OBSERVER – REVEAL ANIMATIONS
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Trigger hero elements immediately
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
      el.classList.add('in-view');
    });
  }, 100);
});

/* ============================================================
   6. COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counterEl = entry.target.querySelector('.stat-number[data-count]');
        if (counterEl) animateCounter(counterEl);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-card').forEach(card => {
  counterObserver.observe(card);
});

/* ============================================================
   7. SKILL BAR ANIMATION
   ============================================================ */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar-fill[data-width]');
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + '%';
          }, i * 150);
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.proficiency-bars').forEach(el => barObserver.observe(el));

/* ============================================================
   8. CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      formStatus.style.color = '#ff6b6b';
      formStatus.textContent = '⚠️ Please fill in all fields.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.style.color = '#ff6b6b';
      formStatus.textContent = '⚠️ Please enter a valid email address.';
      return;
    }

    const submitBtn = document.getElementById('form-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formStatus.textContent = '';

    // Simulate network delay (replace with actual API call if needed)
    await new Promise(resolve => setTimeout(resolve, 1500));

    formStatus.style.color = '#22d3ee';
    formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
    contactForm.reset();
    submitBtn.textContent = 'Send Message ✈️';
    submitBtn.disabled = false;

    // Clear status after a few seconds
    setTimeout(() => { formStatus.textContent = ''; }, 6000);
  });
}

/* ============================================================
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================================
   10. TILT EFFECT ON PROJECT CARDS
   ============================================================ */
function addTilt(el) {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(8px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => { el.style.transition = ''; }, 500);
  });
}

// Only on desktop
if (window.innerWidth > 1024) {
  document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(addTilt);
}

/* ============================================================
   11. PARTICLE / STAR BACKGROUND IN HERO
   ============================================================ */
(function createParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-particles';
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, randomParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(155, 89, 245, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ============================================================
   12. TYPED TEXT EFFECT IN HERO SUBTITLE
   ============================================================ */
(function typedEffect() {
  const el = document.querySelector('.hero-subtitle');
  if (!el) return;

  const texts = [
    'Full Stack Developer · .NET Enthusiast · Computer Vision Explorer',
    'ASP.NET MVC · SQL Server · LINQ Optimizer',
    'React Frontend · Node.js · REST API Builder',
    'OpenCV · 92% Accuracy · 30 FPS Real-time'
  ];

  let textIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    const current = texts[textIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { deleting = true; pause = false; type(); }, 2500);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        textIdx = (textIdx + 1) % texts.length;
      }
    }

    if (!pause) {
      setTimeout(type, deleting ? 30 : 60);
    }
  }

  // Start after a short delay so the reveal animation can fire
  setTimeout(type, 1200);
})();

console.log('%c 👨‍💻 Sarabpreet Singh – Portfolio', 'font-size: 16px; font-weight: bold; color: #9b59f5;');
console.log('%c sandhusarabpreet2310@gmail.com', 'color: #22d3ee;');
