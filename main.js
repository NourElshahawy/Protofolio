/* ============================================================
   CODEX — Narrative Portfolio | main.js
   ============================================================ */

'use strict';

/* ── PRELOADER ──────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const countEl   = document.getElementById('preCount');
  let count = 0;
  const target = 100;
  const duration = 1800;
  const interval = duration / target;

  const timer = setInterval(() => {
    count++;
    if (countEl) countEl.textContent = count;
    if (count >= target) {
      clearInterval(timer);
      setTimeout(() => {
        preloader && preloader.classList.add('done');
        document.body.style.overflow = '';
        initAnimations();
      }, 200);
    }
  }, interval);

  document.body.style.overflow = 'hidden';
})();

/* ── AOS INIT ───────────────────────────────────────────────── */
function initAnimations() {
  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    once: true,
    offset: 60,
  });

  initCounters();
  initTerminal();
}

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand on hoverable elements
  const hoverables = 'a, button, .project-card, .wf-btn, .philosophy-card, .stag, .testi-card, .pts-content';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
  });
})();

/* ── NAVIGATION ─────────────────────────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('mainNav');
  const burger = document.getElementById('navBurger');
  const mMenu  = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.nav-ch');
  const chapters = document.querySelectorAll('.chapter');
  const fill   = document.getElementById('storyFill');

  // Scroll-based nav styling + progress
  window.addEventListener('scroll', () => {
    const scrollY  = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

    nav  && nav.classList.toggle('scrolled', scrollY > 40);
    fill && (fill.style.width = progress + '%');

    // Active chapter highlight
    let current = '';
    chapters.forEach(ch => {
      if (scrollY >= ch.offsetTop - 120) current = ch.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Back to top visibility
    const btn = document.getElementById('backTop');
    btn && btn.classList.toggle('visible', scrollY > 400);
  });

  // Burger toggle
  burger && burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mMenu  && mMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      burger && burger.classList.remove('open');
      mMenu  && mMenu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (mMenu && mMenu.classList.contains('open') &&
        !mMenu.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('open');
      mMenu.classList.remove('open');
    }
  });
})();

/* ── THEME TOGGLE ───────────────────────────────────────────── */
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('codex-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  btn && btn.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('codex-theme', next);
  });
})();

/* ── COUNTER ANIMATION ──────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current  = 0;
      const step   = Math.ceil(target / 40);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── TERMINAL ANIMATION ─────────────────────────────────────── */
function initTerminal() {
  const cmdEl    = document.getElementById('typeCmd');
  const outputEl = document.getElementById('termOutput');
  if (!cmdEl || !outputEl) return;

  const command = 'list-skills --detailed --format=table';
  const output = `
<span class="to-green">✓</span> Loading skills database...

<span class="to-blue">CATEGORY</span>          <span class="to-gold">PROFICIENCY</span>    <span class="to-blue">YEARS</span>
────────────────────────────────────
<span class="to-green">HTML/CSS/Bootstrap</span>  ████████████  2yr
<span class="to-green">JavaScript/React</span>    ███████████░  1yr
<span class="to-green">Python</span>       █████████░░░  1yr
<span class="to-green">Figma/UI Design</span>     ████████████  2yr
<span class="to-gold">→</span> 14 skills loaded. All systems go.`;

  // Type the command
  let i = 0;
  const typeInterval = setInterval(() => {
    cmdEl.textContent += command[i];
    i++;
    if (i >= command.length) {
      clearInterval(typeInterval);
      setTimeout(() => {
        outputEl.innerHTML = output;
        outputEl.style.opacity = '0';
        outputEl.style.transition = 'opacity 0.5s';
        setTimeout(() => outputEl.style.opacity = '1', 50);
      }, 400);
    }
  }, 55);
}

/* ── PROJECT FILTER ─────────────────────────────────────────── */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.wf-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Inject keyframe
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
})();

