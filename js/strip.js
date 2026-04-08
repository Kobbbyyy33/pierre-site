const SELECTORS = {
  strip: ".hero__strip",
  track: ".strip__track",
  seed: ".strip__group--seed"
};

const MIN_VISIBLE_LOOPS = 3;
const PIXELS_PER_SECOND = 68;
const FLOAT_DURATIONS = [7.5, 8.3, 9.1, 7.9, 8.8, 9.6];
const IMAGE_DURATIONS = [13, 15, 14, 16, 12, 17];
const DELAYS = [0, -1.2, -2.8, -0.7, -3.4, -1.9];

export const initHeroStrip = () => {
  const strip = document.querySelector(SELECTORS.strip);
  const track = document.querySelector(SELECTORS.track);
  const seed = document.querySelector(SELECTORS.seed);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!strip || !track || !seed || reduceMotion.matches) {
    return;
  }

  const rebuildTrack = () => {
    track.querySelectorAll(".strip__group.is-clone").forEach((group) => group.remove());

    const stripWidth = strip.getBoundingClientRect().width;
    const seedWidth = seed.getBoundingClientRect().width;

    if (!stripWidth || !seedWidth) {
      return;
    }

    const clonesNeeded = Math.max(
      MIN_VISIBLE_LOOPS - 1,
      Math.ceil((stripWidth * 2) / seedWidth)
    );

    for (let index = 0; index < clonesNeeded; index += 1) {
      const clone = seed.cloneNode(true);
      clone.classList.remove("strip__group--seed");
      clone.classList.add("is-clone");
      track.append(clone);
    }

    const duration = Math.max(18, Math.round(seedWidth / PIXELS_PER_SECOND));
    track.style.setProperty("--hero-strip-loop-width", `${seedWidth}px`);
    track.style.setProperty("--hero-strip-duration", `${duration}s`);

    [...track.querySelectorAll(".strip__item")].forEach((item, index) => {
      const patternIndex = index % FLOAT_DURATIONS.length;
      item.style.setProperty("--strip-float-duration", `${FLOAT_DURATIONS[patternIndex]}s`);
      item.style.setProperty("--strip-float-delay", `${DELAYS[patternIndex]}s`);
      item.style.setProperty("--strip-image-duration", `${IMAGE_DURATIONS[patternIndex]}s`);
      item.style.setProperty("--strip-image-delay", `${DELAYS[(patternIndex + 2) % DELAYS.length]}s`);
    });
  };

  const media = [...seed.querySelectorAll("img")];
  let loadedCount = 0;

  const onAssetReady = () => {
    loadedCount += 1;
    if (loadedCount === media.length) {
      rebuildTrack();
    }
  };

  media.forEach((image) => {
    if (image.complete) {
      onAssetReady();
      return;
    }

    image.addEventListener("load", onAssetReady, { once: true });
    image.addEventListener("error", onAssetReady, { once: true });
  });

  if (!media.length) {
    rebuildTrack();
  }

  window.addEventListener("resize", rebuildTrack, { passive: true });
};
