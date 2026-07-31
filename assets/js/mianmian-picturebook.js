export function getReaderState(requestedIndex, total) {
  const index = Math.min(Math.max(requestedIndex, 0), total - 1);
  return {
    index,
    current: index + 1,
    total,
    progress: ((index + 1) / total) * 100,
    previousDisabled: index === 0,
    nextDisabled: index === total - 1,
    showHomeLink: index === total - 1,
  };
}

export function getSwipeDirection(startX, endX, startY, endY) {
  const horizontalDistance = startX - endX;
  const verticalDistance = Math.abs(startY - endY);
  if (Math.abs(horizontalDistance) < 50 || verticalDistance > Math.abs(horizontalDistance)) {
    return 0;
  }
  return horizontalDistance > 0 ? 1 : -1;
}

function initializeReader(reader) {
  const pages = [...reader.querySelectorAll("[data-page-src]")];
  const image = reader.querySelector("[data-reader-image]");
  const previous = reader.querySelector("[data-reader-previous]");
  const next = reader.querySelector("[data-reader-next]");
  const status = reader.querySelector("[data-reader-status]");
  const progress = reader.querySelector("[data-reader-progress]");
  const homeLink = reader.querySelector("[data-reader-home]");
  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function showPage(requestedIndex) {
    const state = getReaderState(requestedIndex, pages.length);
    const page = pages[state.index];
    currentIndex = state.index;
    image.src = page.dataset.pageSrc;
    image.alt = `碧潭畔的清涼往事：195綿綿冰，第 ${state.current} 頁，共 ${state.total} 頁`;
    status.textContent = `${state.current} / ${state.total}`;
    progress.style.width = `${state.progress}%`;
    previous.disabled = state.previousDisabled;
    next.disabled = state.nextDisabled;
    homeLink.hidden = !state.showHomeLink;
  }

  previous.addEventListener("click", () => showPage(currentIndex - 1));
  next.addEventListener("click", () => showPage(currentIndex + 1));

  reader.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPage(currentIndex - 1);
    if (event.key === "ArrowRight") showPage(currentIndex + 1);
  });

  reader.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    },
    { passive: true },
  );

  reader.addEventListener(
    "touchend",
    (event) => {
      const direction = getSwipeDirection(
        touchStartX,
        event.changedTouches[0].clientX,
        touchStartY,
        event.changedTouches[0].clientY,
      );
      if (direction) showPage(currentIndex + direction);
    },
    { passive: true },
  );

  showPage(0);
}

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-picturebook-reader]").forEach(initializeReader);
}
