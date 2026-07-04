document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    console.log(`${btn.textContent.trim()} clicked`);
  });
});

const page = document.querySelector('.page');
const viewport = document.querySelector('.viewport');
const DESIGN_WIDTH = 1280;
let rafId = null;

function applyScale() {
  const scale = window.innerWidth / DESIGN_WIDTH;
  page.style.transform = `scale(${scale})`;
  viewport.style.height = `${page.offsetHeight * scale}px`;
}

function scheduleScale() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(applyScale);
}

window.addEventListener('resize', scheduleScale);
window.addEventListener('load', applyScale);
applyScale();
