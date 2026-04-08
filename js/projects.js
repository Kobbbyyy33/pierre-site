export const initProjects = () => {
  const stage = document.getElementById("proj-stage");
  const cursor = document.getElementById("proj-cursor");
  const rows = [...document.querySelectorAll(".proj-row")];
  const imgs = [...document.querySelectorAll(".proj-preview__img")];
  const preview = document.getElementById("proj-preview");
  const fill = document.getElementById("proj-preview-fill");
  const idx = document.getElementById("proj-preview-idx");

  if (!stage || !cursor) return;

  const total = rows.length;
  let activeProj = null;
  let curX = 0;
  let curY = 0;
  let rafId = null;

  const setCursorPos = (x, y) => {
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  };

  stage.addEventListener("mousemove", (e) => {
    curX = e.clientX;
    curY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        setCursorPos(curX, curY);
        rafId = null;
      });
    }
  });

  stage.addEventListener("mouseenter", () => {
    cursor.classList.add("is-visible");
  });

  stage.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible", "is-hovered");
    imgs.forEach((img) => img.classList.remove("is-active"));
    if (preview) preview.classList.remove("has-active");
    activeProj = null;
    if (fill) fill.style.width = "0%";
    if (idx) idx.textContent = "\u2014 survolez pour explorer";
  });

  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hovered");

      const projId = row.dataset.proj;
      if (projId === activeProj) return;
      activeProj = projId;

      imgs.forEach((img) => {
        img.classList.toggle("is-active", img.dataset.proj === projId);
      });
      if (preview) preview.classList.add("has-active");

      if (fill) {
        fill.style.width = `${(parseInt(projId, 10) / total) * 100}%`;
      }
      if (idx) {
        const n = parseInt(projId, 10);
        idx.textContent = `0${n} \u2014 ${n} / 0${total}`;
      }
    });

    row.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hovered");
    });
  });
};
