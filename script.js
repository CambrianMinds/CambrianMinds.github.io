/* ============================================================
   Cambrian Minds — Interactive Experience Controller
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. STARFIELD / PARTICLE CANVAS
  // ============================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.baseColor = Math.random() > 0.4 ? '255, 255, 255' : '96, 165, 250';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 14000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    const animateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
  }


  // ============================================================
  // 2. FLOATING PILL NAVBAR & GLIDER
  // ============================================================
  const navGlider = document.getElementById('nav-glider');
  const navButtons = document.querySelectorAll('.nav-btn');

  function updateNavGlider(activeSectionId) {
    if (!navGlider) return;
    let activeBtn = null;
    navButtons.forEach(btn => {
      const target = btn.getAttribute('data-target');
      if (target === activeSectionId) {
        activeBtn = btn;
        btn.classList.add('text-white');
        btn.classList.remove('text-gray-300');
      } else {
        btn.classList.remove('text-white');
        btn.classList.add('text-gray-300');
      }
    });

    if (activeBtn) {
      navGlider.style.opacity = '1';
      navGlider.style.left = `${activeBtn.offsetLeft}px`;
      navGlider.style.top = `${activeBtn.offsetTop}px`;
      navGlider.style.width = `${activeBtn.offsetWidth}px`;
      navGlider.style.height = `${activeBtn.offsetHeight}px`;
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }


  // ============================================================
  // 3. TOP TERMINAL PROGRESS BAR & TELEMETRY
  // ============================================================
  const topProgressBar = document.getElementById('top-progress-bar');
  const mainHeader = document.getElementById('main-header');
  const progressBar = document.getElementById('top-progress-fill');
  const progressPercentText = document.getElementById('top-progress-percent');
  const progressRemainingText = document.getElementById('top-progress-remaining');
  const progressSectionName = document.getElementById('top-progress-section');

  const sections = [
    { id: 'intro', label: 'intro' },
    { id: 'about', label: 'about' },
    { id: 'skills', label: 'skills' },
    { id: 'projects', label: 'projects' },
    { id: 'experience', label: 'experience' },
    { id: 'contact', label: 'contact' }
  ];

  const updateScrollProgress = () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / maxScroll) * 100))) : 0;

    // Toggle Header vs Top Progress Bar based on scroll threshold
    if (scrollY > 200) {
      if (mainHeader) {
        mainHeader.style.opacity = '0';
        mainHeader.style.pointerEvents = 'none';
      }
      if (topProgressBar) {
        topProgressBar.style.opacity = '1';
        topProgressBar.style.transform = 'translateY(0)';
        topProgressBar.style.pointerEvents = 'auto';
      }
    } else {
      if (mainHeader) {
        mainHeader.style.opacity = '1';
        mainHeader.style.pointerEvents = 'auto';
      }
      if (topProgressBar) {
        topProgressBar.style.opacity = '0';
        topProgressBar.style.transform = 'translateY(-100%)';
        topProgressBar.style.pointerEvents = 'none';
      }
    }

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPercentText) progressPercentText.textContent = `${pct}%`;
    if (progressRemainingText) {
      const rem = 100 - pct;
      progressRemainingText.textContent = `${rem}% remaining`;
    }

    // Cumulative path matching Example: {intro}{about}{skills_
    let activeIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          activeIndex = i;
        }
      }
    }

    let path = '';
    for (let i = 0; i < activeIndex; i++) {
      path += `{${sections[i].label}}`;
    }
    path += `{${sections[activeIndex].label}_`;

    if (progressSectionName) {
      progressSectionName.textContent = path;
    }

    // Update active nav link & glider
    updateNavGlider(sections[activeIndex].label);
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();


  // ============================================================
  // 4. TYPEWRITER EFFECT
  // ============================================================
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = [
      'Terminal Toolsmith',
      'Civic Technologist',
      'Systems Engineer',
      'Epistemic Telemetry Engineer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function tick() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 45;
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2200; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before new phrase
      }

      setTimeout(tick, typeSpeed);
    }
    tick();
  }


  // ============================================================
  // 5. INTERACTIVE SKILLS TAB SWITCHER
  // ============================================================
  const tabTriggers = document.querySelectorAll('[data-tab-trigger]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetTab = trigger.getAttribute('data-tab-trigger');

      // Update triggers
      tabTriggers.forEach(t => {
        const isActive = t === trigger;
        t.setAttribute('data-state', isActive ? 'active' : 'inactive');
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
          t.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
          t.classList.remove('text-muted-foreground');
        } else {
          t.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
          t.classList.add('text-muted-foreground');
        }
      });

      // Update panels
      tabPanels.forEach(panel => {
        const isMatch = panel.getAttribute('data-tab-panel') === targetTab;
        if (isMatch) {
          panel.removeAttribute('hidden');
          panel.setAttribute('data-state', 'active');
          panel.classList.remove('hidden');
        } else {
          panel.setAttribute('hidden', '');
          panel.setAttribute('data-state', 'inactive');
          panel.classList.add('hidden');
        }
      });
    });
  });


  // ============================================================
  // 6. CUSTOM SPINNING EYE CURSOR FOLLOWER IN PROJECTS
  // ============================================================
  const cursorFollower = document.getElementById('cursor-follower');
  const projectCards = document.querySelectorAll('.project-preview-card, .project-showcase-card');
  const projectsSection = document.getElementById('projects');

  if (cursorFollower && projectsSection) {
    window.addEventListener('mousemove', e => {
      cursorFollower.style.left = `${e.clientX}px`;
      cursorFollower.style.top = `${e.clientY}px`;
    });

    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        cursorFollower.style.opacity = '1';
      });
      card.addEventListener('mouseleave', () => {
        cursorFollower.style.opacity = '0';
      });
    });

    projectsSection.addEventListener('mouseleave', () => {
      cursorFollower.style.opacity = '0';
    });
  }


  // ============================================================
  // 7. SMOOTH SCROLL FOR ANCHORS & CTAS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Contact form simulated send
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || '';
      const email = document.getElementById('contact-email')?.value || '';
      const subject = document.getElementById('contact-subject')?.value || 'Inquiry';
      const msg = document.getElementById('contact-message')?.value || '';

      const mailtoUrl = `mailto:contact@cambrianminds.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + msg)}`;
      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.textContent = "Thank you! Opening mail client...";
        formStatus.classList.remove('hidden');
      }
    });
  }


  // ============================================================
  // 8. ERROR 404 INTRO SPLASH ANIMATION
  // ============================================================
  const introSplash = document.getElementById('intro-splash');
  const introTextBox = document.getElementById('intro-text-box');
  const introWordsContainer = document.getElementById('intro-words-container');
  const skipIntroBtn = document.getElementById('skip-intro');

  if (introSplash && introWordsContainer) {
    const introWords = ['ERROR', '404:', 'Conventional', 'developer', 'not', 'found.'];
    let introFinished = false;
    let timeoutIds = [];

    // Create word spans
    introWords.forEach(wordText => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = wordText;
      introWordsContainer.appendChild(span);
    });

    const finishIntro = () => {
      if (introFinished) return;
      introFinished = true;
      timeoutIds.forEach(id => clearTimeout(id));
      introSplash.classList.add('fading-out');
      setTimeout(() => {
        introSplash.style.display = 'none';
        triggerInitialScrambles();
      }, 1000);
    };

    // Skip handlers
    introSplash.addEventListener('click', finishIntro);
    if (skipIntroBtn) skipIntroBtn.addEventListener('click', finishIntro);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        finishIntro();
      }
    });

    // Start word-by-word reveal sequence
    const wordElements = introWordsContainer.querySelectorAll('.word');
    wordElements.forEach((el, index) => {
      const tid = setTimeout(() => {
        if (!introFinished) {
          el.classList.add('visible');
        }
      }, 350 * (index + 1));
      timeoutIds.push(tid);
    });

    // Glitch animation with cyan/magenta aberration after all words appear
    const glitchDelay = 350 * (wordElements.length + 1) + 200;
    const glitchTid = setTimeout(() => {
      if (!introFinished && introTextBox) {
        introTextBox.classList.add('glitching');
      }
    }, glitchDelay);
    timeoutIds.push(glitchTid);

    // Final dissolve and cleanup
    const dissolveTid = setTimeout(() => {
      finishIntro();
    }, glitchDelay + 2400);
    timeoutIds.push(dissolveTid);
  }


  // ============================================================
  // 9. TEXT SCRAMBLE CYBERNETIC HEADING ANIMATION
  // ============================================================
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText || '';
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 25);
        const end = start + Math.floor(Math.random() * 25);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        if (this.resolve) this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const scrambleElements = document.querySelectorAll('.scramble-heading');
  const scramblers = new Map();

  scrambleElements.forEach(el => {
    const fx = new TextScramble(el);
    scramblers.set(el, fx);
    const targetText = el.getAttribute('data-text') || el.innerText;

    // Hover effect: re-scramble on mouse enter
    el.addEventListener('mouseenter', () => {
      fx.setText(targetText);
    });
  });

  // IntersectionObserver to decode heading when scrolled into view
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const fx = scramblers.get(el);
        const targetText = el.getAttribute('data-text') || el.innerText;
        if (fx) {
          fx.setText(targetText);
        }
      }
    });
  }, { threshold: 0.15 });

  scrambleElements.forEach(el => headingObserver.observe(el));

  function triggerInitialScrambles() {
    scrambleElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        const fx = scramblers.get(el);
        const targetText = el.getAttribute('data-text') || el.innerText;
        if (fx) fx.setText(targetText);
      }
    });
  }

})();

