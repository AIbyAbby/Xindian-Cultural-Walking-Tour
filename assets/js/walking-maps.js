const lightbox = document.querySelector("#walking-map-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".walking-map-lightbox__close");
let returnFocus = null;


function closeLightbox() {
  if (!lightbox?.open) return;
  lightbox.close();
  document.body.style.overflow = "";
  lightboxImage?.classList.remove("is-zoomed");
  lightboxImage?.removeAttribute("src");
  returnFocus?.focus();
}


document.querySelectorAll("[data-map-full]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    if (!lightbox || !lightboxImage) return;
    event.preventDefault();
    returnFocus = trigger;
    lightboxImage.src = trigger.dataset.mapFull;
    lightboxImage.alt = trigger.dataset.mapAlt || "走讀地圖完整圖";
    document.body.style.overflow = "hidden";
    lightbox.showModal();
    closeButton?.focus();
  });
});


lightboxImage?.addEventListener("click", () => {
  lightboxImage.classList.toggle("is-zoomed");
});


closeButton?.addEventListener("click", closeLightbox);


lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});


lightbox?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});
