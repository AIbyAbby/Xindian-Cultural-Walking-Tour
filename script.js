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

// Lightweight Scroll listener for Header state
function handleScroll() {
  // Update header glassmorphism state
  updateHeaderState();
}

window.addEventListener("scroll", handleScroll, { passive: true });
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderState();
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

// Storybook Interactive Flipper
document.addEventListener("DOMContentLoaded", () => {
  const rightPageImg = document.querySelector(".book-page-img");
  const pageInfo = document.querySelector(".book-page-info");
  const progressFill = document.querySelector(".book-progress-fill");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  
  if (!rightPageImg || !prevBtn || !nextBtn) return;
  
  const pages = [
    "assets/images/storybook-runhua/page-01.png",
    "assets/images/storybook-runhua/page-02.png",
    "assets/images/storybook-runhua/page-03.png",
    "assets/images/storybook-runhua/page-04.png",
    "assets/images/storybook-runhua/page-05.png",
    "assets/images/storybook-runhua/page-06.png",
    "assets/images/storybook-runhua/page-07.png",
    "assets/images/storybook-runhua/page-08.png",
    "assets/images/storybook-runhua/page-09.png",
    "assets/images/storybook-runhua/page-10.png",
    "assets/images/storybook-runhua/page-11.png",
    "assets/images/storybook-runhua/page-12.png"
  ];
  
  let currentState = 0;
  
  function updateBookView() {
    rightPageImg.src = pages[currentState];
    
    if (currentState === 0) {
      pageInfo.textContent = `封面 (第 1 頁 / 12)`;
    } else if (currentState === pages.length - 1) {
      pageInfo.textContent = `封底 (第 12 頁 / 12)`;
    } else {
      pageInfo.textContent = `第 ${currentState + 1} 頁 / 12`;
    }
    
    const percent = ((currentState + 1) / pages.length) * 100;
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
    
    prevBtn.disabled = currentState === 0;
    nextBtn.disabled = currentState === pages.length - 1;
  }
  
  prevBtn.addEventListener("click", () => {
    if (currentState > 0) {
      currentState--;
      updateBookView();
    }
  });
  
  nextBtn.addEventListener("click", () => {
    if (currentState < pages.length - 1) {
      currentState++;
      updateBookView();
    }
  });
  
  updateBookView();
});
