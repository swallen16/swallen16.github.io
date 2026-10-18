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
const moduleLoader = document.querySelector("#module-loader");
const loaderModule = document.querySelector("#loader-module");

const moduleRoutes = {
  "1": { name: "ABOUT", href: "about.html" },
  "01": { name: "ABOUT", href: "about.html" },
  "2": { name: "PROJECTS", href: "projects.html" },
  "02": { name: "PROJECTS", href: "projects.html" },
  "3": { name: "EXPERIENCE", href: "experience.html" },
  "03": { name: "EXPERIENCE", href: "experience.html" },
  "4": { name: "CONTACT", href: "contact.html" },
  "04": { name: "CONTACT", href: "contact.html" }
};

const loadModule = (name, href) => {
  if (!href) return;

  if (moduleFeedback) {
    moduleFeedback.classList.remove("is-error");
    moduleFeedback.textContent = `ACCESS GRANTED // ${name}`;
  }

  if (loaderModule) {
    loaderModule.textContent = `LOADING MODULE: ${name}`;
  }

  if (moduleLoader) {
    moduleLoader.setAttribute("aria-hidden", "false");
    document.body.classList.add("module-loading");
  }

  window.setTimeout(() => {
    window.location.href = href;
  }, 720);
};

if (moduleForm && moduleInput && moduleFeedback) {
  const runModule = () => {
    const value = moduleInput.value.trim();
    const route = moduleRoutes[value];

    if (!route) {
      moduleFeedback.textContent = "ERROR: INVALID MODULE // ENTER 01-04";
      moduleFeedback.classList.add("is-error");
      moduleInput.value = "";
      moduleInput.focus();
      return;
    }

    loadModule(route.name, route.href);
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
    if (!landing || homePage?.classList.contains("is-revealed")) return;
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

document.querySelectorAll(".terminal-options a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const text = link.textContent.toUpperCase();
    let name = "MODULE";

    if (text.includes("ABOUT")) name = "ABOUT";
    else if (text.includes("PROJECT")) name = "PROJECTS";
    else if (text.includes("EXPERIENCE")) name = "EXPERIENCE";
    else if (text.includes("CONTACT")) name = "CONTACT";

    loadModule(name, link.getAttribute("href"));
  });
});

if (document.body.classList.contains("page-shell")) {
  window.requestAnimationFrame(() => {
    document.body.classList.add("module-ready");
  });
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


const caseJump = document.querySelector(".case-jump");
const caseJumpToggle = document.querySelector(".case-jump-toggle");
const caseJumpLinks = document.querySelectorAll(".case-jump-menu a");
const caseSections = document.querySelectorAll(".case-study-page .case-section[id]");

if (caseJump && caseJumpToggle && caseJumpLinks.length && caseSections.length) {
  const closeCaseJump = () => {
    caseJump.classList.remove("is-open");
    caseJumpToggle.setAttribute("aria-expanded", "false");
  };

  caseJumpToggle.addEventListener("click", () => {
    const willOpen = !caseJump.classList.contains("is-open");
    caseJump.classList.toggle("is-open", willOpen);
    caseJumpToggle.setAttribute("aria-expanded", String(willOpen));
  });

  caseJumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();
      closeCaseJump();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });

  document.addEventListener("click", (event) => {
    if (!caseJump.contains(event.target)) closeCaseJump();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCaseJump();
      caseJumpToggle.focus();
    }
  });

  const updateActiveCaseSection = () => {
    const marker = window.innerHeight * 0.32;
    let activeSection = caseSections[0];

    caseSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) {
        activeSection = section;
      }
    });

    caseJumpLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeSection.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  window.addEventListener("scroll", updateActiveCaseSection, { passive: true });
  window.addEventListener("resize", updateActiveCaseSection);
  updateActiveCaseSection();
}
