(function () {
  "use strict";

  function init() {
    var root = document.querySelector("[data-tl]");
    if (!root) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    if (reduced || !gsap || !ST) return;

    gsap.registerPlugin(ST);
    root.classList.add("is-live");

    var progress = root.querySelector(".tl-progress");
    var list = root.querySelector(".tl-list");
    var items = root.querySelectorAll(".tl-item");

    gsap.fromTo(progress, { scaleY: 0 }, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 1 }
    });

    items.forEach(function (item) {
      ST.create({
        trigger: item,
        start: "top 60%",
        end: "bottom 60%",
        toggleClass: { targets: item, className: "is-active" }
      });

      var card = item.querySelector(".tl-card");
      if (!card) return;
      var lines = card.querySelectorAll(".tl-label, .tl-lines li, .tl-tags");
      if (!lines.length) return;
      gsap.from(lines, {
        opacity: 0,
        y: 18,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: item, start: "top 75%", once: true }
      });
    });

    var tiles = document.querySelectorAll("#capabilities .cap-tile");
    if (tiles.length) {
      gsap.from(tiles, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: "#capabilities .cap-grid", start: "top 80%", once: true }
      });
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ST.refresh(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
