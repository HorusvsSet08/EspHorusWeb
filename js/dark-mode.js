// dark-mode.js
(function () {
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark') {
    html.classList.add('dark-mode');
  } else if (savedTheme === 'light') {
    html.classList.remove('dark-mode');
  } else {
    if (prefersDark) {
      html.classList.add('dark-mode');
    } else {
      html.classList.remove('dark-mode');
    }
  }

  function initToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.checked = html.classList.contains('dark-mode');
      toggle.addEventListener('change', () => {
        if (toggle.checked) {
          html.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          html.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();