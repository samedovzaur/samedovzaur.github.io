// bg.js: page-wide background (fixed canvas behind all content): a small solar system with a rocket.
//  - Sun and 7 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus) on tilted orbits. Orbit periods keep the real
//    ratios between planets; Earth's year is 60 s (a time-lapse), so Mercury goes round in about 14 s and Uranus in about 84 min.
//  - A rocket flies slowly around the page by itself and chases the cursor when it moves. A thin exhaust trail follows it.
//  - The sun's light is fixed at 75%. Pauses in a hidden tab. Reduced motion: still frame.
(function () {
  "use strict";
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const EARTH_YEAR_S = 60;
  const TILT = 0.42; // orbit squash: looks like a plane seen at an angle
  const PLANETS = [
    { name: "Mercury", years: 0.241, r: 0.16, size: 2.0, g: 190 },
    { name: "Venus", years: 0.615, r: 0.24, size: 3.2, g: 215 },
    { name: "Earth", years: 1.0, r: 0.32, size: 3.4, g: 200 },
    { name: "Mars", years: 1.881, r: 0.42, size: 2.6, g: 170 },
    { name: "Jupiter", years: 11.86, r: 0.56, size: 7.0, g: 205 },
    { name: "Saturn", years: 29.46, r: 0.7, size: 5.6, g: 195, ring: true },
    { name: "Uranus", years: 84.01, r: 0.84, size: 4.2, g: 180 },
  ];
  PLANETS.forEach((p, i) => (p.a = i * 1.7 + 0.6)); // start angles, spread out

  const cv = document.createElement("canvas");
  cv.className = "bg-cv";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, sx = 0, sy = 0, Rmax = 0;

  /* sun light, fixed at 75% */
  const light = 0.75;

  function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    sx = W * 0.84; sy = H * 0.5;
    Rmax = Math.min(W * 0.62, H * 0.95) * 0.62;
    if (still) draw(0);
  }

  /* ---- rocket ---- */
  const rk = { x: 0, y: 0, vx: 24, vy: 12, trail: [], init: false };
  const mouse = { x: 0, y: 0, at: -1e9 };
  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.at = performance.now(); }, { passive: true });

  function rocketStep(dt, t) {
    if (!rk.init) { rk.x = W * 0.3; rk.y = H * 0.3; rk.init = true; }
    const live = performance.now() - mouse.at < 5000;
    const tx = live ? mouse.x : W * (0.46 + 0.36 * Math.sin(t * 0.11)) ;
    const ty = live ? mouse.y : H * (0.5 + 0.34 * Math.sin(t * 0.17 + 1.4));
    const dx = tx - rk.x, dy = ty - rk.y, d = Math.hypot(dx, dy) || 1;
    const want = Math.min(120, d * 0.5);
    const k = 1 - Math.exp(-dt / 700);
    rk.vx += ((dx / d) * want - rk.vx) * k;
    rk.vy += ((dy / d) * want - rk.vy) * k;
    rk.x += rk.vx * dt / 1000; rk.y += rk.vy * dt / 1000;
    rk.trail.push({ x: rk.x, y: rk.y });
    if (rk.trail.length > 46) rk.trail.shift();
  }

  function drawRocket(t) {
    if (!rk.init) return;
    const sp = Math.hypot(rk.vx, rk.vy), ang = Math.atan2(rk.vy, rk.vx);
    for (let i = 1; i < rk.trail.length; i++) {
      const k = i / rk.trail.length;
      ctx.strokeStyle = "rgba(255,255,255," + (k * 0.22).toFixed(3) + ")";
      ctx.lineWidth = 0.6 + k * 1.8; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(rk.trail[i - 1].x, rk.trail[i - 1].y); ctx.lineTo(rk.trail[i].x, rk.trail[i].y); ctx.stroke();
    }
    ctx.save();
    ctx.translate(rk.x, rk.y); ctx.rotate(ang); ctx.scale(1.4, 1.4);
    const fl = 5 + Math.min(10, sp * 0.1) + Math.sin(t * 35) * 1.6;
    const fg = ctx.createLinearGradient(-9, 0, -9 - fl, 0);
    fg.addColorStop(0, "rgba(255,255,255,.85)"); fg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-8, -2.2); ctx.lineTo(-9 - fl, 0); ctx.lineTo(-8, 2.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(205,205,205,.9)"; // fins
    ctx.beginPath(); ctx.moveTo(-8, -3); ctx.lineTo(-12, -7); ctx.lineTo(-3, -3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-8, 3); ctx.lineTo(-12, 7); ctx.lineTo(-3, 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(240,240,240,.95)"; // body + nose
    ctx.beginPath(); ctx.moveTo(-9, -3.2); ctx.lineTo(5, -3.2); ctx.quadraticCurveTo(12, 0, 5, 3.2); ctx.lineTo(-9, 3.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(40,40,40,.85)"; ctx.beginPath(); ctx.arc(1, 0, 1.4, 0, TAU); ctx.fill(); // window
    ctx.restore();
  }

  /* ---- sun and planets ---- */
  function drawSun() {
    const gr = 70 + light * 330, ga = 0.05 + light * 0.2;
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr);
    g.addColorStop(0, "rgba(255,255,255," + ga.toFixed(3) + ")"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(sx - gr, sy - gr, gr * 2, gr * 2);
    ctx.fillStyle = "rgba(255,255,255," + (0.4 + light * 0.6).toFixed(3) + ")";
    ctx.beginPath(); ctx.arc(sx, sy, 9 + light * 7, 0, TAU); ctx.fill();
  }

  function drawPlanet(p) {
    const ox = Math.cos(p.a) * p.r * Rmax, oy = Math.sin(p.a) * p.r * Rmax * TILT;
    const x = sx + ox, y = sy + oy, sa = Math.atan2(sy - y, sx - x);
    const lit = 0.18 + light * 0.82, r = p.size;
    const hx = x + Math.cos(sa) * r * 0.45, hy = y + Math.sin(sa) * r * 0.45 * 0.9;
    const g = ctx.createRadialGradient(hx, hy, 0, x, y, r * 1.1);
    g.addColorStop(0, "rgba(" + p.g + "," + p.g + "," + p.g + "," + (0.25 + lit * 0.7).toFixed(3) + ")");
    g.addColorStop(1, "rgba(30,30,30," + (0.55).toFixed(3) + ")");
    if (p.ring) {
      ctx.strokeStyle = "rgba(220,220,220," + (0.12 + lit * 0.4).toFixed(3) + ")"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.9, r * 0.6, -0.3, 0, TAU); ctx.stroke();
    }
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }

  function draw(dt, t) {
    t = t || 0;
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    PLANETS.forEach((p) => {
      ctx.strokeStyle = "rgba(255,255,255," + (0.035 + light * 0.05).toFixed(3) + ")";
      ctx.beginPath(); ctx.ellipse(sx, sy, p.r * Rmax, p.r * Rmax * TILT, 0, 0, TAU); ctx.stroke();
    });
    drawSun();
    PLANETS.forEach((p) => { p.a += (TAU / (p.years * EARTH_YEAR_S)) * (dt / 1000); drawPlanet(p); });
    drawRocket(t);
  }

  size();
  addEventListener("resize", size);
  if (still) { draw(0); return; }

  let on = true, last = performance.now(), T = 0;
  function frame(now) {
    if (!on) return;
    const dt = Math.min(50, now - last); last = now; T += dt / 1000;
    rocketStep(dt, T);
    draw(dt, T);
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => { on = !document.hidden; if (on) { last = performance.now(); requestAnimationFrame(frame); } });
  requestAnimationFrame(frame);
})();
