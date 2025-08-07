// Efecto suave al cargar
document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.about-content');
  if (content) {
    content.style.opacity = 0;
    content.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
      content.style.opacity = 1;
    }, 100);
  }
});