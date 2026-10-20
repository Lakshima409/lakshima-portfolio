const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const siteNav = document.getElementById('siteNav');
const themeToggle = document.getElementById('themeToggle');
const rootElement = document.documentElement;

// P4: motion preference is read once and reused for all scroll animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenuExpanded(expanded) {
  if (!mobileMenuBtn || !siteNav) return;
  mobileMenuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  mobileMenuBtn.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
  siteNav.classList.toggle('open', expanded);
}

if (mobileMenuBtn && siteNav) {
  setMenuExpanded(false);

  mobileMenuBtn.addEventListener('click', () => {
    setMenuExpanded(!siteNav.classList.contains('open'));
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenuExpanded(false);
    }
  });

  // P4: Escape closes the mobile menu and returns focus to its trigger
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('open')) {
      setMenuExpanded(false);
      mobileMenuBtn.focus();
    }
  });
}

function currentTheme() {
  return rootElement.classList.contains('light-theme') ? 'light' : 'dark';
}

// P4: theme lives on <html> so the pre-paint inline script and this code agree
function applyTheme(theme) {
  const isLight = theme === 'light';
  rootElement.classList.toggle('light-theme', isLight);
  if (themeToggle) {
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('portfolioTheme', next);
    } catch (e) {
      // storage unavailable (private mode) - theme still applies for this page
    }
  });
}

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
} catch (e) {
  savedTheme = 'dark';
}
applyTheme(savedTheme);

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
      // P4: respect the user's reduced-motion preference
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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

  // P4: remembers the element that opened the palette so focus can be restored
  let lastFocusedElement = null;

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
      row.id = 'paletteOption' + index;
      row.className = 'palette-item' + (index === 0 ? ' active' : '');
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      // P4: the active option is referenced via aria-activedescendant, so the rows stay out of the Tab order
      row.setAttribute('tabindex', '-1');
      row.innerHTML = '<span>' + item.label + '</span><small>' + item.hint + '</small>';
      row.addEventListener('click', () => { closePalette(); item.action(); });
      row.addEventListener('mouseenter', () => setActiveRow(row));
      paletteList.appendChild(row);
    });
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'palette-empty';
      empty.textContent = 'No matches';
      paletteList.appendChild(empty);
      // P5A: no options exist, so clear the combobox reference
      paletteInput.removeAttribute('aria-activedescendant');
      return;
    }
    // P4: the first row is active, so point the combobox at it
    setActiveRow(paletteList.querySelector('.palette-item'));
  }

  // P4: keep exactly one row marked active and scrolled into view
  function setActiveRow(row) {
    if (!row) return;
    paletteList.querySelectorAll('.palette-item').forEach((el) => {
      const isActive = el === row;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    // P4: point the combobox at the active option for screen readers
    if (row.id) {
      paletteInput.setAttribute('aria-activedescendant', row.id);
    } else {
      paletteInput.removeAttribute('aria-activedescendant');
    }
    if (typeof row.scrollIntoView === 'function') {
      row.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }

  function moveActiveRow(offset) {
    const rows = Array.from(paletteList.querySelectorAll('.palette-item'));
    if (!rows.length) return;
    const currentIndex = rows.findIndex((row) => row.classList.contains('active'));
    const nextIndex = currentIndex < 0
      ? 0
      : (currentIndex + offset + rows.length) % rows.length;
    setActiveRow(rows[nextIndex]);
  }

  function openPalette() {
    lastFocusedElement = document.activeElement;
    paletteOverlay.hidden = false;
    paletteOverlay.setAttribute('aria-hidden', 'false');
    paletteInput.value = '';
    renderPalette('');
    setBackgroundInert(true);
    paletteInput.focus();
  }

  // P4: restore focus to whatever opened the palette
  function closePalette(restoreFocus = true) {
    paletteOverlay.hidden = true;
    paletteOverlay.setAttribute('aria-hidden', 'true');
    setBackgroundInert(false);
    if (restoreFocus && lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      paletteOverlay.hidden ? openPalette() : closePalette();
    } else if (event.key === 'Escape' && !paletteOverlay.hidden) {
      event.preventDefault();
      closePalette();
    }
  });

  paletteInput.addEventListener('input', () => renderPalette(paletteInput.value));

  // P4: ArrowUp/ArrowDown move the active row, Enter activates it, Escape closes
  paletteInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveRow(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveRow(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const active = paletteList.querySelector('.palette-item.active') || paletteList.querySelector('.palette-item');
      if (active) active.click();
    }
  });

  // P4: keep the palette usable when focus is inside the list itself
  paletteList.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveRow(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveRow(-1);
    }
  });

  paletteOverlay.addEventListener('click', (event) => {
    if (event.target === paletteOverlay) closePalette();
  });

  // P4: keep Tab focus inside the dialog while it is open
  paletteOverlay.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusables = Array.from(
      paletteOverlay.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null && el.getAttribute('tabindex') !== '-1');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // P4: hide the rest of the page from assistive tech while the dialog is open
  const inertedElements = new Map();
  function setBackgroundInert(inert) {
    if (inert) {
      const siblings = Array.from(document.body.children).filter(
        (el) => el !== paletteOverlay && !el.contains(paletteOverlay)
      );
      siblings.forEach((el) => {
        if (inertedElements.has(el)) return;
        // remember the previous value so it can be restored exactly
        inertedElements.set(el, el.getAttribute('aria-hidden'));
        el.setAttribute('aria-hidden', 'true');
        el.setAttribute('inert', '');
      });
    } else {
      inertedElements.forEach((previous, el) => {
        if (previous === null) {
          el.removeAttribute('aria-hidden');
        } else {
          el.setAttribute('aria-hidden', previous);
        }
        el.removeAttribute('inert');
      });
      inertedElements.clear();
    }
  }
}
