// Background drifting field
(function () {
  const field = document.getElementById('field');
  if (!field) return;
  for (let i = 0; i < 50; i++) {
    const m = document.createElement('div');
    m.className = 'mote';
    m.style.left = Math.random() * 100 + 'vw';
    m.style.top = Math.random() * 100 + 'vh';
    m.style.animation = `drift ${20 + Math.random()*30}s linear infinite`;
    m.style.animationDelay = (Math.random()*20) + 's';
    field.appendChild(m);
  }
})();

// Scroll reveal
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

// Reading progress bar
(function () {
  const bar = document.getElementById('readProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  });
})();

// FAQ accordion
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('open'));
  });
})();
