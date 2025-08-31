// Init lucide icons
if (window.lucide && typeof lucide.createIcons === 'function') {
  lucide.createIcons();
}

// Utilities
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

// Dark theme removed

// Mobile nav drawer
(function initNav(){
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  if (!burger || !drawer) return;
  const open = (val) => {
    burger.setAttribute('aria-expanded', String(val));
    drawer.toggleAttribute('hidden', !val);
    drawer.setAttribute('aria-hidden', String(!val));
    drawer.classList.toggle('open', val);
  };
  burger.addEventListener('click', () => open(burger.getAttribute('aria-expanded') !== 'true'));
  drawer.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') open(false);
  });
})();

// Icon fallback if Lucide fails to load
(function ensureIcons(){
  const nodes = document.querySelectorAll('[data-lucide]');
  const hasLucide = !!(window.lucide && typeof window.lucide.createIcons === 'function');
  if (hasLucide){
    try { window.lucide.createIcons(); return; } catch(_){}
  }
  const createSVG = (name, cls='i') => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(svgNS, 'svg');
    s.setAttribute('viewBox','0 0 24 24');
    s.setAttribute('fill','none');
    s.setAttribute('stroke','currentColor');
    s.setAttribute('stroke-width','2');
    s.setAttribute('stroke-linecap','round');
    s.setAttribute('stroke-linejoin','round');
    s.setAttribute('class', cls);
    const add = (tag, attrs) => { const el = document.createElementNS(svgNS, tag); Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v))); s.appendChild(el); };
    if (name === 'menu'){
      add('line',{ x1:3, y1:6, x2:21, y2:6 });
      add('line',{ x1:3, y1:12, x2:21, y2:12 });
      add('line',{ x1:3, y1:18, x2:21, y2:18 });
    } else if (name === 'x'){
      add('line',{ x1:18, y1:6, x2:6, y2:18 });
      add('line',{ x1:6, y1:6, x2:18, y2:18 });
    } else if (name === 'sparkles'){
      add('path',{ d:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6' });
      add('circle',{ cx:12, cy:12, r:2 });
    } else if (name === 'arrow-up'){
      add('path',{ d:'M12 19V5' });
      add('path',{ d:'M5 12l7-7 7 7' });
    } else {
      // generic fallback: circle
      add('circle',{ cx:12, cy:12, r:9 });
    }
    return s;
  };
  nodes.forEach(node => {
    const name = node.getAttribute('data-lucide') || '';
    const cls = node.getAttribute('class') || 'i';
    const svg = createSVG(name, cls);
    node.replaceWith(svg);
  });
})();

// Active link highlighting
(function initActiveLinks(){
  const links = $$('.site-nav a');
  const sections = ['benefits','how','success','who','pricing']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!links.length || !sections.length) return;
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.id;
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .25, .5, .75, 1] });
  sections.forEach(s => io.observe(s));
})();

// Form handling (demo only)
(function initForm(){
  const form = document.getElementById('form');
  if (!form) return;
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      if (status) status.textContent = 'Please enter a valid name and email.';
      return;
    }
    if (status) status.textContent = 'Thanks. Your call is booked. We’ll review your profile and come prepared with a draft content theme and 3 starter hooks.';
    form.reset();
  });
})();

// Reveal-on-scroll animations
(function initReveal(){
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setReveal = (el, dir='up', delay=0) => {
    el.setAttribute('data-reveal', dir);
    if (delay) el.style.setProperty('--d', `${delay}ms`);
  };
  const batch = (sel, dir='up', stagger=60, from=0) => {
    const els = $$(sel);
    els.forEach((el, i) => setReveal(el, typeof dir === 'function' ? dir(el, i) : dir, from + i*stagger));
  };

  // Assign reveal attributes to common elements
  setReveal($('.hero h1'), 'up', 0);
  setReveal($('.hero .lead'), 'up', 80);
  setReveal($('.hero .cta-row'), 'up', 160);
  batch('.mini-benefits .badge', 'up', 40, 220);
  batch('#benefits .card', 'up', 60);
  batch('.timeline-alt .trow .tstep', (el, i) => (i % 2 ? 'right' : 'left'), 80);
  batch('.bento .bento-card', 'up', 60);
  batch('.who-card', 'up', 80);
  setReveal($('.pricing-card'), 'up', 0);

  const heroRoot = $('.hero');
  // Immediately reveal Hero elements on load (respecting their delays)
  if (heroRoot){
    const heroEls = $$('[data-reveal]', heroRoot);
    heroEls.forEach(el => {
      const d = parseInt(getComputedStyle(el).getPropertyValue('--d')) || 0;
      if (prefersReduce) {
        el.classList.add('revealed');
      } else {
        setTimeout(() => el.classList.add('revealed'), d);
      }
    });
  }

  // Observe and reveal all other elements on scroll (exclude Hero)
  const items = $$('[data-reveal]').filter(el => !(heroRoot && heroRoot.contains(el)));
  if (!items.length) return;

  if (prefersReduce){
    items.forEach(el => el.classList.add('revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  items.forEach(el => io.observe(el));
})();

// Back-to-top button
(function initBackToTop(){
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggle = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle('show', y > 400);
  };
  toggle();
  window.addEventListener('scroll', () => requestAnimationFrame(toggle), { passive:true });
  btn.addEventListener('click', () => {
    if (prefersReduce){
      window.scrollTo(0,0);
    } else {
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  });
})();

// FAQ animation handled via CSS max-height; JS not required
