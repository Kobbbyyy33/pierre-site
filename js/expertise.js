export const initExpertise = () => {
  const section = document.querySelector(".expertise");
  const cards = [...document.querySelectorAll(".expertise__card")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!section || !cards.length || reduceMotion.matches) {
    return;
  }

  let ticking = false;

  const updateCards = () => {
    const viewportCenter = window.innerHeight / 2;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const delta = (cardCenter - viewportCenter) / window.innerHeight;
      const clamped = Math.max(-1, Math.min(1, delta));
      const direction = index % 2 === 0 ? -1 : 1;
      const shift = clamped * 26 * direction;
      const rotate = clamped * 2.4 * direction;
      const glow = 1 - Math.min(Math.abs(clamped) * 1.2, 1);

      card.style.setProperty("--expertise-shift", `${shift}px`);
      card.style.setProperty("--expertise-rotate", `${rotate}deg`);
      card.style.setProperty("--expertise-glow", glow.toFixed(3));
    });

    ticking = false;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-spotlit", entry.isIntersecting);
      });
    },
    {
      threshold: 0.55,
      rootMargin: "-10% 0px -18% 0px"
    }
  );

  cards.forEach((card) => observer.observe(card));
  updateCards();

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) {
        return;
      }

      window.requestAnimationFrame(updateCards);
      ticking = true;
    },
    { passive: true }
  );

  window.addEventListener("resize", updateCards, { passive: true });
};
