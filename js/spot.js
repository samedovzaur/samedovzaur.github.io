// spot.js: the Practising stage background. A dot grid that only shows inside a slow pool of light.
// The pool trails the cursor with lag and drifts by itself when the cursor rests. Canvas sits behind the 3D stage.
// Pauses off screen. Reduced motion: one still frame.
(function () {
  "use strict";
  const gal = document.querySelector(".scrolly .gallery");
  if (!gal) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cv = document.createElement("canvas");
  cv.className = "spot-cv";
  cv.setAttribute("aria-hidden", "true");
  gal.insertBefore(cv, gal.firstChild);
  const ctx = cv.getContext("2d");
  const S = 26;
  let w = 0, h = 0, vis = false, running = false, last = 0, t = 0, color = "#fff";
  const pos = { x: 0, y: 0 }, m = { x: 0, y: 0, at: -1e9 };

  function size() {
    const r = gal.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!pos.x) { pos.x = w / 2; pos.y = h / 2; }
    color = getComputedStyle(gal).color || "#fff";
    draw(0);
  }
  gal.addEventListener("pointermove", (e) => {
    const r = gal.getBoundingClientRect();
    m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.at = performance.now();
  }, { passive: true });

  function draw(dt) {
    t += dt / 1000;
    const live = performance.now() - m.at < 4000;
    const tx = live ? m.x : w * (0.5 + 0.3 * Math.sin(t * 0.22));
    const ty = live ? m.y : h * (0.5 + 0.26 * Math.sin(t * 0.3 + 1.2));
    pos.x += (tx - pos.x) * 0.045; pos.y += (ty - pos.y) * 0.045;
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * 0.42;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.05;
    const gr = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, R);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save(); ctx.fillStyle = gr; ctx.globalAlpha = 0.07; ctx.fillRect(0, 0, w, h); ctx.restore();
    ctx.fillStyle = color;
    for (let y = S / 2; y < h; y += S) for (let x = S / 2; x < w; x += S) {
      const d = Math.hypot(x - pos.x, y - pos.y);
      if (d > R) continue;
      const f = 1 - d / R;
      ctx.globalAlpha = f * f * 0.6;
      ctx.beginPath(); ctx.arc(x, y, 0.8 + f * 1.4, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!vis) { running = false; return; }
    const dt = Math.min(50, now - last); last = now;
    draw(dt);
    requestAnimationFrame(frame);
  }
  new IntersectionObserver((en) => {
    vis = en[0].isIntersecting;
    if (vis && !running && !still) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }).observe(gal);
  new ResizeObserver(size).observe(gal);
  size();
})();
