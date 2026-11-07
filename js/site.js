// site.js v3: theme, stairs nav (scroll spy), preloader. Plain script, no libraries.
// Events: window "theme:change" { theme }; listens for "gallery:ready" to finish the preloader.
(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (new URL(a.href).origin === location.origin) return;
    a.target = "_blank";
    a.rel = "noreferrer";
  });

  /* Theme: dark default, persisted choice */
  const currentTheme = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");
  function syncThemeButtons() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-label", "Switch to " + next + " theme"));
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {
        /* storage blocked: the theme still applies for this visit */
      }
      syncThemeButtons();
      document.querySelectorAll("[data-theme-name]").forEach((n) => (n.textContent = next));
      window.dispatchEvent(new CustomEvent("theme:change", { detail: { theme: next } }));
    });
  });
  syncThemeButtons();
  document.querySelectorAll("[data-theme-name]").forEach((n) => (n.textContent = currentTheme()));

  /* Stairs nav: the section nearest the top third of the viewport is active */
  const spyLinks = [...document.querySelectorAll("[data-spy]")];
  const ids = [...new Set(spyLinks.map((a) => a.dataset.spy))];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  let active = null;
  function spy() {
    const line = window.innerHeight * 0.34;
    let current = sections[0];
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
    if (!current || current.id === active) return;
    active = current.id;
    const activeIdx = ids.indexOf(active);
    spyLinks.forEach((a) => {
      const on = a.dataset.spy === active;
      a.classList.toggle("is-active", on);
      a.classList.toggle("is-done", !on && ids.indexOf(a.dataset.spy) < activeIdx);
      if (on && !a.classList.contains("ext")) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    const nav = document.querySelector("[data-stairs] .stairs-list");
    const first = nav && nav.querySelector(".is-active");
    if (first && nav.scrollWidth > nav.clientWidth) {
      const left = first.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft - 8;
      nav.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        spy();
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", spy);
  spy();

  /* Naresh-Khatri/3d-portfolio (MIT): preloader counts up, slides out on (.76, 0, .24, 1) */
  const pre = document.querySelector(".preloader");
  if (pre) {
    if (reducedMotion) {
      pre.classList.add("is-done");
    } else {
      const num = pre.querySelector("[data-pct]");
      const start = performance.now();
      const DURATION = 1600;
      let shown = 0;
      let rushFrom = null;
      let finished = false;
      const out = () => {
        if (finished) return;
        finished = true;
        if (num) num.textContent = "100";
        pre.classList.add("is-out");
        const done = () => pre.classList.add("is-done");
        pre.addEventListener("transitionend", done, { once: true });
        setTimeout(done, 1100);
      };
      const tick = (now) => {
        if (finished) return;
        let p = Math.min(1, (now - start) / DURATION);
        p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        if (rushFrom !== null) p = Math.max(p, Math.min(1, (now - rushFrom) / 260));
        shown = Math.max(shown, Math.round(p * 100));
        if (num) num.textContent = String(shown);
        if (shown >= 100) out();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const rush = () => {
        if (rushFrom === null) rushFrom = performance.now();
      };
      if (window.__galleryReady) rush();
      window.addEventListener("gallery:ready", rush, { once: true });
      setTimeout(out, 3500);
    }
  }
})();
