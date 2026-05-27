const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

function updateHeaderState() {
  if (!siteHeader) return;
  const isScrolled = window.scrollY > 15;
  const isNavOpen = siteNav && siteNav.classList.contains("open");
  
  if (isScrolled || isNavOpen) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    updateHeaderState();
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      updateHeaderState();
    });
  });
}

// Lightweight Scroll listener for Parallax and Header state
const heroImage = document.querySelector(".hero-media img");
const recordHeroImage = document.querySelector(".record-hero-image img");
const sourceHeroImage = document.querySelector(".source-hero-media img");

function handleScroll() {
  const scrollY = window.scrollY;
  
  // Update header glassmorphism state
  updateHeaderState();
  
  // Mobile / Touch device detection to prevent scrolling scrolling jitter
  const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
  
  if (isMobile) {
    if (heroImage) {
      heroImage.style.transform = "scale(1.12)";
    }
    if (recordHeroImage) {
      recordHeroImage.style.transform = "scale(1.08)";
    }
    if (sourceHeroImage) {
      sourceHeroImage.style.transform = "scale(1.12)";
    }
    return;
  }
  
  // Parallax effect on home page hero (only runs on desktop when visible)
  if (heroImage && scrollY < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrollY * 0.35}px) scale(1.12)`;
  }
  
  // Parallax effect on record page hero
  if (recordHeroImage && scrollY < 600) {
    recordHeroImage.style.transform = `translateY(${scrollY * 0.18}px) scale(1.08)`;
  }

  // Parallax effect on source hero (only runs on desktop when visible in viewport)
  const sourceHero = document.querySelector(".source-hero");
  if (sourceHero && sourceHeroImage) {
    const rect = sourceHero.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      const offset = (window.innerHeight - rect.top) * 0.12;
      sourceHeroImage.style.transform = `translateY(${offset}px) scale(1.12)`;
    }
  }
}

window.addEventListener("scroll", handleScroll);
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderState();
  handleScroll();
});

const filterButtons = document.querySelectorAll(".filter-button");
const storyCards = document.querySelectorAll(".story-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    storyCards.forEach((card) => {
      const categories = card.dataset.category || "";
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document
  .querySelectorAll(".theme-panel, .element-grid article, .story-card, .timeline article, .student-grid article, .memory-diagram")
  .forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });

document.querySelectorAll(".record-prose").forEach((prose) => {
  if (prose.dataset.enhanced === "true") return;
  prose.dataset.enhanced = "true";

  const nodes = Array.from(prose.children);
  let current = null;

  nodes.forEach((node, index) => {
    if (index === 0 && node.tagName === "H1") {
      node.classList.add("record-prose-title");
      return;
    }

    if (node.tagName === "H2") {
      current = document.createElement("section");
      current.className = "prose-chapter";
      prose.insertBefore(current, node);
      current.appendChild(node);
      return;
    }

    if (!current) {
      current = document.createElement("section");
      current.className = "prose-lede";
      prose.insertBefore(current, node);
    }

    current.appendChild(node);
  });

  prose.querySelectorAll("p").forEach((paragraph) => {
    const text = paragraph.textContent.trim();
    if (!text) return;

    if (/^(紀錄類別|出生年|代表性店家|口訪|總結|以下是|地址|座標|電話|營業時間|販售項目)/.test(text)) {
      paragraph.classList.add("field-line");
    }

    if (/^（[一二三四五六七八九十]+）/.test(text) || /^[0-9]+[.．、]/.test(text)) {
      paragraph.classList.add("numbered-line");
    }
  });
});
