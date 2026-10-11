const landing = document.querySelector('#landing');

if (landing) {
  let ticking = false;

  const updateLanding = () => {
    const distance = Math.min(window.scrollY, window.innerHeight);
    const progress = distance / window.innerHeight;

    landing.style.transform = `translateY(${-distance}px)`;
    landing.style.opacity = String(1 - progress * 0.18);

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateLanding);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateLanding);
  updateLanding();
}
