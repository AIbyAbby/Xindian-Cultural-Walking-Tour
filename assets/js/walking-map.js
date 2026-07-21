document.querySelectorAll(".walking-map-tabs").forEach((tabs) => {
  const buttons = Array.from(tabs.querySelectorAll("[data-map-mode]"));
  const panels = Array.from(document.querySelectorAll("[data-map-panel]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.mapMode;
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      panels.forEach((panel) => {
        const selected = panel.dataset.mapPanel === mode;
        panel.classList.toggle("is-active", selected);
        panel.hidden = !selected;
      });
    });
  });
});
