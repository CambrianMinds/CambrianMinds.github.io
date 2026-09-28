/* ============================================================
   CambrianMinds Portfolio — Script
   ============================================================ */

(function () {
  'use strict';

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  // ---- Typewriter effect for terminal commands ----
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const text = el.getAttribute('data-typewriter');
    el.textContent = '';
    let i = 0;
    const typeInterval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(typeInterval);
    }, 80);
  });


  // ---- Delayed terminal lines ----
  document.querySelectorAll('.terminal-delayed').forEach(el => {
    const delay = parseInt(el.dataset.delay, 10) || 1000;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  });


  // ---- IntersectionObserver fallback for scroll reveal ----
  // Only runs when CSS scroll-driven animations are NOT supported.
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade');
    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 }
      );
      revealElements.forEach(el => revealObserver.observe(el));
    }
  }


  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
