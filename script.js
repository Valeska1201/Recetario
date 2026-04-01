/* ══════════════════════════════════════════
   Recetas del Mundo — Scripts principales
   main.js
═══════════════════════════════════════════ */

/* ── FLOTANTES DE FONDO ── */
(function () {
  var items = [
    '🥦','🥕','🧅','🌽','🍅','🥑','🫑','🧄','🍆','🥬','🌶️',
    '🇨🇱','🇵🇪','🇨🇴','🇫🇷','🇧🇷','🇻🇪','🇪🇸','🇮🇹'
  ];

  var container = document.getElementById('floaters');
  if (!container) return;

  for (var i = 0; i < 26; i++) {
    var el   = document.createElement('div');
    var item = items[Math.floor(Math.random() * items.length)];
    var size  = 20 + Math.random() * 24;
    var left  = Math.random() * 100;
    var dur   = 24 + Math.random() * 32;
    var delay = -Math.random() * 44;

    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = item;
    el.style.cssText =
      'position:absolute;font-size:' + size + 'px;left:' + left +
      '%;opacity:0.16;animation:floatUp ' + dur + 's ' + delay +
      's linear infinite;will-change:transform;';

    container.appendChild(el);
  }

  /* Keyframe dinámico para los flotantes */
  var s = document.createElement('style');
  s.textContent =
    '@keyframes floatUp{' +
      '0%  {transform:translateY(110vh) rotate(0deg);  opacity:0;}' +
      '10% {opacity:0.16;}' +
      '90% {opacity:0.16;}' +
      '100%{transform:translateY(-10vh)  rotate(360deg);opacity:0;}' +
    '}';
  document.head.appendChild(s);
})();


/* ══════════════════════════════════════════
   HERO CAROUSEL
═══════════════════════════════════════════ */
var heroSlides  = document.querySelectorAll('#hero-carousel .hc-slide');
var heroCurrent = 0;
var heroTimer;

/** Renderiza los puntos de navegación del hero */
function renderHeroDots() {
  var dc = document.getElementById('hc-dots');
  if (!dc) return;
  dc.innerHTML = '';

  heroSlides.forEach(function (_, i) {
    var sp = document.createElement('span');
    if (i === heroCurrent) sp.classList.add('active');
    sp.setAttribute('role', 'button');
    sp.setAttribute('aria-label', 'Diapositiva ' + (i + 1));
    sp.onclick = function () { heroGo(i); };
    dc.appendChild(sp);
  });
}

/** Navega al slide indicado y reinicia el temporizador */
function heroGo(n) {
  heroSlides[heroCurrent].classList.remove('active');
  heroCurrent = (n + heroSlides.length) % heroSlides.length;
  heroSlides[heroCurrent].classList.add('active');
  renderHeroDots();
  clearInterval(heroTimer);
  heroTimer = setInterval(function () { heroGo(heroCurrent + 1); }, 5000);
}

/** Retrocede un slide en el hero */
function heroPrev() { heroGo(heroCurrent - 1); }

/** Avanza un slide en el hero */
function heroNext() { heroGo(heroCurrent + 1); }

/* Inicializar hero */
renderHeroDots();
heroTimer = setInterval(function () { heroGo(heroCurrent + 1); }, 5000);


/* ══════════════════════════════════════════
   CARRUSEL DE PLATOS (interior de tarjeta)
═══════════════════════════════════════════ */
var carouselState = {};

/** Devuelve la pista (.carousel-track) de un carrusel dado su id */
function getTrack(id) {
  return document.querySelector('#' + id + ' .carousel-track');
}

/** Cuenta los slides de un carrusel */
function getSlideCount(id) {
  return document.querySelectorAll('#' + id + ' .carousel-track > div').length;
}

/** Renderiza los puntos de un carrusel interior */
function renderDots(carId, total) {
  var container = document.getElementById('dots-' + carId);
  if (!container) return;
  container.innerHTML = '';

  for (var i = 0; i < total; i++) {
    var d      = document.createElement('div');
    var active = (carouselState[carId] || 0) === i;

    d.className   = 'dot';
    d.style.width = active ? '20px' : '8px';
    d.style.background = active ? '#c0621a' : 'rgba(0,0,0,0.15)';
    d.setAttribute('role', 'button');
    d.setAttribute('aria-label', 'Plato ' + (i + 1));

    /* IIFE para capturar correctamente idx y cId en el cierre */
    (function (idx, cId) {
      d.onclick = function (e) {
        e.stopPropagation();
        goToSlide(cId, idx);
      };
    })(i, carId);

    container.appendChild(d);
  }
}

/** Desplaza el carrusel al slide indicado */
function goToSlide(carId, idx) {
  carouselState[carId] = idx;
  getTrack(carId).style.transform = 'translateX(-' + idx + '00%)';
  renderDots(carId, getSlideCount(carId));
}

/** Retrocede un slide en el carrusel de platos */
function prevSlide(e, carId) {
  e.stopPropagation();
  var total = getSlideCount(carId);
  var cur   = carouselState[carId] || 0;
  goToSlide(carId, (cur - 1 + total) % total);
}

/** Avanza un slide en el carrusel de platos */
function nextSlide(e, carId, total) {
  e.stopPropagation();
  if (!total) total = getSlideCount(carId);
  goToSlide(carId, ((carouselState[carId] || 0) + 1) % total);
}

/** Abre o cierra el panel de platos de un país */
function toggleCard(id) {
  var panel = document.getElementById(id);
  if (!panel) return;

  var carId  = 'car-' + id;
  var isOpen = panel.style.display === 'block';

  panel.style.display = isOpen ? 'none' : 'block';

  if (!isOpen) {
    carouselState[carId] = 0;
    getTrack(carId).style.transform = 'translateX(0)';
    renderDots(carId, getSlideCount(carId));
  }
}
