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
    themeToggle.textContent = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.textContent = '☀️';
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
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
