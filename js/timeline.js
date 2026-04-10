export const initTimeline = () => {
  const cards = [...document.querySelectorAll(".parcours__card")];
  if (cards.length < 2) return;

  const card1 = cards[0];
  const card2 = cards[1];

  const check = () => {
    const r1 = card1.getBoundingClientRect();
    const r2 = card2.getBoundingClientRect();
    // Card 1 is "behind" when card 2 overlaps it
    card1.classList.toggle("is-behind", r2.top <= r1.top + r1.height * 0.3);
  };

  window.addEventListener("scroll", () => {
    requestAnimationFrame(check);
  }, { passive: true });

  check();
};
