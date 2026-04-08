const BASE_PIXELS_PER_SECOND = 70;

export const initTicker = () => {
  const track = document.querySelector(".ticker__track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!track || reduceMotion.matches) {
    return;
  }

  const updateDuration = () => {
    const contentWidth = track.scrollWidth / 2;
    const duration = Math.max(24, Math.round(contentWidth / BASE_PIXELS_PER_SECOND));
    document.documentElement.style.setProperty("--ticker-duration", `${duration}s`);
  };

  updateDuration();
  window.addEventListener("resize", updateDuration, { passive: true });
};
