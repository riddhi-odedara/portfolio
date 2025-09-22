// Dark mode toggle (persist)
const btn = document.getElementById('theme-btn');
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  btn.textContent = dark ? 'Light' : 'Dark';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}
(() => {
  const pref = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(pref ? pref === 'dark' : prefersDark);
})();
btn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(!isDark);
});

// Active nav highlight on scroll
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const byId = id => document.querySelector(`.nav a[href="#${id}"]`);
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const a = byId(e.target.id);
      a && a.classList.add('active');
    }
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });
sections.forEach(s => obs.observe(s));
const style = document.createElement('style');
style.textContent = `.nav a.active{opacity:1;text-decoration:underline;text-underline-offset:4px}`;
document.head.appendChild(style);

// Optional: lightweight “grain” effect (static noise)
const grain = document.getElementById('grain');
if (grain) {
  const ctx = grain.getContext('2d');
  const resize = () => { grain.width = innerWidth; grain.height = innerHeight; draw(); };
  const draw = () => {
    const { width:w, height:h } = grain;
    const img = ctx.createImageData(w, h);
    for (let i=0; i<img.data.length; i+=4) {
      const v = (Math.random()*255)|0;
      img.data[i]=v; img.data[i+1]=v; img.data[i+2]=v; img.data[i+3]=20; // low alpha
    }
    ctx.putImageData(img, 0, 0);
  };
  addEventListener('resize', resize); resize();
}

// Contact form UX (works with Formspree too)
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', async (e) => {
    status.textContent = '';
    // Allow normal POST; if you want AJAX:
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' }});
      if (res.ok) {
        form.reset();
        status.textContent = 'Thanks! I’ll reply soon.';
      } else {
        status.textContent = 'Something went wrong. Please try again.';
      }
    } catch {
      status.textContent = 'Network error. Try again later.';
    }
  });
}
// current year in footer
document.getElementById("year").textContent = new Date().getFullYear();