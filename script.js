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

const moduleForm = document.querySelector("#module-form");
const moduleInput = document.querySelector("#module-input");
const moduleFeedback = document.querySelector("#module-feedback");

if (moduleForm && moduleInput && moduleFeedback) {
  const modules = {
    "1": "about.html",
    "01": "about.html",
    "2": "projects.html",
    "02": "projects.html",
    "3": "experience.html",
    "03": "experience.html",
    "4": "contact.html",
    "04": "contact.html"
  };

  const moduleNames = {
    "1": "ABOUT",
    "01": "ABOUT",
    "2": "PROJECTS",
    "02": "PROJECTS",
    "3": "EXPERIENCE",
    "03": "EXPERIENCE",
    "4": "CONTACT",
    "04": "CONTACT"
  };

  const runModule = () => {
    const value = moduleInput.value.trim();

    if (!modules[value]) {
      moduleFeedback.textContent = "ERROR: INVALID MODULE // ENTER 01-04";
      moduleFeedback.classList.add("is-error");
      moduleInput.value = "";
      moduleInput.focus();
      return;
    }

    moduleFeedback.classList.remove("is-error");
    moduleFeedback.textContent = `LOADING MODULE: ${moduleNames[value]} ...`;

    window.setTimeout(() => {
      window.location.href = modules[value];
    }, 180);
  };

  moduleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runModule();
  });

  moduleInput.addEventListener("input", () => {
    moduleInput.value = moduleInput.value.replace(/[^0-9]/g, "").slice(0, 2);
    moduleFeedback.classList.remove("is-error");
    moduleFeedback.textContent = "PRESS ENTER TO LOAD MODULE";
  });

  document.addEventListener("keydown", (event) => {
    if (!landing || homePage.classList.contains("is-revealed")) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const activeTag = document.activeElement?.tagName;
    const isTypingElsewhere =
      activeTag === "INPUT" ||
      activeTag === "TEXTAREA" ||
      activeTag === "SELECT";

    if (!isTypingElsewhere && /^[1-4]$/.test(event.key)) {
      event.preventDefault();
      moduleInput.value = event.key;
      moduleInput.focus();
      moduleFeedback.classList.remove("is-error");
      moduleFeedback.textContent = "PRESS ENTER TO LOAD MODULE";
    }
  });

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (finePointer) {
    window.setTimeout(() => {
      if (window.scrollY < 10) moduleInput.focus();
    }, 1350);
  }
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
