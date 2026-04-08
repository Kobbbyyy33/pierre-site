const COUNTER_DURATION = 1200;

const formatValue = (value, decimals) => {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return Math.round(value).toString();
};

const animateCounter = (element) => {
  const targetValue = Number.parseFloat(element.dataset.target ?? "0");
  const decimals = (element.dataset.target ?? "").includes(".") ? 1 : 0;
  const startTime = performance.now();

  const update = (now) => {
    const progress = Math.min((now - startTime) / COUNTER_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * targetValue;
    element.textContent = formatValue(current, decimals);

    if (progress < 1) {
      window.requestAnimationFrame(update);
    }
  };

  window.requestAnimationFrame(update);
};

export const initCounters = () => {
  const counters = document.querySelectorAll(".stat__number");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!counters.length) {
    return;
  }

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.target ?? "0";
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35
    }
  );

  counters.forEach((counter) => observer.observe(counter));
};
