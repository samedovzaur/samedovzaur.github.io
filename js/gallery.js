// gallery.js: the "Now learning" teardown gallery. One generic engine renders any device spec in
// js/devices/<slug>.js (format: build/MODEL-RULES.md; engine contract: build/NOTES-v3.md).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/* Gallery order. `ready: true` once js/devices/<id>.js exists; the rest show a "coming next" card.
   name/maker/year here are only for that card; a loaded spec's own fields win. */
const DEVICES = [
  { id: "nvidia-rtx-5090", name: "GeForce RTX 5090", maker: "NVIDIA", year: "2025", ready: true },
  { id: "taalas-hardcore", name: "HC1 Hardcore Model chip", maker: "Taalas", year: "2026", ready: true },
  { id: "nvidia-jetson-orin", name: "Jetson AGX Orin", maker: "NVIDIA", year: "2022", ready: true },
  { id: "nvidia-dgx-spark", name: "DGX Spark", maker: "NVIDIA", year: "2025", ready: true },
  { id: "google-tpu", name: "TPU Ironwood (v7)", maker: "Google", year: "2025", ready: true },
  { id: "groq-lpu", name: "LPU", maker: "Groq", year: "2022", ready: true },
  { id: "tenstorrent-blackhole", name: "Blackhole p150a", maker: "Tenstorrent", year: "2024", ready: true },
];
/* Test override: ?dev=<id> marks that device ready and opens it, so a spec can be previewed before the flag is set. */
try {
  const devParam = new URLSearchParams(location.search).get("dev");
  if (devParam) { const d = DEVICES.find((x) => x.id === devParam); if (d) { d.ready = true; d.openFirst = true; } }
} catch (e) {}

/* Materials by role (MODEL-RULES rule 7). One material per part so isolate and X-ray work per part. */
const GLOW_GREEN = 0x35e0b0;
const ROLE = {
  compute: { color: 0x1a1e1c, metalness: 0.3, roughness: 0.45, env: 0.25, emissive: GLOW_GREEN, ei: 0.05 },
  memory: { color: 0x101112, metalness: 0.2, roughness: 0.55, env: 0.18 },
  io: { color: 0xd4a04c, metalness: 1, roughness: 0.28, env: 0.9 },
  power: { color: 0xc8743a, metalness: 1, roughness: 0.32, env: 0.8 },
  cooling: { color: 0x4a4f53, metalness: 0.75, roughness: 0.42, env: 0.5 },
  coolingCopper: { color: 0xb86a3c, metalness: 1, roughness: 0.3, env: 0.85 },
  structure: { color: 0x1a1b1d, metalness: 0.2, roughness: 0.72, env: 0.18 },
  interconnect: { color: 0xc8743a, metalness: 1, roughness: 0.3, env: 0.85 },
  biology: { color: 0xd9922e, metalness: 0, roughness: 0.2, env: 0.5, opacity: 0.4 },
  neuron: { color: 0xc4a4a8, metalness: 0, roughness: 0.6, env: 0.3, emissive: 0xf0a8b8, ei: 0.05 },
};
/* Tones: a real material colour that overrides the role colour (PCB colours, metal lids, gold substrates). Role still sets glow. */
const TONE = {
  copper: { color: 0x8f5a3a, metalness: 1, roughness: 0.38, env: 0.6 },
  gold: { color: 0xb08a48, metalness: 1, roughness: 0.34, env: 0.6 },
  silver: { color: 0xc9c9c4, metalness: 1, roughness: 0.22, env: 0.9 },
  nickel: { color: 0x9a9a94, metalness: 1, roughness: 0.38, env: 0.7 },
  champagne: { color: 0x7d6a48, metalness: 0.9, roughness: 0.42, env: 0.55 },
  speckle: { color: 0x8f8468, metalness: 0.6, roughness: 0.85, env: 0.3 },
  "pcb-green": { color: 0x12402c, metalness: 0.1, roughness: 0.6, env: 0.2 },
  "pcb-blue": { color: 0x12325c, metalness: 0.1, roughness: 0.6, env: 0.2 },
  "pcb-orange": { color: 0xb8651d, metalness: 0.15, roughness: 0.55, env: 0.25 },
  "pcb-black": { color: 0x141516, metalness: 0.15, roughness: 0.6, env: 0.2 },
  graphite: { color: 0x202224, metalness: 0.3, roughness: 0.6, env: 0.25 },
  matte: { color: 0x2a2b2c, metalness: 0.05, roughness: 0.9, env: 0.1 },
  anodised: { color: 0x4a4f53, metalness: 0.75, roughness: 0.42, env: 0.5 },
  "die-colour": { color: 0x3b4a6b, metalness: 0.7, roughness: 0.25, env: 0.9 },
  neuron: { color: 0xc4a4a8, metalness: 0, roughness: 0.6, env: 0.3, emissive: 0xf0a8b8, ei: 0.05 },
};
const FLOW_COLOR = 0xda702c;
const LEVEL_RADIUS = 5; // every level is normalised to this scene radius (assembled)

const $ = (s) => document.querySelector(s);
const gallery = $("[data-gallery]");
const stage = $("[data-g-stage]");
const ui = {
  name: $("[data-g-name]"),
  meta: $("[data-g-meta]"),
  idx: $("[data-g-idx]"),
  year: $("[data-g-year]"),
  count: $("[data-g-count]"),
  total: $("[data-g-total]"),
  dots: $("[data-g-dots]"),
  parts: $("[data-g-parts]"),
  arc: $("[data-g-arc]"),
  crumbs: $("[data-g-crumbs]"),
  slider: $("[data-g-explode]"),
  readout: $("[data-g-readout]"),
  xray: $("[data-g-xray]"),
  reset: $("[data-g-reset]"),
  enter: $("[data-g-enter]"),
  prev: $("[data-g-prev]"),
  next: $("[data-g-next]"),
  details: $("[data-g-details]"),
  drawer: $("[data-g-drawer]"),
  dname: $("[data-g-dname]"),
  dbody: $("[data-g-dbody]"),
  close: $("[data-g-close]"),
  label: $("[data-g-label]"),
  ctrl: $("[data-g-ctrl]"),
  coming: $("[data-g-coming]"),
  comingText: $("[data-g-coming-text]"),
  comingSrc: $("[data-g-coming-src]"),
  fallback: $("[data-g-fallback]"),
};
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v) => v * v * (3 - 2 * v);
const seg = (t, a, b) => (b <= a ? (t >= b ? 1 : 0) : smooth(clamp01((t - a) / (b - a))));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pad2 = (n) => String(n).padStart(2, "0");

function announceReady() {
  if (window.__galleryReady) return;
  window.__galleryReady = true;
  window.dispatchEvent(new Event("gallery:ready"));
}

/* ---------- Spec loading ---------- */
const specCache = new Map();
function loadSpec(entry) {
  if (!entry.ready) return Promise.resolve(null);
  if (!specCache.has(entry.id)) specCache.set(entry.id, import(`./devices/${entry.id}.js?v=1107`).then((m) => m.default));
  return specCache.get(entry.id);
}

