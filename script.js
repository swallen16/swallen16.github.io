const landing = document.querySelector("#landing");
const homePage = document.querySelector(".home-page");
const reveals = document.querySelectorAll(".reveal");

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

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  reveals.forEach((element) => revealObserver.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}
