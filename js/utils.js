// utils.js - Efectos visuales: partículas móviles y lluvia direccional

function createParticles() {
  const container = document.getElementById('particles');
  const isDark = document.documentElement.classList.contains('dark-mode');
  const count = isDark ? 80 : 30;

  // Limpiar partículas anteriores
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    // Posición aleatoria en toda la pantalla
    p.style.position = 'absolute';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';

    // Estilo
    p.style.opacity = Math.random() * 0.7 + 0.3;
    p.style.zIndex = '-1';
    p.style.pointerEvents = 'none';

    if (isDark) {
      // Modo oscuro: gotas de lluvia
      p.style.width = '2px';
      p.style.height = '15px';
      p.style.borderRadius = '0';
      p.style.backgroundColor = '#87ceeb';
      p.style.boxShadow = '0 0 8px rgba(135, 206, 235, 0.7)';
      p.style.transform = 'rotate(20deg)'; // Dirección del viento
      p.style.animation = 'rain linear infinite';
      p.style.animationDuration = '3s';
      p.style.animationDelay = (Math.random() * 5) + 's';
    } else {
      // Modo claro: partículas flotantes
      p.style.width = (Math.random() * 8 + 5) + 'px';
      p.style.height = p.style.width;
      p.style.borderRadius = '50%';
      p.style.backgroundColor = 'var(--particle-color)';
      p.style.boxShadow = '0 0 8px rgba(255,255,255,0.5)';
      p.style.animation = 'float linear infinite';
      p.style.animationDuration = (Math.random() * 15 + 10) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
    }

    container.appendChild(p);
  }

  // Modo claro: efecto de viento con el ratón
  if (!isDark) {
    document.addEventListener('mousemove', (e) => {
      const particles = container.querySelectorAll('.particle');
      particles.forEach(p => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        p.style.transform = `translate(${x * 20}%, ${y * 20}%)`;
      });
    });
  }
}

// Hoja cayendo (modo claro)
function spawnFallingLeaf() {
  const container = document.getElementById('particles');
  const leaf = document.createElement('img');
  leaf.src = '../images/leaf.png';
  leaf.classList.add('falling-leaf');
  leaf.style.position = 'fixed';
  leaf.style.left = `${Math.random() * 100}%`;
  leaf.style.top = '-50px';
  leaf.style.opacity = '0.6';
  leaf.style.zIndex = '-1';
  leaf.style.pointerEvents = 'none';
  leaf.style.width = '40px';
  leaf.style.height = 'auto';
  leaf.style.animation = 'fall 10s linear forwards';
  container.appendChild(leaf);

  setTimeout(() => {
    if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
  }, 10000);
}

// Lanzar hojas cada 15 segundos
setInterval(spawnFallingLeaf, 15000);

// Crear partículas al cargar y al cambiar de tema
window.addEventListener('load', createParticles);
window.addEventListener('storage', createParticles);