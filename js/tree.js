// tree.js: test layout. Left tree with scroll spy, dotted progress meter, phone drawer,
// and the "practising" scroll steps that pick the 3D device. Device list comes from gallery.js (window.__g).
(function () {
  "use strict";

  const root = document.documentElement;
  const tree = document.querySelector("[data-tree]");
  const side = document.querySelector("[data-side]");
  const openBtn = document.querySelector("[data-tree-open]");
  const here = document.querySelector("[data-here]");
  const fills = [...document.querySelectorAll("[data-meter-fill]")];
  const pct = document.querySelector("[data-meter-pct]");
  const stepsBox = document.querySelector("[data-steps]");
  const devList = document.querySelector("[data-tree-devices]");
  const pad = (n) => String(n).padStart(2, "0");

  let links = [];
  let targets = [];
  function collect() {
    links = [...tree.querySelectorAll("a[href^='#']")];
    targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  }
  collect();


  /* Scroll spy: the last target above 30% of the viewport is "here" */
  let current = null;
  function spy() {
    const line = window.innerHeight * 0.3;
    let idx = 0;
    targets.forEach((t, i) => {
      if (t && t.getBoundingClientRect().top <= line) idx = i;
    });
    const a = links[idx];
    if (a !== current) {
      current = a;
      links.forEach((l) => l.classList.toggle("is-here", l === a));
      const top = a.closest(".tree > ol > li");
      tree.querySelectorAll(".tree > ol > li").forEach((li) => li.classList.toggle("is-open", li === top));
      if (here) here.textContent = [...a.childNodes].map((n) => n.textContent.trim()).join(" ").toLowerCase();
      const r = a.getBoundingClientRect();
      const tr = tree.getBoundingClientRect();
      if (r.top < tr.top || r.bottom > tr.bottom) a.scrollIntoView({ block: "nearest" });
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const w = Math.round(p * 100) + "%";
    fills.forEach((f) => (f.style.width = w));
    if (pct) pct.textContent = w;
  }

  /* Phone drawer */
  function setDrawer(open) {
    side.classList.toggle("is-open", open);
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
  }
  if (openBtn) openBtn.addEventListener("click", () => setDrawer(!side.classList.contains("is-open")));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });
  document.addEventListener("click", (e) => {
    if (side.classList.contains("is-open") && !side.contains(e.target) && e.target !== openBtn) setDrawer(false);
  });

  /* Device steps: one empty scroll step per device; the stage stays sticky above them */
  let steps = [];
  let want = 0;
  let shown = 0;
  function jumpTo(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    window.scrollTo({ top: y, behavior: "auto" });
  }
  tree.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    setDrawer(false);
    const el = document.getElementById(a.getAttribute("href").slice(1));
    if (el && el.classList.contains("step")) {
      e.preventDefault();
      jumpTo(el);
      history.replaceState(null, "", a.getAttribute("href"));
    }
  });

  /* Which step holds the viewport middle, and how far through it we are (0..1) */
  let tear = 0;
  let tearDirty = false;
  const TEAR_START = 0.1;
  const TEAR_SPAN = 0.55;
  function stepIndex() {
    const mid = window.innerHeight * 0.5;
    let i = 0;
    steps.forEach((s, k) => {
      if (s.getBoundingClientRect().top <= mid) i = k;
    });
    const r = steps[i].getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    const next = Math.min(1, Math.max(0, (p - TEAR_START) / TEAR_SPAN));
    if (Math.abs(next - tear) > 0.002) {
      tear = next;
      tearDirty = true;
    }
    return i;
  }

  function buildSteps(g) {
    const frag = document.createDocumentFragment();
    const treeFrag = document.createDocumentFragment();
    g.DEVICES.forEach((d, i) => {
      const s = document.createElement("div");
      s.className = "step";
      s.id = "dev-" + d.id;
      frag.appendChild(s);
      const li = document.createElement("li");
      li.innerHTML = `<a href="#dev-${d.id}"><span class="t-n">${pad(i + 1)}</span></a>`;
      li.firstChild.append(d.name);
      treeFrag.appendChild(li);
    });
    stepsBox.appendChild(frag);
    devList.appendChild(treeFrag);
    steps = [...stepsBox.children];
    collect();
    current = null;
    spy();

    /* Two-way sync: scroll picks the device; dots, arrows and swipes move the scroll */
    shown = g.state.index;
    const loop = () => {
      requestAnimationFrame(loop);
      if (g.state.busy) return;
      if (g.state.index !== shown) {
        shown = want = g.state.index;
        jumpTo(steps[shown]);
        return;
      }
      if (want !== shown) {
        shown = want;
        tearDirty = true;
        g.showDevice(want);
        return;
      }
      /* Scrolling through a step tears its device down; the dial still works between scrolls */
      if (tearDirty && g.state.spec) {
        tearDirty = false;
        g.state.target = tear;
      }
    };
    requestAnimationFrame(loop);
    const hashStep = location.hash && document.getElementById(location.hash.slice(1));
    if (hashStep && hashStep.classList.contains("step")) jumpTo(hashStep);
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
        if (steps.length) want = stepIndex();
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", spy);
  spy();

  const wait = () => (window.__g && window.__g.DEVICES ? buildSteps(window.__g) : setTimeout(wait, 60));
  wait();
  root.classList.add("tree-ready");
})();
