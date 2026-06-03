(function () {
  const thumbs = [...document.querySelectorAll(".detail-gallery-thumbs button")];
  const main = document.querySelector(".detail-gallery-main");

  if (!main || !thumbs.length) return;

  const setActiveThumb = (index) => {
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === index);
    });
  };

  setActiveThumb(0);

  if (window.jQuery && typeof window.jQuery.fn.slick === "function") {
    const $main = window.jQuery(main);

    $main.on("afterChange", (_event, _slick, currentSlide) => {
      setActiveThumb(currentSlide);
    });

    $main.slick({
      adaptiveHeight: true,
      arrows: true,
      dots: false,
      fade: true,
      infinite: true,
      speed: 350,
    });

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        $main.slick("slickGoTo", index);
      });
    });

    return;
  }

  const slides = [...main.children];
  slides.forEach((slide, index) => {
    slide.hidden = index !== 0;
  });

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      slides.forEach((slide, slideIndex) => {
        slide.hidden = slideIndex !== index;
      });
      setActiveThumb(index);
    });
  });
})();
