const initWordReveal = () => {
  const headline = document.querySelector(".about__headline-v2");
  if (!headline) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    headline.classList.add("words-visible");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          headline.classList.add("words-visible");
          observer.unobserve(headline);
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(headline);
};

const initTilt = () => {
  const tilt = document.getElementById("about-tilt");
  const inner = document.getElementById("about-tilt-inner");
  if (!tilt || !inner) return;

  if (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  let bounds = null;

  tilt.addEventListener("mouseenter", () => {
    bounds = tilt.getBoundingClientRect();
    inner.style.transition = "none";
  });

  tilt.addEventListener("mousemove", (e) => {
    if (!bounds) return;
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    inner.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  tilt.addEventListener("mouseleave", () => {
    inner.style.transition =
      "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)";
    inner.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    bounds = null;
  });
};

const initParallax = () => {
  const bgNum = document.querySelector(".about__bg-num");
  const section = document.getElementById("about");
  if (!bgNum || !section) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let ticking = false;

  const update = () => {
    const rect = section.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      const progress = -rect.top / rect.height;
      bgNum.style.transform = `translateY(${Math.min(Math.max(progress * 80, -10), 80)}px)`;
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
};

export const initAbout = () => {
  initWordReveal();
  initTilt();
  initParallax();
};
