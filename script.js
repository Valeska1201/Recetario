// HERO CAROUSEL
const slides = document.querySelectorAll('.hc-slide');
const prevBtn = document.querySelector('.hc-btn.prev');
const nextBtn = document.querySelector('.hc-btn.next');

let index = 0;

function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
}

nextBtn.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

// AUTO PLAY
setInterval(() => {
  index = (index + 1) % slides.length;
  showSlide(index);
}, 5000);

// TOGGLE CARDS
document.querySelectorAll('.country-card').forEach(card => {
  card.addEventListener('click', () => {
    const body = card.querySelector('.card-body');
    body.style.display = body.style.display === 'block' ? 'none' : 'block';
  });
});