const OBSERVER_OPTIONS = {
  threshold: 0.15,
  rootMargin: "0px 0px -60px 0px"
};

export const initReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!elements.length) {
    return;
  }

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, OBSERVER_OPTIONS);

  elements.forEach((element) => observer.observe(element));
};
