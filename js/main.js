/* =======================================
   MAIN.JS — Portfolio Interactivity
   GSAP Animations + Canvas + All Logic
   ======================================= */

'use strict';

/* ── Register GSAP Plugins ── */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ── Utility ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ════════════════════════════════════════
   1. PRELOADER
════════════════════════════════════════ */
(function initPreloader() {
  const fill = $('#preloader-fill');
  const preloader = $('#preloader');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';

      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            initHeroAnimations();
          }
        });
      }, 400);
    }
    fill.style.width = progress + '%';
  }, 60);
})();

/* ════════════════════════════════════════
   2. HERO CANVAS — Particle Field
════════════════════════════════════════ */
(function initCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size  = Math.random() * 1.8 + 0.4;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      const colors = ['rgba(94,234,212,', 'rgba(129,140,248,', 'rgba(244,114,182,'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.1;
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= dx * force * 0.04;
        this.y -= dy * force * 0.04;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(94,234,212,${0.08 * (1 - dist/130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w * h / 10000), 120);
    particles = Array.from({length: count}, () => new Particle());
    animate();
  }

  window.addEventListener('resize', () => { resize(); particles.forEach(p => p.reset()); });
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('load', init);
})();

/* ════════════════════════════════════════
   3. HERO ANIMATIONS
════════════════════════════════════════ */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to('.hero-profile-avatar', { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' })
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    .to('#name-line-1', { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
    .to('#name-line-2', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.hero-scroll-hint', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.hero-stats', { opacity: 1, duration: 0.8 }, '-=0.3');

  /* Typewriter for tagline */
  const words = [
    'scalable backends.',
    'modern web apps.',
    '.NET solutions.',
    'RESTful APIs.',
    'clean code.'
  ];
  let wordIdx = 0;
  const dynamicEl = $('#tagline-dynamic');
  if (dynamicEl) {
    function typeWord() {
      const word = words[wordIdx % words.length];
      gsap.to(dynamicEl, {
        duration: word.length * 0.07,
        text: word,
        ease: 'none',
        onComplete: () => {
          setTimeout(() => {
            gsap.to(dynamicEl, {
              duration: 0.4,
              opacity: 0,
              onComplete: () => {
                dynamicEl.textContent = '';
                dynamicEl.style.opacity = 1;
                wordIdx++;
                typeWord();
              }
            });
          }, 2200);
        }
      });
    }
    setTimeout(typeWord, 1200);
  }

  /* Stat counters */
  $$('.stat-number').forEach(el => {
    const target = +el.dataset.target;
    gsap.to(el, {
      innerHTML: target,
      duration: 2,
      delay: 1.5,
      ease: 'power2.out',
      snap: { innerHTML: 1 },
      onUpdate() { el.textContent = Math.floor(+el.innerHTML); }
    });
  });
}

/* ════════════════════════════════════════
   4. NAVBAR
════════════════════════════════════════ */
(function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    updateActiveNav();
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* Active nav highlight */
  function updateActiveNav() {
    const sections = $$('section[id]');
    let current = '';
    sections.forEach(s => {
      const top = s.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.5) current = s.id;
    });
    $$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* Smooth scroll for all internal links */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ════════════════════════════════════════
   5. CUSTOM CURSOR
════════════════════════════════════════ */
(function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = $$('a, button, .skill-tag, .project-card, .contact-chip, .achievement-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovered');
      follower.classList.add('is-hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovered');
      follower.classList.remove('is-hovered');
    });
  });
})();

