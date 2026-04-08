const ACTIVE_CLASS = "active";
const FILTERED_CLASS = "is-filtered-out";

export const initProjectFilter = () => {
  const buttons = [...document.querySelectorAll(".filter-btn")];
  const cards = [...document.querySelectorAll(".proj-row")];

  if (!buttons.length || !cards.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter ?? "all";

      buttons.forEach((item) => {
        const isCurrent = item === button;
        item.classList.toggle(ACTIVE_CLASS, isCurrent);
        item.setAttribute("aria-pressed", String(isCurrent));
      });

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle(FILTERED_CLASS, !match);
        card.style.pointerEvents = match ? "auto" : "none";
      });
    });
  });
};
