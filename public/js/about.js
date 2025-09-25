// Parallax background effect
window.addEventListener('scroll', () => {
  const banner = document.querySelector('.banner');
  banner.style.backgroundPositionY = `${-window.scrollY * 0.5}px`;
});

// Slider logic
const slides = document.querySelectorAll('.slide');
let current = 0;

function showSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
}

// Controls
document.getElementById('next').addEventListener('click', () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

document.getElementById('prev').addEventListener('click', () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
});