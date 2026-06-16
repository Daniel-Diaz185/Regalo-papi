const audio = document.getElementById('backgroundAudio');
const audioToggle = document.getElementById('audioToggle');
const showGalleryButton = document.getElementById('show-gallery');
const galleryFull = document.getElementById('gallery-full');
const confirmRestart = document.getElementById('confirmRestart');
const sectionSelectors = document.querySelectorAll('[data-action="open-section"]');
const sections = {
  'section-1': document.getElementById('section-1'),
  'section-2': document.getElementById('section-2'),
  'section-3': document.getElementById('section-3')
};

let isMuted = false;
let fadeInterval = null;

audio.volume = 0.03;
audio.loop = true;

// Reproduce audio la primera vez que el usuario toque la página.
document.body.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().catch(() => {
      // Si el navegador bloquea autoplay, el usuario ya interactuó y podrá activar manualmente.
    });
  }
}, { once: true });

function fadeInAudio() {
  if (fadeInterval) {
    clearInterval(fadeInterval);
  }

  fadeInterval = setInterval(() => {
    if (audio.volume < 0.25) {
      audio.volume = Math.min(0.25, audio.volume + 0.02);
    } else {
      clearInterval(fadeInterval);
    }
  }, 200);
}

function toggleAudio() {
  if (isMuted) {
    audio.muted = false;
    isMuted = false;
    audioToggle.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
    fadeInAudio();
  } else {
    audio.muted = true;
    isMuted = true;
    audioToggle.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
  }
}

function closeAllSections() {
  Object.values(sections).forEach(section => {
    section.classList.add('collapsed');
    section.setAttribute('aria-hidden', 'true');
  });
}

function openSection(targetId) {
  closeAllSections();
  const targetSection = sections[targetId];

  if (targetSection) {
    targetSection.classList.remove('collapsed');
    targetSection.setAttribute('aria-hidden', 'false');
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

sectionSelectors.forEach(button => {
  button.addEventListener('click', event => {
    event.stopPropagation();
    const target = button.dataset.target;
    openSection(target);
  });
});

showGalleryButton.addEventListener('click', () => {
  galleryFull.classList.remove('collapsed');
  galleryFull.setAttribute('aria-hidden', 'false');
  galleryFull.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

confirmRestart.addEventListener('click', () => {
  window.location.reload();
});

audioToggle.addEventListener('click', toggleAudio);

// Lógica de desbloqueo en tres estados:
// 1) El icono del perro en la imagen 2 abre Sección 1 y cierra secciones previas.
// 2) El icono del casco en la segunda imagen de Sección 1 abre Sección 2.
// 3) El icono del edificio en la tercera imagen de Sección 2 abre Sección 3.