/* ════════════════════════════════════════
   6. SCROLL ANIMATIONS (GSAP ScrollTrigger)
════════════════════════════════════════ */
(function initScrollAnimations() {

  /* Section headers */
  $$('.section-tag').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
    });
  });

  $$('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.1
    });
  });

  /* About section */
  gsap.from('.about-card-wrap', {
    scrollTrigger: { trigger: '.about', start: 'top 70%' },
    opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.4)'
  });

  gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-content', start: 'top 75%' },
    opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: 'power2.out'
  });

  gsap.from('.about-info-grid', {
    scrollTrigger: { trigger: '.about-info-grid', start: 'top 80%' },
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out'
  });

  gsap.from('.contact-chip', {
    scrollTrigger: { trigger: '.about-links', start: 'top 85%' },
    opacity: 0, y: 15, duration: 0.5, stagger: 0.1, ease: 'power2.out'
  });

  /* Skill categories */
  $$('.skill-category').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, y: 40, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
    });
  });

  /* Proficiency bars — animate on enter */
  ScrollTrigger.create({
    trigger: '.proficiency-section',
    start: 'top 80%',
    onEnter: () => {
      $$('.prof-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });

  gsap.from('.proficiency-section', {
    scrollTrigger: { trigger: '.proficiency-section', start: 'top 80%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out'
  });

  /* Timeline */
  gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '.timeline', start: 'top 75%' },
    opacity: 0, x: 40, duration: 0.8, ease: 'power3.out'
  });

  gsap.from('.timeline-line', {
    scrollTrigger: { trigger: '.timeline', start: 'top 80%' },
    scaleY: 0, duration: 1.2, ease: 'power2.out', transformOrigin: 'top center'
  });

  /* Projects */
  $$('.project-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, y: 50, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
    });
  });

  /* Achievements */
  $$('.achievement-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      opacity: 0, scale: 0.9, y: 30, duration: 0.7, delay: i * 0.15, ease: 'back.out(1.2)'
    });
  });

  /* Contact */
  gsap.from('.contact-intro', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
    opacity: 0, y: 30, duration: 0.7, ease: 'power2.out'
  });

  $$('.contact-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: '.contact-cards', start: 'top 80%' },
      opacity: 0, x: -30, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
    });
  });

  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
    opacity: 0, x: 30, duration: 0.8, ease: 'power3.out'
  });

  /* Footer */
  gsap.from('.footer-inner > *', {
    scrollTrigger: { trigger: '.footer', start: 'top 90%' },
    opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power2.out'
  });

})();

/* ════════════════════════════════════════
   7. PARALLAX EFFECTS
════════════════════════════════════════ */
(function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroContent = $('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
    }
  }, { passive: true });
})();

/* ════════════════════════════════════════
   8. CONTACT FORM
════════════════════════════════════════ */
window.handleFormSubmit = async function(e) {
  e.preventDefault();
  const btn = $('#form-submit');
  const btnText = $('#btn-text');
  const success = $('#form-success');
  const form = $('#contact-form');

  btnText.textContent = 'Sending...';
  btn.disabled = true;

  const data = {
    name:    $('#form-name').value.trim(),
    email:   $('#form-email').value.trim(),
    subject: $('#form-subject') ? $('#form-subject').value.trim() : '',
    message: $('#form-message').value.trim(),
  };

  try {
    const res = await fetch('https://formspree.io/f/mykadbgz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      success.classList.add('show');
      form.reset();
      setTimeout(() => { success.classList.remove('show'); }, 5000);
    } else {
      const json = await res.json();
      throw new Error(json?.errors?.[0]?.message || 'Server error');
    }
  } catch (err) {
    btnText.textContent = 'Send Message';
    btn.disabled = false;
    // Show error in the success element with a different style
    success.textContent = '❌ Failed to send. Please try again or email directly.';
    success.style.background = 'rgba(239,68,68,0.15)';
    success.style.borderColor = 'rgba(239,68,68,0.3)';
    success.style.color = '#f87171';
    success.classList.add('show');
    setTimeout(() => {
      success.classList.remove('show');
      success.textContent = '';
      success.style = '';
    }, 5000);
  }
};

/* ════════════════════════════════════════
   9. MAGNETIC BUTTONS
════════════════════════════════════════ */
(function initMagnetic() {
  $$('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

/* ════════════════════════════════════════
   10. SKILL TAG HOVER GLOW
════════════════════════════════════════ */
(function initSkillTags() {
  $$('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      gsap.to(tag, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
    });
    tag.addEventListener('mouseleave', () => {
      gsap.to(tag, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    });
  });
})();

/* ════════════════════════════════════════
   11. PAGE SECTION PROGRESS INDICATOR
════════════════════════════════════════ */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #5eead4, #818cf8);
    z-index: 600;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ════════════════════════════════════════
   12. TILT EFFECT ON PROJECT CARDS
════════════════════════════════════════ */
(function initTilt() {
  $$('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -5;
      const rotY = ((x - cx) / cx) * 5;
      gsap.to(card, {
        rotationX: rotX,
        rotationY: rotY,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
})();
