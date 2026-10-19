const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const siteNav = document.getElementById('siteNav');
const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

mobileMenuBtn.addEventListener('click', () => {
  siteNav.classList.toggle('open');
});

siteNav.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    siteNav.classList.remove('open');
  }
});

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('portfolioTheme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
setTheme(savedTheme);

const navLinks = document.querySelectorAll('.site-nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    // Only smooth-scroll in-page anchors; let index.html#... links navigate normally (fixes subpages)
    if (!href || !href.startsWith('#')) {
      return;
    }
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('mhlakshima@gmail.com');
      copyEmailBtn.textContent = 'Copied!';
      setTimeout(() => { copyEmailBtn.textContent = 'Copy email'; }, 2000);
    } catch (e) {
      copyEmailBtn.textContent = 'mhlakshima@gmail.com';
    }
  });
}

// Contact form: AJAX submit with visible status (no silent failures)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const formStatus = document.getElementById('formStatus');
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending...';
    formStatus.className = 'form-status';
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        formStatus.textContent = 'Thanks! Your message was sent. I typically reply within 24 hours.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (e) {
      formStatus.textContent = 'Sorry, the form could not send right now. Please email mhlakshima@gmail.com directly.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Scroll progress bar
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// Reveal-on-scroll animations (respects prefers-reduced-motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.section-header, .card, .timeline-item, .project-card, .skill-card, .contact-card'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
}

// Command palette (Ctrl/Cmd+K)
const paletteOverlay = document.getElementById('commandPalette');
if (paletteOverlay) {
  const paletteInput = document.getElementById('paletteInput');
  const paletteList = document.getElementById('paletteList');
  const paletteItems = [
    { label: 'Home', hint: 'Top of page', action: () => scrollToId('home') },
    { label: 'About', hint: 'Professional summary', action: () => scrollToId('about') },
    { label: 'Skills', hint: 'Languages, web, AI/ML', action: () => scrollToId('skills') },
    { label: 'Projects', hint: 'Featured work', action: () => scrollToId('projects') },
    { label: 'Experience timeline', hint: '2023-2026', action: () => scrollToId('experience') },
    { label: 'Research', hint: 'PantryPal + consumer behaviour', action: () => scrollToId('research') },
    { label: 'Education', hint: 'London Met / ESOFT', action: () => scrollToId('education') },
    { label: 'Certificates', hint: 'Google, Cisco, etc.', action: () => scrollToId('certificates') },
    { label: 'Download CV', hint: 'PDF', action: () => window.open('resume/Lakshima-Madurangi-CV.pdf', '_blank') },
    { label: 'Contact', hint: 'Email, LinkedIn, form', action: () => scrollToId('contact') },
    { label: 'GitHub profile', hint: 'github.com/Lakshima409', action: () => window.open('https://github.com/Lakshima409', '_blank') },
    { label: 'LinkedIn', hint: 'Connect', action: () => window.open('https://www.linkedin.com/in/m-h-lakshima-3a5907288', '_blank') },
  ];

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function renderPalette(filter) {
    const query = (filter || '').toLowerCase();
    const matches = paletteItems.filter((item) =>
      item.label.toLowerCase().includes(query) || item.hint.toLowerCase().includes(query)
    );
    paletteList.innerHTML = '';
    matches.forEach((item, index) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'palette-item' + (index === 0 ? ' active' : '');
      row.innerHTML = '<span>' + item.label + '</span><small>' + item.hint + '</small>';
      row.addEventListener('click', () => { closePalette(); item.action(); });
      paletteList.appendChild(row);
    });
  }

  function openPalette() {
    paletteOverlay.hidden = false;
    paletteInput.value = '';
    renderPalette('');
    paletteInput.focus();
  }

  function closePalette() {
    paletteOverlay.hidden = true;
  }

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      paletteOverlay.hidden ? openPalette() : closePalette();
    } else if (event.key === 'Escape' && !paletteOverlay.hidden) {
      closePalette();
    }
  });

  paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));
  paletteInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const first = paletteList.querySelector('.palette-item');
      if (first) first.click();
    }
  });
  paletteOverlay.addEventListener('click', (event) => {
    if (event.target === paletteOverlay) closePalette();
  });
}
