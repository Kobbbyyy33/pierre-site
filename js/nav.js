const SELECTORS = {
  nav: "#nav",
  burger: ".nav__burger",
  panel: ".nav__panel",
  smoothLinks: 'a[href^="#"]',
  spyLinks: '.nav__links a[href^="#"], .nav__panel-links a[href^="#"]'
};

const ACTIVE_CLASS = "active";
const SCROLLED_CLASS = "scrolled";
const OPEN_CLASS = "open";
const SCROLL_THRESHOLD = 80;

export const initNav = () => {
  const nav = document.querySelector(SELECTORS.nav);
  const burger = document.querySelector(SELECTORS.burger);
  const panel = document.querySelector(SELECTORS.panel);
  const smoothLinks = [...document.querySelectorAll(SELECTORS.smoothLinks)];
  const sectionLinks = [...document.querySelectorAll(SELECTORS.spyLinks)];
  const sections = [...document.querySelectorAll("main section[id]")];

  if (!nav) {
    return;
  }

  const closeMenu = () => {
    if (!burger || !panel) {
      return;
    }

    burger.setAttribute("aria-expanded", "false");
    panel.classList.remove(OPEN_CLASS);
    document.body.classList.remove("has-menu-open");
  };

  const setActiveLink = (id) => {
    if (!id) {
      return;
    }

    sectionLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle(ACTIVE_CLASS, isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const syncScrolledState = () => {
    nav.classList.toggle(SCROLLED_CLASS, window.scrollY > SCROLL_THRESHOLD);
  };

  syncScrolledState();
  window.addEventListener("scroll", syncScrolledState, { passive: true });

  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveLink(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0.2, 0.4, 0.6]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  smoothLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
      setActiveLink(target.id);
    });
  });

  if (burger && panel) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle(OPEN_CLASS, !isOpen);
      document.body.classList.toggle("has-menu-open", !isOpen);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }
};
