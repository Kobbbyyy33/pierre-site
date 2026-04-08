import { initNav } from "./nav.js";
import { initAbout } from "./about.js";
import { initReveal } from "./reveal.js";
import { initTicker } from "./ticker.js";
import { initHeroStrip } from "./strip.js";
import { initCounters } from "./counter.js";
import { initExpertise } from "./expertise.js";
import { initTimeline } from "./timeline.js";
import { initProjectFilter } from "./filter.js";
import { initProjects } from "./projects.js";
import { initForm } from "./form.js";

const init = () => {
  initNav();
  initReveal();
  initTicker();
  initHeroStrip();
  initCounters();
  initExpertise();
  initTimeline();
  initAbout();
  initProjectFilter();
  initProjects();
  initForm();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