/* ── PROJECT MODAL ──────────────────────────────────────────── */
(function initModal() {
  const modal    = document.getElementById('projectModal');
  const backdrop = document.getElementById('pmBackdrop');
  const closeBtn = document.getElementById('pmClose');
  const body     = document.getElementById('pmBody');

  const projects = [
    {
      title: 'Finova — Fintech Dashboard',
      type: 'SaaS Platform / Web Development',
      img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&q=80',
      description: 'Finova is a real-time financial analytics platform built for fast-growing fintech companies. The challenge was making complex data feel simple and actionable. We designed a modular dashboard architecture that scales from 10 to 10,000 users without a single line of extra infrastructure code.',
      description2: 'The interface was designed with a "progressive disclosure" philosophy — show simple summaries by default, allow deep dives on demand. This reduced cognitive load while maintaining full analytical power.',
      stats: [{ num: '340%', label: 'ROI increase' }, { num: '2M+', label: 'Events/sec' }, { num: '10K+', label: 'Active users' }],
      stack: ['React', 'Node.js', 'D3.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
      link: '#',
    },
    {
      title: 'Lumina — Luxury E-Commerce',
      type: 'UI/UX Design / E-Commerce',
      img: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=900&q=80',
      description: 'Lumina needed more than a facelift — they needed a complete brand reinvention. We rebuilt their digital presence from the ground up, treating it as a luxury editorial experience rather than a standard online shop.',
      description2: 'The result: a 340% increase in conversion rate, a 180% increase in average order value, and a brand identity that their customers now associate with genuinely elevated taste.',
      stats: [{ num: '340%', label: 'Conversion up' }, { num: '180%', label: 'AOV increase' }, { num: '4.9★', label: 'Customer rating' }],
      stack: ['Figma', 'Shopify', 'GSAP', 'Liquid', 'Custom CSS'],
      link: '#',
    },
    {
      title: 'Pulse — Wellness App',
      type: 'Mobile App / iOS & Android',
      img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&q=80',
      description: 'Pulse is a mindfulness and habit tracking app with an AI coaching system that adapts to your personal patterns. The UX challenge was making mental health tools feel approachable, not clinical.',
      description2: 'We achieved this through warm micro-interactions, progress visualizations that reward consistency, and a conversational AI interface that never feels robotic.',
      stats: [{ num: '50K+', label: 'Downloads/month' }, { num: '4.8★', label: 'App Store rating' }, { num: '78%', label: '30-day retention' }],
      stack: ['React Native', 'Firebase', 'TensorFlow Lite', 'Figma', 'Node.js'],
      link: '#',
    },
    {
      title: 'Forma — Architecture Studio',
      type: 'Brand Identity / Visual Design',
      img: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=900&q=80',
      description: 'Forma is a boutique architecture studio that needed an identity as precise and considered as their buildings. We developed a visual system around the concept of "controlled constraint" — rigid grids with deliberate moments of elegance.',
      description2: 'The brand system spans stationery, digital presence, presentation templates, and environmental graphics — a complete visual language for a firm that thinks in totalities.',
      stats: [{ num: '100%', label: 'Client satisfaction' }, { num: '3', label: 'Awards won' }, { num: '6wk', label: 'Delivery time' }],
      stack: ['Adobe Illustrator', 'InDesign', 'After Effects', 'Figma'],
      link: '#',
    },
    {
      title: 'Atlas — Analytics Platform',
      type: 'Web Development / Data Platform',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
      description: 'Atlas is an enterprise data platform that unifies analytics from dozens of disparate sources into a single coherent view. The core challenge was building something that data scientists love and executives can use.',
      description2: 'We built a dual-interface system: a technical query builder for analysts and a curated dashboard layer for leadership — connected by a shared data model that ensures consistency.',
      stats: [{ num: '2M+', label: 'Events/second' }, { num: '99.9%', label: 'Uptime SLA' }, { num: '400%', label: 'Faster insights' }],
      stack: ['Vue.js', 'Python', 'Apache Kafka', 'PostgreSQL', 'AWS', 'Docker', 'Terraform'],
      link: '#',
    },
    {
      title: 'Savor — Recipe Platform',
      type: 'UI/UX Design / Food & Lifestyle',
      img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&q=80',
      description: 'Savor is where culinary art meets algorithmic discovery. We built an editorial-quality recipe platform with a recommendation engine that learns your tastes and suggests recipes the way a brilliant friend would.',
      description2: 'The design philosophy was "magazine, not app" — rich photography, editorial layouts, and typographic hierarchy that makes browsing feel like reading a beautiful food magazine.',
      stats: [{ num: '25K+', label: 'Recipes indexed' }, { num: '4.7★', label: 'App rating' }, { num: '62%', label: 'DAU retention' }],
      stack: ['React', 'Figma', 'Node.js', 'MongoDB', 'Recommendation API'],
      link: '#',
    },
  ];

  function openModal(index) {
    const p = projects[index];
    if (!p || !body) return;

    body.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="pm-img" />
      <p class="pm-type">${p.type}</p>
      <h2 class="pm-title">${p.title}</h2>
      <p class="pm-text">${p.description}</p>
      <p class="pm-text">${p.description2}</p>
      <div class="pm-stats-row">
        ${p.stats.map(s => `
          <div class="pm-stat">
            <strong>${s.num}</strong>
            <span>${s.label}</span>
          </div>
        `).join('')}
      </div>
      <div class="pm-stack">
        ${p.stack.map(t => `<span>${t}</span>`).join('')}
      </div>
      <a href="${p.link}" class="btn-codex btn-primary-codex" target="_blank" rel="noopener">
        <span>View Live Project</span>
        <i class="bi bi-arrow-up-right"></i>
      </a>
    `;

    modal && modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal && modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.pc-open').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.project, 10)));
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  backdrop && backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

/* ── SWIPER TESTIMONIALS ────────────────────────────────────── */
(function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.ts-next', prevEl: '.ts-prev' },
    breakpoints: {
      640:  { slidesPerView: 1 },
      900:  { slidesPerView: 2 },
      1200: { slidesPerView: 2 },
    },
  });
})();

/* ── CONTACT FORM ───────────────────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Message Sent!</span> <i class="bi bi-check-circle-fill"></i>';
    btn.style.background = 'var(--green)';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
})();

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── BACK TO TOP ────────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── PASSIVE PARALLAX on hero glyphs ───────────────────────── */
(function initParallax() {
  const glyphs = document.querySelectorAll('.glyph');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    glyphs.forEach((g, i) => {
      const speed = 0.04 + (i * 0.015);
      g.style.transform = `translateY(${y * speed}px) rotate(${y * 0.01}deg)`;
    });
  }, { passive: true });
})();

