document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    console.log(`${btn.textContent.trim()} clicked`);
  });
});

/* Sticky note: split into per-letter spans so it can be "written" one letter at a
   time, then play the write-on effect every time the page loads */
(function () {
  const noteText = document.querySelector('.hero-note-text');
  if (!noteText) return;

  const walker = document.createTreeWalker(noteText, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  let i = 0;
  textNodes.forEach((textNode) => {
    const frag = document.createDocumentFragment();
    textNode.textContent.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = ch === ' ' ? 'letter letter-space' : 'letter';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.setProperty('--i', i++);
      frag.appendChild(span);
    });
    textNode.parentNode.replaceChild(frag, textNode);
  });

  noteText.classList.add('scribble-run');
})();

/* Closing section: the highlighter swings in from off-screen left when scrolled into view */
(function () {
  const closing = document.querySelector('.closing');
  if (!closing) return;
  if (!('IntersectionObserver' in window)) {
    closing.classList.add('in-view');
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        closing.classList.add('in-view');
        observer.unobserve(closing);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(closing);
})();

/* Doodles ("Guess Work", "Shadowing", "Micro management"): scribble text + draw the
   strikethrough when each one scrolls into view */
(function () {
  const doodles = document.querySelectorAll('.doodle-guesswork, .doodle-shadowing, .doodle-micromanagement');
  if (!doodles.length) return;
  if (!('IntersectionObserver' in window)) {
    doodles.forEach((doodle) => doodle.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const doodle = entry.target.closest('.doodle');
        doodle.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  doodles.forEach((doodle) => {
    const target = doodle.querySelector('.doodle-text-wrap') || doodle;
    observer.observe(target);
  });
})();

/* "How candytrail works" cards, and the Clarity / Freedom / Intelligence / Coaching
   sections: fade + rise into place, staggered, when each scrolls into view */
(function () {
  document.querySelectorAll('.how-card').forEach((card, i) => {
    card.style.setProperty('--i', i);
  });
  document.querySelectorAll('.insight-container').forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  const sections = document.querySelectorAll('.how-it-works, .insight');
  if (!sections.length) return;
  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  sections.forEach((section) => observer.observe(section));
})();

/* Numbers section: count up from 0 to the target value when scrolled into view */
(function () {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  function animateCount(el, target, duration) {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) return;
  counters.forEach((el) => { el.textContent = '0'; });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCount(el, parseInt(el.dataset.countTo, 10), 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
})();

const page = document.querySelector('.page');
const viewport = document.querySelector('.viewport');
const headerInner = document.querySelector('.site-header-inner');
const DESIGN_WIDTH = 1280;
let rafId = null;

function applyScale() {
  const scale = window.innerWidth / DESIGN_WIDTH;
  page.style.transform = `scale(${scale})`;
  viewport.style.height = `${page.offsetHeight * scale}px`;
  if (headerInner) headerInner.style.transform = `scale(${scale})`;
}

function scheduleScale() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(applyScale);
}

window.addEventListener('resize', scheduleScale);
window.addEventListener('load', applyScale);
applyScale();

new ResizeObserver(scheduleScale).observe(page);

function updateHeaderScrollState() {
  if (!headerInner) return;
  headerInner.classList.toggle('is-scrolled', window.scrollY > 0);
}

window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
updateHeaderScrollState();
