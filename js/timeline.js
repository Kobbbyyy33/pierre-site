export const initTimeline = () => {
  const section = document.querySelector(".xp--v2");
  const items = [...document.querySelectorAll(".xp-item")];

  if (!section || !items.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ── Assign stacking offsets ──
  // Each card sticks a bit lower than the previous so they peek out
  const CARD_GAP = 28; // px offset between each stuck card

  items.forEach((item, i) => {
    item.style.setProperty("--xp-offset", `${i * CARD_GAP}px`);
    item.style.setProperty("--xp-z", i + 1);
  });

  if (reduceMotion) return;

  // ── Scroll-driven "is-behind" class ──
  // When a card is stuck and the next card has reached its sticky position,
  // the current card gets scaled down + faded via CSS .is-behind
  let ticking = false;

  const update = () => {
    const navHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-height"
      )
    ) || 64;

    items.forEach((item, i) => {
      const stickyTop = navHeight + i * CARD_GAP;
      const rect = item.getBoundingClientRect();

      // Card is "stuck" when its top matches its sticky offset
      const isStuck = rect.top <= stickyTop + 2;

      // A card is "behind" when it's stuck AND a later (higher z-index) card
      // has scrolled up to cover it
      let coveredByNext = false;
      if (i < items.length - 1) {
        const nextRect = items[i + 1].getBoundingClientRect();
        const nextStickyTop = navHeight + (i + 1) * CARD_GAP;
        coveredByNext = nextRect.top <= nextStickyTop + 4;
      }

      item.classList.toggle("is-behind", isStuck && coveredByNext);
    });

    // Ghost number parallax
    if (!window.matchMedia("(hover: none)").matches) {
      items.forEach((item) => {
        const bgNum = item.querySelector(".xp-item__bg-num");
        if (!bgNum) return;
        const rect = item.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2 - vh / 2;
        const shift = (center / vh) * 25;
        bgNum.style.transform = `translateY(calc(-50% + ${shift.toFixed(1)}px))`;
      });
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

  window.addEventListener("resize", update, { passive: true });
  update();
};
