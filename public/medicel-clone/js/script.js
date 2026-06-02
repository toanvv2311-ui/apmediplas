const header = document.getElementById("siteHeader");
const slider = document.getElementById("backgroundSlider");
const slides = [...document.querySelectorAll(".slide")];
const navButton = document.querySelector("[data-open='navOverlay']");
const startShape = document.getElementById("startsvg");
const morphToNav = document.getElementById("morphToNav");
const morphFromNav = document.getElementById("morphFromNav");
const blobStartPath =
  "M678,26.5c0,0-0.9,146.4-99.7,233.7c0,0-67.3,59.1-127.3,61.7s-86.2-34.6-99-49.3s-112.5-126-181.7-184.8S29.9-11,9,2.7s-2.2,59,24.7,73.1s94.7,31.7,167.3,10.4s128.2-59.8,128.2-59.8L678,26.5L678,26.5z";
const blobEndPath =
  "M678,26H180c0,0,16.5,122.9,136.5,191.9c105.4,60.7,180.7,44.1,244.7,5.4C626.4,183.9,671.4,95,678,26z";

function initSlick(
  $slideSelector,
  adaptCount,
  waitSpeed,
  animationSpeed,
  showArrowsMobile,
  autoplayMobile,
) {
  let slideCount;
  let slideCountTablet;

  if (adaptCount) {
    slideCount = $slideSelector.children().length;
    if (slideCount > 3) {
      slideCount = 3;
    }
    slideCountTablet = 2;
    if (slideCount < 2) {
      slideCountTablet = 1;
    }
  } else {
    slideCount = 1;
    slideCountTablet = 1;
  }

  $slideSelector.slick({
    adaptiveHeight: false,
    slidesToShow: slideCount,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: waitSpeed,
    speed: animationSpeed,
    responsive: [
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: slideCountTablet,
          arrows: showArrowsMobile,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 1,
          autoplay: autoplayMobile,
          arrows: showArrowsMobile,
        },
      },
    ],
  });
}

if (window.jQuery && typeof window.jQuery.fn.slick === "function") {
  const $slideSelector = window.jQuery(".home-background-slider");
  if ($slideSelector.length) {
    initSlick($slideSelector, false, 8000, 2000, false, false);
  }
} else {
  let activeSlide = 0;

  if (slides.length) {
    slides[0]?.classList.add("is-active");
    setInterval(() => {
      slides[activeSlide].classList.remove("is-active");
      activeSlide = (activeSlide + 1) % slides.length;
      slides[activeSlide].classList.add("is-active");
    }, 8000);
  }
}

window.addEventListener("scroll", () => {
  header.classList.toggle("is-small", window.scrollY >= 160);
});

if (navButton) {
  const morphIn = () => {
    header.classList.add("nav-hover");
    if (window.TweenLite && startShape) {
      window.TweenLite.to(startShape, 1, { morphSVG: blobEndPath });
    } else {
      morphToNav?.beginElement();
    }
  };

  const morphOut = () => {
    header.classList.remove("nav-hover");
    if (window.TweenLite && startShape) {
      window.TweenLite.to(startShape, 1, { morphSVG: blobStartPath });
    } else {
      morphFromNav?.beginElement();
    }
  };

  navButton.addEventListener("mouseenter", morphIn);
  navButton.addEventListener("mouseleave", morphOut);
  navButton.addEventListener("focus", morphIn);
  navButton.addEventListener("blur", morphOut);
}

document.querySelectorAll(".tile").forEach((tile) => {
  const panel = tile.querySelector(".hover-content");
  const inner = tile.querySelector(".inner-wrapper");

  const sizePanel = () => {
    const panelInset = 60;
    const height = Math.max(inner.offsetHeight, tile.offsetHeight + panelInset);
    tile.style.setProperty("--hover-height", `${height}px`);
  };

  tile.addEventListener("mouseenter", () => {
    sizePanel();
    slider.classList.add("is-blurred");
  });

  tile.addEventListener("mouseleave", () => {
    slider.classList.remove("is-blurred");
  });

  tile.addEventListener("click", () => {
    if (window.matchMedia("(hover: none)").matches) {
      document.querySelectorAll(".tile.is-open").forEach((openTile) => {
        if (openTile !== tile) openTile.classList.remove("is-open");
      });
      sizePanel();
      tile.classList.toggle("is-open");
      slider.classList.toggle("is-blurred", tile.classList.contains("is-open"));
    }
  });
});

function closeMobileTiles() {
  document.querySelectorAll(".tile.is-open").forEach((openTile) => {
    openTile.classList.remove("is-open");
  });
  slider?.classList.remove("is-blurred");
}

document.addEventListener("click", (event) => {
  if (!window.matchMedia("(hover: none)").matches) return;
  if (event.target.closest(".tile")) return;
  closeMobileTiles();
});

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.open);
    target.classList.add("is-open");
    target.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.body.classList.toggle(
      "search-open",
      button.dataset.open === "searchOverlay",
    );
    if (button.dataset.open === "navOverlay") {
      showMobileMenuPanel("main");
    }
  });
});

function showMobileMenuPanel(panelName) {
  document.querySelectorAll("[data-mobile-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.mobilePanel === panelName);
  });
}

function closeOverlay(target) {
  target.classList.remove("is-open");
  target.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (target.classList.contains("search-area")) {
    document.body.classList.remove("search-open");
  }
  if (target.classList.contains("nav-overlay")) {
    showMobileMenuPanel("main");
  }
}

document.querySelectorAll("[data-mobile-target]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showMobileMenuPanel(button.dataset.mobileTarget);
  });
});

const initialOverlay = window.location.hash
  ? document.querySelector(window.location.hash.split("-")[0])
  : null;
if (initialOverlay?.matches(".nav-overlay, .search-area")) {
  initialOverlay.classList.add("is-open");
  initialOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.body.classList.toggle(
    "search-open",
    initialOverlay.classList.contains("search-area"),
  );
  if (window.location.hash.startsWith("#navOverlay-")) {
    showMobileMenuPanel(window.location.hash.replace("#navOverlay-", ""));
  }
}

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.close);
    closeOverlay(target);
  });
});

document.addEventListener("click", (event) => {
  const navOverlay = document.getElementById("navOverlay");
  if (!navOverlay?.classList.contains("is-open")) return;
  if (!window.matchMedia("(max-width: 900px)").matches) return;
  if (navOverlay.contains(event.target)) return;
  if (event.target.closest("[data-open='navOverlay']")) return;
  closeOverlay(navOverlay);
});

document.querySelector(".search-form").addEventListener("submit", (event) => {
  event.preventDefault();
});

document.querySelectorAll(".label-focus").forEach((input) => {
  input.addEventListener("input", () => {
    input.setAttribute("value", input.value);
  });
});