/* ---------- Geometry ---------- */
function roundedRectShape(w, d, r, shape) {
  const p = shape || new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  r = Math.min(r, w / 2, d / 2);
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y);
  p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + d - r);
  p.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  p.lineTo(x + r, y + d);
  p.quadraticCurveTo(x, y + d, x, y + d - r);
  p.lineTo(x, y + r);
  p.quadraticCurveTo(x, y, x + r, y);
  return p;
}
// An extruded footprint (XZ plane), centred on the origin in all three axes.
function extrudeXZ(shape, h, curveSegments = 32) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments });
  g.rotateX(-Math.PI / 2).translate(0, -h / 2, 0);
  return g;
}
function fanGeometry(w, h, d, blades) {
  const R = 0.5;
  const ring = new THREE.TorusGeometry(R * 0.97, 0.025, 8, 64).rotateX(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(R * 0.26, R * 0.26, 0.9, 32);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(R * 0.24, -0.07);
  bladeShape.quadraticCurveTo(R * 0.62, -0.2, R * 0.93, -0.1);
  bladeShape.quadraticCurveTo(R * 0.97, 0.06, R * 0.9, 0.2);
  bladeShape.quadraticCurveTo(R * 0.58, 0.14, R * 0.24, 0.07);
  const parts = [ring, hub];
  for (let i = 0; i < blades; i++) {
    const b = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.06, bevelEnabled: false, curveSegments: 8 });
    b.translate(0, 0, -0.03).rotateX(-Math.PI / 2).rotateX(0.35).rotateY((i / blades) * Math.PI * 2);
    parts.push(b);
  }
  const merged = mergeGeometries(parts.map((g) => (g.index ? g.toNonIndexed() : g)), false);
  parts.forEach((g) => g.dispose());
  merged.scale(w, h, d);
  return merged;
}
function wellGeometry(w, h, d) {
  const tube = new THREE.CylinderGeometry(0.5, 0.5, 1, 48, 1, true);
  const floor = new THREE.CircleGeometry(0.5, 48).rotateX(-Math.PI / 2).translate(0, -0.5, 0);
  const g = mergeGeometries([tube, floor].map((x) => (x.index ? x.toNonIndexed() : x)), false);
  tube.dispose();
  floor.dispose();
  g.scale(w, h, d);
  return g;
}
/* Small bevel on every plain box: real parts have no razor edges, and the bevel is what catches the light. */
function bevelBox(w, h, d) {
  const m = Math.min(w, h, d);
  const r = Math.min(m * 0.45, Math.max(0.006, Math.min(m * 0.18, 0.035)));
  return m < 0.012 ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 2, r);
}

function shapeGeometry(ps, w, h, d, k = 1) {
  const holes = ps.holes;
  switch (ps.shape) {
    case "rbox":
      return new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.3);
    case "cyl":
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 40).scale(w, h, d);
    case "fan":
      return fanGeometry(w, h, d, ps.blades || 7);
    case "well":
      return wellGeometry(w, h, d);
    case "wafer":
      return new THREE.CylinderGeometry(0.5, 0.5, 1, 96).scale(w, h, d);
    case "frame": {
      const wall = ps.wall ? ps.wall * k : Math.min(w, d) * 0.02;
      const outer = roundedRectShape(w, d, Math.min(w, d) * 0.04);
      outer.holes.push(roundedRectShape(w - 2 * wall, d - 2 * wall, Math.min(w, d) * 0.03, new THREE.Path()));
      return extrudeXZ(outer, h, 12);
    }
    default: {
      if (holes && holes.length) {
        const s = roundedRectShape(w, d, Math.min(w, d) * 0.04);
        holes.forEach(([hx, hz, dia]) => {
          const p = new THREE.Path();
          p.absarc(hx * k, -hz * k, (dia * k) / 2, 0, Math.PI * 2, true);
          s.holes.push(p);
        });
        return extrudeXZ(s, h, 48);
      }
      return bevelBox(w, h, d);
    }
  }
}

/* Instance cells for a part, in scene units, relative to the part's pos.
   at:   explicit list [[x,y,z,ry?], ...] (mm, relative to pos); each instance has the part's size.
   grid: {nx, nz, ny?, gap} divides the size footprint into equal cells (row-major: x, then z, then layers up). */
function cellsOf(ps, k) {
  if (ps.at) {
    return { cell: ps.size.map((v) => v * k), cells: ps.at.map((a) => ({ x: a[0] * k, y: a[1] * k, z: a[2] * k, ry: a[3] || 0, layer: 0 })) };
  }
  if (!ps.grid) return null;
  const { nx = 1, nz = 1, ny = 1, gap = 0 } = ps.grid;
  const [W, H, D] = ps.size;
  const cw = (W - (nx - 1) * gap) / nx;
  const cd = (D - (nz - 1) * gap) / nz;
  const ch = (H - (ny - 1) * gap) / ny;
  let cells = [];
  for (let l = 0; l < ny; l++) {
    for (let r = 0; r < nz; r++) {
      for (let c = 0; c < nx; c++) {
        cells.push({
          x: (-W / 2 + cw / 2 + c * (cw + gap)) * k,
          y: (-H / 2 + ch / 2 + l * (ch + gap)) * k,
          z: (-D / 2 + cd / 2 + r * (cd + gap)) * k,
          ry: 0,
          layer: l,
        });
      }
    }
  }
  if (ps.shape === "wafer") {
    // dies that fit entirely inside the wafer circle
    const R = (Math.min(W, D) / 2) * k;
    const hw = (cw / 2) * k;
    const hd = (cd / 2) * k;
    cells = cells.filter((c) => Math.hypot(Math.abs(c.x) + hw, Math.abs(c.z) + hd) <= R * 0.98);
  }
  const n = ps.count !== undefined ? Math.min(ps.count, cells.length) : cells.length;
  return { cell: [cw * k, ch * k, cd * k], cells: cells.slice(0, n) };
}

