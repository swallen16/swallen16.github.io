const landing = document.querySelector("#landing");
const homePage = document.querySelector(".home-page");

if (landing && homePage) {
  let ticking = false;

  const updateLanding = () => {
    const viewportHeight = Math.max(window.innerHeight, 1);
    const distance = Math.min(Math.max(window.scrollY, 0), viewportHeight);
    const progress = distance / viewportHeight;

    document.documentElement.style.setProperty("--landing-y", `${-distance}px`);
    document.documentElement.style.setProperty("--landing-progress", progress.toFixed(3));

    homePage.classList.toggle("is-revealed", progress > 0.96);
    ticking = false;
  };

  const requestLandingUpdate = () => {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(updateLanding);
  };

  window.addEventListener("scroll", requestLandingUpdate, { passive: true });
  window.addEventListener("resize", requestLandingUpdate);

  updateLanding();
}