/* ---------- Glow shader for instanced compute units: a travelling wave plus sparse firings ---------- */
function addGlow(material, uniforms) {
  material.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
attribute float aIdx;
attribute float aOn;
uniform float uTime;
uniform float uHover;
uniform vec2 uPitch;
uniform vec2 uCenter;
varying float vGlow;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
#ifdef USE_INSTANCING
  vec2 cellP = (vec2(instanceMatrix[3][0], instanceMatrix[3][2]) - uCenter) / uPitch;
#else
  vec2 cellP = vec2(0.0);
#endif
  float w1 = pow(0.5 + 0.5 * sin((cellP.x * 0.5 + cellP.y * 0.9) * 0.7 - uTime * 2.4), 6.0);
  float w2 = pow(0.5 + 0.5 * sin(length(cellP * vec2(1.0, 1.8)) * 0.9 - uTime * 1.7), 10.0) * 0.8;
  float h = fract(sin(aIdx * 127.1 + floor(uTime * 5.0) * 311.7) * 43758.5453);
  float fire = step(0.965, h) * 0.9;
  vGlow = (0.05 + w1 * 0.95 + w2 + fire) * aOn;
  if (abs(aIdx - uHover) < 0.5) vGlow = 2.4;`
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uGlowColor;\nuniform float uGlowGain;\nvarying float vGlow;")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * vGlow * uGlowGain;");
  };
  material.customProgramCacheKey = () => "g-glow";
}

/* Procedural grain (no image files): a fine noise for bump, and brushed streaks for metal roughness. */
let TEXS = null;
function grainTextures() {
  if (TEXS) return TEXS;
  const make = (fn) => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const img = g.createImageData(256, 256);
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const v = Math.max(0, Math.min(255, fn(x, y)));
      const i = (y * 256 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  };
  const rowNoise = Array.from({ length: 256 }, () => Math.random());
  const noise = make(() => 128 + (Math.random() - 0.5) * 110);
  const brushed = make((x, y) => 215 + (rowNoise[y] - 0.5) * 80 + (Math.random() - 0.5) * 24);
  noise.repeat.set(5, 5);
  brushed.repeat.set(2, 6);
  TEXS = { noise, brushed };
  return TEXS;
}

const CLEARCOAT = { "pcb-green": 0.7, "pcb-blue": 0.7, "pcb-orange": 0.7, "pcb-black": 0.7, graphite: 0.35, matte: 0.1, "die-colour": 1 };
const BRUSHED = new Set(["silver", "nickel", "anodised", "champagne"]);

function makeMaterial(ps) {
  const base = ROLE[ps.role];
  if (!base) throw new Error(`unknown role "${ps.role}" on part "${ps.id}"`);
  if (ps.tone && !TONE[ps.tone]) throw new Error(`unknown tone "${ps.tone}" on part "${ps.id}"`);
  const r = ps.tone ? { ...base, ...TONE[ps.tone] } : base;
  const m = new THREE.MeshPhysicalMaterial({
    color: ps.shape === "fan" ? 0x2c2f32 : r.color,
    metalness: r.metalness,
    roughness: r.roughness,
    envMapIntensity: Math.min(1.6, r.env * 1.35),
    side: ps.shape === "well" ? THREE.DoubleSide : THREE.FrontSide,
  });
  const T = grainTextures();
  const cc = CLEARCOAT[ps.tone] ?? (ps.role === "structure" || ps.role === "memory" ? 0.25 : 0);
  if (cc) {
    m.clearcoat = cc;
    m.clearcoatRoughness = 0.32;
  }
  if (ps.tone === "die-colour") {
    m.iridescence = 0.7;
    m.iridescenceIOR = 1.6;
  }
  if (r.metalness > 0.6 && BRUSHED.has(ps.tone || "")) {
    m.roughnessMap = T.brushed;
    m.bumpMap = T.noise;
    m.bumpScale = 0.15;
  } else if (r.metalness > 0.6) {
    m.bumpMap = T.noise;
    m.bumpScale = 0.1;
  } else {
    m.bumpMap = T.noise;
    m.bumpScale = 0.18;
  }
  if (r.emissive) {
    m.emissive.set(r.emissive);
    m.emissiveIntensity = r.ei;
  }
  m.userData.baseOpacity = r.opacity ?? 1;
  if (r.opacity !== undefined) {
    m.transparent = true;
    m.opacity = r.opacity;
    m.depthWrite = false;
  }
  m.userData.baseEmissive = m.emissive.clone();
  m.userData.baseEmissiveIntensity = m.emissiveIntensity;
  return m;
}

/* ---------- Renderer ---------- */
function makeRenderer() {
  const canvas = document.createElement("canvas");
  const attrs = { antialias: true, alpha: true, powerPreference: "high-performance" };
  const gl = canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs);
  if (!gl) return null;
  try {
    return new THREE.WebGLRenderer({ canvas, context: gl, antialias: true, alpha: true });
  } catch (err) {
    return null;
  }
}

/* Soft round floor for the product-render look: reflects the key light and shows the cast shadow. */
function floorAlphaTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, 256, 256);
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(0.45, "#9a9a9a");
  grd.addColorStop(1, "#000000");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function contactShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, "rgba(0,0,0,0.75)");
  grd.addColorStop(0.55, "rgba(0,0,0,0.3)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- Engine ---------- */
const state = {
  index: 0,
  spec: null,
  levelStack: [],
  t: 0,
  target: 0,
  xray: false,
  isolated: null,
  hovered: null,
  hoveredInstance: -1,
  busy: false,
};

let engine = null;

function initEngine() {
  const renderer = makeRenderer();
  if (!renderer) return null;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  stage.appendChild(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(6, 13, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 2, far: 40 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe8ecf2, 1.1);
  rim.position.set(-9, 5, -10);
  scene.add(rim);
  const fill = new THREE.HemisphereLight(0xb8c0cc, 0x15171a, 0.45);
  scene.add(fill);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 400);
  const HOME_DIR = new THREE.Vector3(0.95, 0.9, 1.25).normalize();
  camera.position.copy(HOME_DIR).multiplyScalar(30);
  const controls = new OrbitControls(camera, canvas);
  canvas.style.touchAction = "pan-y";
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.rotateSpeed = 0.7;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = 1.5;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 0.55;

  const shadowTex = contactShadowTexture();
  const floorAlpha = floorAlphaTexture();
  const glowTime = { value: 0 };
  return { renderer, canvas, scene, camera, controls, HOME_DIR, shadowTex, floorAlpha, glowTime, level: null };
}

/* Build one level of the current spec into a fresh group. */
function buildLevel(spec, levelIndex) {
  const E = engine;
  const L = spec.levels[levelIndex];
  const group = new THREE.Group();

  // Normalise: assembled bounds in mm -> LEVEL_RADIUS scene units
  const mmBounds = new THREE.Box3();
  L.parts.forEach((ps) => {
    const half = new THREE.Vector3(ps.size[0] / 2, ps.size[1] / 2, ps.size[2] / 2);
    const c = new THREE.Vector3().fromArray(ps.pos);
    if (ps.at) ps.at.forEach((a) => {
      const ac = c.clone().add(new THREE.Vector3(a[0], a[1], a[2]));
      const hh = a[3] ? new THREE.Vector3(half.z, half.y, half.x) : half;
      mmBounds.expandByPoint(ac.clone().sub(hh)).expandByPoint(ac.clone().add(hh));
    });
    else mmBounds.expandByPoint(c.clone().sub(half)).expandByPoint(c.clone().add(half));
  });
  const mmSphere = mmBounds.getBoundingSphere(new THREE.Sphere());
  const k = LEVEL_RADIUS / mmSphere.radius;

  const parts = new Map();
  const meshes = [];
  const movers = L.parts.filter((p) => p.explode && p.explode.dist);
  L.parts.forEach((ps) => {
    const material = makeMaterial(ps);
    const cellInfo = cellsOf(ps, k);
    const base = new THREE.Vector3().fromArray(ps.pos).multiplyScalar(k);
    const holder = new THREE.Group();
    holder.position.copy(base);
    group.add(holder);
    const glowing = Boolean(ps.glow) && Boolean(cellInfo) && ps.shape !== "wafer";
    let mesh;
    let disc = null;
    if (ps.shape === "wafer") {
      disc = new THREE.Mesh(shapeGeometry(ps, ps.size[0] * k, ps.size[1] * k, ps.size[2] * k, k), material);
      disc.userData.part = ps.id;
      holder.add(disc);
      meshes.push(disc);
    }
    const dieRole = ps.shape === "wafer" && cellInfo ? { ...ps, shape: "box", role: "compute" } : null;
    if (cellInfo) {
      const [cw, ch, cd] = cellInfo.cell;
      const cellH = ps.shape === "wafer" ? Math.max(ch * 0.04, 0.004) : ch;
      const geo = shapeGeometry(dieRole || ps, cw, cellH, cd, k);
      const n = cellInfo.cells.length;
      const idx = new Float32Array(n);
      const on = new Float32Array(n);
      const off = new Set(ps.off || []);
      for (let i = 0; i < n; i++) {
        idx[i] = i;
        on[i] = off.has(i) ? 0 : 1;
      }
      geo.setAttribute("aIdx", new THREE.InstancedBufferAttribute(idx, 1));
      geo.setAttribute("aOn", new THREE.InstancedBufferAttribute(on, 1));
      const mat = dieRole ? makeMaterial(dieRole) : material;
      if (glowing || dieRole) {
        const pitch = ps.grid
          ? new THREE.Vector2(cw + (ps.grid.gap || 0) * k, cd + (ps.grid.gap || 0) * k)
          : new THREE.Vector2(cw * 1.15, cd * 1.15);
        mat.userData.glow = {
          uTime: E.glowTime,
          uHover: { value: -1 },
          uPitch: { value: pitch },
          uCenter: { value: new THREE.Vector2(0, 0) },
          uGlowColor: { value: new THREE.Color(ps.tone === "neuron" ? 0xf0a8b8 : GLOW_GREEN) },
          uGlowGain: { value: 0.55 },
        };
        addGlow(mat, mat.userData.glow);
      }
      mesh = new THREE.InstancedMesh(geo, mat, n);
      if (dieRole) {
        mesh.position.y = (ps.size[1] * k) / 2 + cellH / 2;
      }
      mesh.userData.cells = cellInfo.cells;
      mesh.userData.offSet = off;
    } else if (!disc) {
      mesh = new THREE.Mesh(shapeGeometry(ps, ps.size[0] * k, ps.size[1] * k, ps.size[2] * k, k), material);
      if (ps.rot) mesh.rotation.set(ps.rot[0], ps.rot[1], ps.rot[2]);
    }
    if (disc) { disc.castShadow = true; disc.receiveShadow = true; }
    if (mesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData.part = ps.id;
      holder.add(mesh);
      meshes.push(mesh);
    }
    const ex = ps.explode || {};
    const dir = new THREE.Vector3().fromArray(ex.dir || [0, 1, 0]);
    if (dir.lengthSq() > 0) dir.normalize();
    const mi = movers.indexOf(ps);
    const at = ex.at || (mi < 0 ? [0, 1] : [0.45 * (mi / Math.max(1, movers.length - 1)), 0]);
    if (!ex.at && mi >= 0) at[1] = Math.min(1, at[0] + 0.55);
    parts.set(ps.id, {
      spec: ps,
      holder,
      mesh,
      disc,
      material,
      materials: [material, mesh && mesh.material !== material ? mesh.material : null].filter(Boolean),
      base,
      dir,
      dist: (ex.dist || 0) * k,
      at,
      spread: ex.spread || 0,
      layerGap: (ex.layers || 0) * k,
      offset: new THREE.Vector3(),
      cellInfo,
      k,
    });
  });

  // Ghost outline of the parent part (rule 4): its footprint, faint, under this level
  let ghost = null;
  if (L.parentPart) {
    const parentSpec = spec.levels.slice(0, levelIndex).flatMap((l) => l.parts).find((p) => p.id === L.parentPart);
    if (parentSpec) {
      let [w, , d] = parentSpec.size;
      if (parentSpec.grid) {
        const { nx = 1, nz = 1, gap = 0 } = parentSpec.grid;
        w = (w - (nx - 1) * gap) / nx;
        d = (d - (nz - 1) * gap) / nz;
      }
      const fw = mmBounds.max.x - mmBounds.min.x;
      const fd = mmBounds.max.z - mmBounds.min.z;
      // real footprint, clamped so a much larger parent stays a frame around this level, not off screen
      w = Math.min(Math.max(w, fw * 1.06), fw * 1.35) * k;
      d = Math.min(Math.max(d, fd * 1.06), fd * 1.35) * k;
      const pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2], [-w / 2, -d / 2]].map(
        ([x, z]) => new THREE.Vector3(x, 0, z)
      );
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      ghost = new THREE.Line(g, new THREE.LineDashedMaterial({ color: 0x878580, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.55 }));
      ghost.computeLineDistances();
      ghost.position.set((mmBounds.min.x + mmBounds.max.x) / 2 * k, mmBounds.min.y * k - 0.01, (mmBounds.min.z + mmBounds.max.z) / 2 * k);
      group.add(ghost);
    }
  }

  // Contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: E.shadowTex, transparent: true, depthWrite: false, opacity: 0.6 })
  );
  shadow.position.set(mmSphere.center.x * k, mmBounds.min.y * k - 0.02, mmSphere.center.z * k);
  const sw = (mmBounds.max.x - mmBounds.min.x) * k * 1.5;
  const sd = (mmBounds.max.z - mmBounds.min.z) * k * 1.5;
  shadow.scale.set(Math.max(sw, 2), 1, Math.max(sd, 2));
  shadow.renderOrder = -1;
  shadow.material.opacity = 0.35;
  group.add(shadow);
  const catcher = new THREE.Mesh(
    new THREE.CircleGeometry(1, 72).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x0b0c0e, roughness: 0.5, metalness: 0.15, envMapIntensity: 0.3, transparent: true, opacity: 0.9, alphaMap: E.floorAlpha, depthWrite: false })
  );
  catcher.position.copy(shadow.position);
  catcher.position.y += 0.005;
  const fr = Math.max(Math.hypot(sw, sd) * 0.36, 4.2);
  catcher.scale.set(fr, 1, fr);
  catcher.receiveShadow = true;
  catcher.renderOrder = -2;
  group.add(catcher);

  // Flows: dots along arcs (instanced, one draw call) plus their paths (one draw call)
  const flows = [].map((f) => {
    if (!parts.has(f.from) || !parts.has(f.to)) throw new Error(`flow ${f.from} -> ${f.to}: unknown part`);
    return { ...f, speed: f.speed ?? 0.5 };
  });
  const DOTS = 4;
  const srcCount = (f) => {
    const p = parts.get(f.from);
    return p.cellInfo && p.cellInfo.cells.length <= 16 ? p.cellInfo.cells.length : 1;
  };
  const totalDots = flows.reduce((s, f) => s + srcCount(f) * DOTS, 0);
  let flowDots = null;
  let flowLines = null;
  if (totalDots) {
    flowDots = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.032, 8, 6),
      new THREE.MeshBasicMaterial({ color: FLOW_COLOR, transparent: true, opacity: 0.95, depthTest: false }),
      totalDots
    );
    flowDots.renderOrder = 10;
    flowDots.frustumCulled = false;
    group.add(flowDots);
    const segs = flows.reduce((s, f) => s + srcCount(f) * 16, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(segs * 2 * 3), 3));
    flowLines = new THREE.LineSegments(
      g,
      new THREE.LineBasicMaterial({ color: FLOW_COLOR, transparent: true, opacity: 0.35, depthTest: false })
    );
    flowLines.renderOrder = 9;
    flowLines.frustumCulled = false;
    group.add(flowLines);
  }

  const level = { spec: L, index: levelIndex, group, parts, meshes, ghost, shadow, flows, flowDots, flowLines, srcCount, DOTS, k, sphere0: null, sphere1: null };
  // fit spheres at assembled and fully exploded
  applyTeardown(level, 1, 0);
  level.sphere1 = levelBounds(level).getBoundingSphere(new THREE.Sphere());
  applyTeardown(level, 0, 0);
  level.sphere0 = levelBounds(level).getBoundingSphere(new THREE.Sphere());
  return level;
}

function levelBounds(level) {
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  for (const p of level.parts.values()) {
    const ps = p.spec;
    const half = new THREE.Vector3(ps.size[0] / 2, ps.size[1] / 2, ps.size[2] / 2).multiplyScalar(p.k);
    const origin = p.holder.position;
    if (p.mesh && p.mesh.isInstancedMesh && !p.disc) {
      const m = new THREE.Matrix4();
      const cell = new THREE.Vector3().fromArray(p.cellInfo.cell).multiplyScalar(0.5);
      for (let i = 0; i < p.mesh.count; i++) {
        p.mesh.getMatrixAt(i, m);
        v.setFromMatrixPosition(m).add(origin);
        box.expandByPoint(v.clone().sub(cell)).expandByPoint(v.clone().add(cell));
      }
    } else {
      box.expandByPoint(origin.clone().sub(half)).expandByPoint(origin.clone().add(half));
    }
  }
  return box;
}

/* Place every part for teardown amount t (0 assembled, 1 exploded). */
const tmpObj = new THREE.Object3D();
function partOffset(level, p, t, seen = new Set()) {
  const out = p.dir.clone().multiplyScalar(p.dist * seg(t, p.at[0], p.at[1]));
  const f = p.spec.follow;
  if (f) {
    if (seen.has(p.spec.id)) throw new Error(`follow cycle at "${p.spec.id}"`);
    seen.add(p.spec.id);
    const parent = level.parts.get(f);
    if (!parent) throw new Error(`part "${p.spec.id}" follows unknown part "${f}"`);
    out.add(partOffset(level, parent, t, seen));
  }
  return out;
}
function applyTeardown(level, t, spin) {
  for (const p of level.parts.values()) {
    p.offset.copy(partOffset(level, p, t));
    p.holder.position.copy(p.base).add(p.offset);
    if (p.mesh && p.mesh.isInstancedMesh) {
      const e = seg(t, p.at[0], p.at[1]);
      const s = 1 + p.spread * e;
      const isFan = p.spec.shape === "fan";
      p.mesh.userData.cells.forEach((c, i) => {
        tmpObj.position.set(c.x * s, c.y + c.layer * p.layerGap * e, c.z * s);
        tmpObj.rotation.set(0, c.ry + (isFan ? spin * (i % 2 ? -1 : 1) : 0), 0);
        if (p.spec.rot && !isFan) tmpObj.rotation.set(p.spec.rot[0], c.ry + p.spec.rot[1], p.spec.rot[2]);
        tmpObj.updateMatrix();
        p.mesh.setMatrixAt(i, tmpObj.matrix);
      });
      p.mesh.instanceMatrix.needsUpdate = true;
      p.boundsDirty = true;
    } else if (p.mesh && p.spec.shape === "fan") {
      p.mesh.rotation.y = spin;
    }
  }
}

function flowEndpoint(level, id, i, out) {
  const p = level.parts.get(id);
  out.copy(p.holder.position);
  if (i >= 0 && p.mesh && p.mesh.isInstancedMesh && p.mesh.userData.cells[i]) {
    const m = new THREE.Matrix4();
    p.mesh.getMatrixAt(i, m);
    out.add(new THREE.Vector3().setFromMatrixPosition(m));
  }
  out.y += (p.spec.size[1] * p.k) / 2;
  return out;
}
const A = new THREE.Vector3();
const B = new THREE.Vector3();
const C = new THREE.Vector3();
const P = new THREE.Vector3();
function applyFlows(level, time) {
  if (!level.flowDots) return;
  let d = 0;
  let s = 0;
  const pos = level.flowLines.geometry.attributes.position;
  const r = level.sphere0.radius;
  level.flows.forEach((f) => {
    const n = level.srcCount(f);
    const rate = 0.12 + 0.6 * f.speed;
    for (let j = 0; j < n; j++) {
      flowEndpoint(level, f.from, n > 1 ? j : -1, A);
      flowEndpoint(level, f.to, -1, B);
      C.copy(A).add(B).multiplyScalar(0.5);
      C.y += Math.max(A.distanceTo(B) * 0.35, r * 0.06);
      const bez = (u, out) => {
        const a = (1 - u) * (1 - u);
        const b = 2 * (1 - u) * u;
        const c = u * u;
        return out.set(a * A.x + b * C.x + c * B.x, a * A.y + b * C.y + c * B.y, a * A.z + b * C.z + c * B.z);
      };
      for (let q = 0; q < 16; q++) {
        bez(q / 16, P);
        pos.setXYZ(s * 2, P.x, P.y, P.z);
        bez((q + 1) / 16, P);
        pos.setXYZ(s * 2 + 1, P.x, P.y, P.z);
        s++;
      }
      for (let q = 0; q < level.DOTS; q++) {
        const u = (time * rate + q / level.DOTS + j * 0.137) % 1;
        bez(u, P);
        tmpObj.position.copy(P);
        tmpObj.rotation.set(0, 0, 0);
        const sc = (r / LEVEL_RADIUS) * (0.6 + 0.8 * Math.sin(Math.PI * u));
        tmpObj.scale.setScalar(sc);
        tmpObj.updateMatrix();
        level.flowDots.setMatrixAt(d++, tmpObj.matrix);
      }
    }
  });
  tmpObj.scale.setScalar(1);
  level.flowDots.instanceMatrix.needsUpdate = true;
  pos.needsUpdate = true;
  // on a closed device (a level with covers) flows show once it opens or in X-ray
  const covered = [...level.parts.values()].some((p) => p.spec.xray) && !state.xray;
  const vis = covered ? seg(state.t, 0.15, 0.6) : 1;
  level.flowDots.material.opacity = 0.95 * vis;
  level.flowLines.material.opacity = 0.35 * vis;
  level.flowDots.visible = level.flowLines.visible = vis > 0.01;
}

function disposeLevel(level) {
  level.group.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
  });
  engine.scene.remove(level.group);
}

/* ---------- Looks: hover, isolate, X-ray ---------- */
let highlight = new THREE.Color(0xffffff);
function applyLook() {
  const level = engine && engine.level;
  if (!level) return;
  for (const p of level.parts.values()) {
    const dim = state.isolated !== null && state.isolated !== p.spec.id;
    const xr = state.xray && p.spec.xray && state.isolated !== p.spec.id;
    const see = dim || xr;
    for (const m of p.materials) {
      const baseOp = m.userData.baseOpacity ?? 1;
      const want = see || baseOp < 1;
      if (m.transparent !== want) {
        m.transparent = want;
        m.needsUpdate = true;
      }
      m.opacity = dim ? 0.06 : xr ? 0.16 : baseOp;
      m.depthWrite = !want;
      const hot = state.hovered === p.spec.id && !(m.userData.glow && state.hoveredInstance >= 0);
      if (hot) {
        m.emissive.copy(highlight);
        m.emissiveIntensity = 0.35;
      } else {
        m.emissive.copy(m.userData.baseEmissive);
        m.emissiveIntensity = m.userData.baseEmissiveIntensity;
      }
      if (m.userData.glow) m.userData.glow.uHover.value = state.hovered === p.spec.id ? state.hoveredInstance : -1;
    }
    p.pickable = !see;
  }
  ui.xray.setAttribute("aria-pressed", String(state.xray));
  const iso = state.isolated && level.parts.get(state.isolated);
  const enterTo = iso && iso.spec.enter;
  if (enterTo) {
    const target = state.spec.levels.find((l) => l.id === enterTo);
    ui.enter.hidden = !target;
    ui.enter.textContent = "Enter: " + (target ? target.title : "");
    ui.enter.dataset.level = enterTo;
  } else {
    ui.enter.hidden = true;
  }
}

/* ---------- DOM: identity, breadcrumb, drawer ---------- */
function renderIdentity(entry, spec) {
  const name = spec ? spec.name : entry.name;
  const maker = spec ? spec.maker : entry.maker;
  const year = spec ? spec.year : entry.year;
  ui.name.textContent = name;
  ui.idx.textContent = pad2(state.index + 1);
  ui.year.textContent = year;
  ui.meta.innerHTML = [`<span class="maker">${esc(maker)}</span>`].concat(spec ? spec.hero.map(esc) : []).join(" &middot; ");
  ui.count.textContent = pad2(state.index + 1);
  ui.total.textContent = String(DEVICES.length);
  ui.dots.innerHTML = DEVICES.map((d, i) => `<li><button type="button" data-dot="${i}" aria-label="${esc(d.name)}"${i === state.index ? ' aria-current="true"' : ""}></button></li>`).join("");
  ui.dname.textContent = name;
}
/* Parts list for the current level. Hover in the list highlights the part in the model and vice versa. */
function renderParts() {
  const level = engine && engine.level;
  const list = ui.parts.firstElementChild;
  if (!level) {
    list.innerHTML = "";
    ui.parts.classList.add("is-empty");
    return;
  }
  list.innerHTML = [...level.parts.values()]
    .map((p) => {
      const ps = p.spec;
      const n = ps.count && ps.count > 1 ? `<small>&times;${esc(ps.count)}</small>` : "";
      const sch = ps.schematic ? "<em>schematic</em>" : "";
      const enter = ps.enter ? '<span class="enter">double-click to go inside</span>' : "";
      return `<li data-part="${esc(ps.id)}">${esc(ps.label)}${n}${sch}<span>${esc(ps.line)}</span>${enter}</li>`;
    })
    .join("");
  ui.parts.classList.toggle("is-empty", level.parts.size === 0);
  syncParts();
}
function syncParts() {
  /* The list follows the hovered part, or the clicked (isolated) one when nothing is hovered. */
  const active = state.hovered || state.isolated;
  let picked = null;
  for (const li of ui.parts.querySelectorAll("li")) {
    li.classList.toggle("is-on", li.dataset.part === active);
    li.classList.toggle("is-picked", li.dataset.part === state.isolated);
    if (li.dataset.part === state.isolated) picked = li;
  }
  /* scroll only the list box, never the page: page scroll drives the teardown */
  if (picked && !state.hovered) {
    const box = ui.parts;
    const top = picked.offsetTop - box.offsetTop;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (top + picked.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + picked.offsetHeight - box.clientHeight;
  }
}
function renderCrumbs() {
  const spec = state.spec;
  if (!spec) {
    ui.crumbs.innerHTML = "";
    return;
  }
  ui.crumbs.innerHTML = state.levelStack
    .map((li, i) => {
      const L = spec.levels[li];
      const last = i === state.levelStack.length - 1;
      return last
        ? `<span aria-current="step">${esc(L.title)}</span>`
        : `<button type="button" data-crumb="${i}">${esc(L.title)}</button><span class="sep" aria-hidden="true">/</span>`;
    })
    .join("");
}
function renderDrawer(entry, spec) {
  const src = spec ? spec.sourcesPath : `details/${entry.id}.md`;
  if (!spec) {
    ui.dbody.innerHTML = `<p>The 3D model for this device is coming next. The research notes are already written.</p>
      <p><a class="link mono" href="${esc(src)}">Sources: ${esc(src)} -&gt;</a></p>`;
    return;
  }
  const byLevel = (key) =>
    spec.levels
      .filter((L) => (L[key] || []).length)
      .map((L) => `<h4>${esc(L.title)}</h4><ul>${L[key].map((x) => itemHtml(key, L, x)).join("")}</ul>`)
      .join("");
  const itemHtml = (key, L, x) => {
    const label = (id) => {
      const p = L.parts.find((q) => q.id === id);
      return p ? p.label : id;
    };
    if (key === "flows") return `<li><b>${esc(label(x.from))} &rarr; ${esc(label(x.to))}</b> ${esc(x.label)}</li>`;
    return `<li><b>${esc(x.title)}</b> ${esc(x.text)}</li>`;
  };
  const glossary = (spec.glossary || []).map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("");
  ui.dbody.innerHTML = `
    ${spec.oneLine ? `<p class="g-one">${esc(spec.oneLine)}</p>` : ""}
    <section><h3 class="h-eyebrow"><span class="num">01</span>Callouts</h3>${byLevel("callouts")}</section>
    ${glossary ? `<section><h3 class="h-eyebrow"><span class="num">02</span>Glossary</h3><dl>${glossary}</dl></section>` : ""}
    <section><h3 class="h-eyebrow"><span class="num">03</span>Not published</h3><ul>${(spec.notPublished || []).map((n) => `<li>${esc(n)}</li>`).join("")}</ul></section>
    <p><a class="link mono" href="${esc(src)}">Sources: ${esc(src)} -&gt;</a></p>`;
}

/* ---------- Switching devices and levels ---------- */
function fade(out) {
  return new Promise((resolve) => {
    stage.classList.toggle("is-switching", out);
    setTimeout(resolve, reducedMotion ? 0 : 230);
  });
}
function resetView() {
  state.t = state.target = 0;
  state.isolated = null;
  state.hovered = null;
  state.hoveredInstance = -1;
  hideLabel();
}
function showLevel(levelIndex) {
  if (engine.level) disposeLevel(engine.level);
  engine.level = buildLevel(state.spec, levelIndex);
  engine.scene.add(engine.level.group);
  resetView();
  applyTeardown(engine.level, 0, 0);
  frameCamera(true);
  applyLook();
  renderCrumbs();
  renderParts();
}
async function showDevice(index) {
  if (state.busy) return;
  state.busy = true;
  state.index = (index + DEVICES.length) % DEVICES.length;
  const entry = DEVICES[state.index];
  if (engine) await fade(true);
  const spec = await loadSpec(entry);
  state.spec = spec;
  renderIdentity(entry, spec);
  renderDrawer(entry, spec);
  ui.coming.hidden = Boolean(spec);
  ui.ctrl.hidden = !spec;
  if (!spec) {
    ui.comingText.textContent = `${entry.maker} ${entry.name}`;
    ui.comingSrc.href = `details/${entry.id}.md`;
  }
  if (engine) {
    if (engine.level) {
      disposeLevel(engine.level);
      engine.level = null;
    }
    state.levelStack = spec ? [0] : [];
    if (spec) showLevel(0);
    else {
      resetView();
      renderCrumbs();
      applyLook();
    }
    await fade(false);
  } else {
    state.levelStack = spec ? [0] : [];
    renderCrumbs();
  }
  state.busy = false;
}
async function enterLevel(levelId) {
  const li = state.spec.levels.findIndex((l) => l.id === levelId);
  if (li < 0 || state.busy) return;
  state.busy = true;
  const p = engine.level.parts.get(state.isolated);
  if (p && !reducedMotion) zoomTo = p.holder.position.clone();
  await fade(true);
  zoomTo = null;
  state.levelStack.push(li);
  showLevel(li);
  await fade(false);
  state.busy = false;
}
async function goToCrumb(i) {
  if (state.busy || i >= state.levelStack.length - 1) return;
  state.busy = true;
  await fade(true);
  state.levelStack = state.levelStack.slice(0, i + 1);
  showLevel(state.levelStack[i]);
  await fade(false);
  state.busy = false;
}

/* ---------- Camera ---------- */
let fitScale = 1;
let zoomTo = null;
let userZoom = 1; /* trackpad pinch / touch pinch: 1 = framed, up to 4x closer, down to 0.6x */
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 4;
const camOffset = new THREE.Vector3();
const sph = new THREE.Spherical();
let resetting = false;
function frameCamera(snap) {
  if (!engine.level) return;
  const { camera, controls } = engine;
  const lv = engine.level;
  // frame what is on screen now: bounds at the current teardown, never smaller than assembled
  if (lv.boundsT !== state.t) {
    lv.boundsT = state.t;
    lv.sphereNow = levelBounds(lv).getBoundingSphere(new THREE.Sphere());
  }
  const c = lv.sphereNow.center;
  const r = Math.max(lv.sphereNow.radius, lv.sphere0.radius);
  const v = THREE.MathUtils.degToRad(camera.fov);
  const hf = 2 * Math.atan(Math.tan(v / 2) * camera.aspect);
  let dist = (r * fitScale) / Math.sin(Math.min(v, hf) / 2);
  const tgt = zoomTo || c;
  if (zoomTo) dist *= 0.45;
  dist /= userZoom;
  camOffset.copy(camera.position).sub(controls.target);
  if (snap) {
    controls.target.copy(tgt);
    camOffset.copy(engine.HOME_DIR);
  } else {
    controls.target.lerp(tgt, 0.12);
  }
  if (resetting) {
    const dir = camOffset.clone().normalize().lerp(engine.HOME_DIR, 0.08);
    camOffset.copy(dir);
    if (dir.angleTo(engine.HOME_DIR) < 0.003) resetting = false;
  }
  const cur = camOffset.length();
  camOffset.setLength(snap ? dist : THREE.MathUtils.lerp(cur, dist, 0.12));
  camera.near = Math.max(0.01, dist - r * 3);
  camera.far = dist + r * 4;
  camera.updateProjectionMatrix();
  camera.position.copy(controls.target).add(camOffset);
}

/* ---------- Hover label ---------- */
function hideLabel() {
  ui.label.style.transform = "translate3d(-999px, -999px, 0)";
  ui.label.classList.remove("is-on");
}
function labelHtml(p, inst) {
  const ps = p.spec;
  const n = p.mesh && p.mesh.isInstancedMesh ? p.mesh.count : 0;
  let which = "";
  if (inst >= 0 && n > 1) which = ` <i>${inst + 1} of ${ps.count ?? n}</i>`;
  const off = inst >= 0 && p.mesh.userData.offSet && p.mesh.userData.offSet.has(inst) ? " <i>disabled</i>" : "";
  const sch = ps.schematic ? ' <em class="sch">schematic</em>' : "";
  const enter = ps.enter ? '<span class="g-label-enter">double-click to go inside</span>' : "";
  return `<b>${esc(ps.label)}</b>${which}${off}${sch}<span>${esc(ps.line)}</span>${enter}`;
}

/* ---------- Main ---------- */
function start() {
  engine = initEngine();
  if (!engine) {
    ui.fallback.hidden = false;
    stage.classList.add("is-fallback");
    [ui.slider, ui.xray, ui.reset].forEach((el) => (el.disabled = true));
    announceReady();
    return;
  }
  const { renderer, canvas, camera, controls } = engine;

  function resize() {
    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fitScale = camera.aspect < 0.8 ? 1.0 : 1.12;
    camera.updateProjectionMatrix();
    if (engine.level) frameCamera(false);
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  const markInput = () => {
    if (!reducedMotion) {
      controls.autoRotate = false;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => (controls.autoRotate = true), 6000);
    }
  };
  let resumeTimer = 0;
  controls.addEventListener("start", () => {
    resetting = false;
    markInput();
  });
  const setTarget = (v) => {
    state.target = clamp01(v);
    markInput();
  };

  /* Picking */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pointer = null;
  let hoverDirty = false;
  function pick() {
    const level = engine.level;
    if (!pointer || !level) return null;
    const live = level.meshes.filter((m) => {
      const p = level.parts.get(m.userData.part);
      if (p.pickable === false) return false;
      if (m.isInstancedMesh && p.boundsDirty) {
        m.computeBoundingSphere();
        m.computeBoundingBox();
      }
      return true;
    });
    for (const p of level.parts.values()) p.boundsDirty = false;
    const rect = canvas.getBoundingClientRect();
    ndc.set(((pointer.x - rect.left) / rect.width) * 2 - 1, -((pointer.y - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(live, false);
    return hits.length ? hits[0] : null;
  }
  function showLabel(hit) {
    const level = engine.level;
    const id = hit ? hit.object.userData.part : null;
    const inst = hit && hit.instanceId !== undefined ? hit.instanceId : -1;
    if (id !== state.hovered || inst !== state.hoveredInstance) {
      state.hovered = id;
      state.hoveredInstance = inst;
      applyLook();
      syncParts();
    }
    stage.classList.toggle("is-hovering", Boolean(hit));
    if (!hit || !pointer) {
      hideLabel();
      return;
    }
    ui.label.innerHTML = labelHtml(level.parts.get(id), inst);
    ui.label.classList.add("is-on");
    const box = gallery.getBoundingClientRect();
    const lw = ui.label.offsetWidth;
    const lh = ui.label.offsetHeight;
    const x = Math.min(pointer.x - box.left + 16, box.width - lw - 8);
    const y = Math.max(8, pointer.y - box.top - lh - 14);
    ui.label.style.transform = `translate3d(${Math.round(Math.max(8, x))}px, ${Math.round(y)}px, 0)`;
  }
  canvas.addEventListener("pointermove", (e) => {
    pointer = { x: e.clientX, y: e.clientY };
    if (e.pointerType === "mouse") hoverDirty = true;
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = null;
    showLabel(null);
  });
  let down = null;
  let labelTimer = 0;
  canvas.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY, at: performance.now(), type: e.pointerType };
  });
  const endPress = (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const dt = performance.now() - down.at;
    const wasTouch = down.type !== "mouse";
    down = null;
    if (wasTouch && Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy) && dt < 350) {
      showDevice(state.index + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.hypot(dx, dy) > 6 || dt > 500 || e.type === "pointercancel") return;
    pointer = { x: e.clientX, y: e.clientY };
    const hit = pick();
    const id = hit ? hit.object.userData.part : null;
    state.isolated = id && id !== state.isolated ? id : null;
    markInput();
    showLabel(hit);
    applyLook();
    syncParts();
    if (wasTouch) {
      clearTimeout(labelTimer);
      labelTimer = setTimeout(() => {
        pointer = null;
        showLabel(null);
      }, 2600);
    }
  };
  canvas.addEventListener("pointerup", endPress);
  canvas.addEventListener("pointercancel", () => (down = null));
  canvas.addEventListener("dblclick", (e) => {
    pointer = { x: e.clientX, y: e.clientY };
    const hit = pick();
    if (!hit) return;
    const p = engine.level.parts.get(hit.object.userData.part);
    if (p.spec.enter) {
      state.isolated = p.spec.id;
      enterLevel(p.spec.enter);
    }
  });

  /* Test layout: the wheel scrolls the page (it drives the device steps); the dial tears down. */
  /* Zoom: a trackpad pinch arrives as a wheel event with ctrlKey; a phone pinch as two pointers. */
  const applyZoom = (factor) => {
    userZoom = THREE.MathUtils.clamp(userZoom * factor, ZOOM_MIN, ZOOM_MAX);
    markInput();
  };
  canvas.addEventListener("wheel", (e) => {
    if (!e.ctrlKey) return; /* plain two-finger scroll keeps scrolling the page */
    e.preventDefault();
    applyZoom(Math.exp(-e.deltaY * 0.01));
  }, { passive: false });
  const pinch = new Map();
  let pinchDist = 0;
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    pinch.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.size === 2) {
      const [a, b] = [...pinch.values()];
      pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      down = null; /* two fingers: not a tap, not a swipe */
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch" || !pinch.has(e.pointerId)) return;
    pinch.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.size !== 2) return;
    const [a, b] = [...pinch.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchDist > 0 && d > 0) applyZoom(d / pinchDist);
    pinchDist = d;
  });
  const endPinch = (e) => { pinch.delete(e.pointerId); if (pinch.size < 2) pinchDist = 0; };
  canvas.addEventListener("pointerup", endPinch);
  canvas.addEventListener("pointercancel", endPinch);

  /* Controls */
  let sliderHeld = false;
  ui.slider.addEventListener("input", () => setTarget(ui.slider.valueAsNumber / 100));
  ui.slider.addEventListener("pointerdown", () => (sliderHeld = true));
  window.addEventListener("pointerup", () => (sliderHeld = false));
  ui.xray.addEventListener("click", () => {
    state.xray = !state.xray;
    markInput();
    applyLook();
  });
  ui.reset.addEventListener("click", () => {
    setTarget(0);
    state.xray = false;
    state.isolated = null;
    userZoom = 1;
    resetting = true;
    controls.autoRotate = !reducedMotion;
    applyLook();
  });
  ui.enter.addEventListener("click", () => enterLevel(ui.enter.dataset.level));
  ui.crumbs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-crumb]");
    if (b) goToCrumb(Number(b.dataset.crumb));
  });

  window.addEventListener("theme:change", () => {
    highlight = new THREE.Color(0xffffff);
    applyLook();
  });
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    renderer.setAnimationLoop(null);
    ui.fallback.hidden = false;
    stage.classList.add("is-fallback");
  });

  /* Frame loop; paused while the gallery is off screen or the tab is hidden */
  const clock = new THREE.Clock();
  let time = 0;
  let spin = 0;
  let frames = 0;
  let shownPct = -1;
  let lastT = -1;
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reducedMotion) {
      time += dt;
      spin -= dt * (2.5 + 4 * (1 - state.t));
    }
    engine.glowTime.value = 1.3; /* static: no travelling wave or firings (Zaur, 7 Nov 2026) */
    if (reducedMotion) state.t = state.target;
    else state.t += (state.target - state.t) * (1 - Math.exp(-dt * 6));
    if (Math.abs(state.target - state.t) < 0.0005) state.t = state.target;
    const level = engine.level;
    if (level) {
      if (state.t !== lastT || level.parts.size) applyTeardown(level, state.t, spin);
      lastT = state.t;
      applyFlows(level, time);
      level.group.traverse((o) => {
        if (o.isMesh && !o.isInstancedMesh && o.material.userData && o.material.userData.baseEmissiveIntensity > 0.02 && state.hovered !== o.userData.part) {
          o.material.emissiveIntensity = o.material.userData.baseEmissiveIntensity * (1 + (reducedMotion ? 0 : 0.8 * Math.sin(time * 2)));
        }
      });
    }
    frameCamera(false);
    controls.update();
    if (hoverDirty && level) {
      hoverDirty = false;
      showLabel(pick());
    }
    const pct = Math.round(state.t * 100);
    if (pct !== shownPct) {
      shownPct = pct;
      ui.readout.textContent = pct + "%";
      if (!sliderHeld) ui.slider.value = String(pct);
      ui.arc.style.strokeDashoffset = String(238.76 * (1 - pct / 100));
    }
    renderer.render(engine.scene, camera);
    frames += 1;
    if (frames === 2) {
      stage.classList.add("is-live");
      announceReady();
    }
  }
  let visible = true;
  const run = () => renderer.setAnimationLoop(visible && !document.hidden ? frame : null);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    clock.getDelta();
    run();
  }).observe(gallery);
  document.addEventListener("visibilitychange", () => {
    clock.getDelta();
    run();
  });
  run();
}

/* Device switching: buttons, keyboard arrows (while the gallery is in view), swipe (in endPress) */
ui.prev.addEventListener("click", () => showDevice(state.index - 1));
ui.next.addEventListener("click", () => showDevice(state.index + 1));
ui.dots.addEventListener("click", (e) => {
  const b = e.target.closest("[data-dot]");
  if (b) showDevice(Number(b.dataset.dot));
});
ui.parts.addEventListener("pointerover", (e) => {
  const li = e.target.closest("[data-part]");
  if (!li || !engine.level || state.hovered === li.dataset.part) return;
  state.hovered = li.dataset.part;
  state.hoveredInstance = -1;
  applyLook();
  syncParts();
});
ui.parts.addEventListener("pointerleave", () => {
  if (!engine.level) return;
  state.hovered = null;
  state.hoveredInstance = -1;
  applyLook();
  syncParts();
});
ui.parts.addEventListener("click", (e) => {
  const li = e.target.closest("[data-part]");
  if (!li || !engine.level) return;
  state.isolated = li.dataset.part !== state.isolated ? li.dataset.part : null;
  applyLook();
  syncParts();
});
window.addEventListener("keydown", (e) => {
  const tag = (e.target.tagName || "").toLowerCase();
  if (e.key === "Escape") {
    if (!ui.drawer.hidden) closeDrawer();
    else if (state.isolated) {
      state.isolated = null;
      applyLook();
      syncParts();
    }
    return;
  }
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (tag === "input" || tag === "textarea" || tag === "select" || e.altKey || e.metaKey || e.ctrlKey) return;
  const r = gallery.getBoundingClientRect();
  if (r.bottom < window.innerHeight * 0.4 || r.top > window.innerHeight * 0.6) return;
  e.preventDefault();
  showDevice(state.index + (e.key === "ArrowRight" ? 1 : -1));
});

/* Details drawer */
function openDrawer() {
  ui.drawer.hidden = false;
  ui.details.setAttribute("aria-expanded", "true");
  ui.close.focus();
}
function closeDrawer() {
  ui.drawer.hidden = true;
  ui.details.setAttribute("aria-expanded", "false");
  ui.details.focus();
}
ui.details.addEventListener("click", () => (ui.drawer.hidden ? openDrawer() : closeDrawer()));
ui.close.addEventListener("click", closeDrawer);

start();
showDevice(Math.max(0, DEVICES.findIndex((d) => d.openFirst)));

/* Debug hook for Playwright checks. */
window.__g = { state, DEVICES, showDevice, goToCrumb, enterLevel };
