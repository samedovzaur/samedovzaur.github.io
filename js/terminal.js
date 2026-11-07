// terminal.js v3: the "what I am doing" drop-down. Reads details/learning-sources.md (the single source),
// types its "Terminal panel lines", and makes each line open a short block from the matching section.
// Retypes on every open; reduced motion prints at once.
(function () {
  "use strict";

  const term = document.querySelector("[data-term]");
  if (!term) return;
  const list = term.querySelector("[data-term-lines]");
  const out = term.querySelector("[data-term-out]");
  const SOURCE = "details/learning-sources.md";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CHAR_MS = 16;
  const JITTER_MS = 18;
  const LINE_PAUSE_MS = 220;

  /* Which block each line opens: section heading prefix, plus an optional filter on its items */
  const BLOCKS = {
    reading: [{ h: "Sources", pick: /^(Book|Language)/ }],
    watching: [{ h: "Route", table: true }, { h: "Sources", pick: /^Lectures/ }],
    writing: [{ h: "Checkpoints", pick: /^(1|2)\b/ }, { h: "Projects", pick: /^Weeks 1 to 2/ }],
    profiling: [{ h: "Checkpoints", pick: /^2\b/ }, { h: "Projects", pick: /^Weeks 3 to 4/ }],
    building: [{ h: "Projects", pick: /^(Weeks 5|Weeks 7|Tracks)/ }, { h: "Checkpoints", pick: /^(3|4)\b/ }],
    practising: [{ h: "Sources", pick: /^(Daily|Community)/ }, { h: "Languages", text: true }],
  };

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const labelled = (s) => {
    const m = s.match(/^([^:]{2,40}):\s(.*)$/);
    return m ? `<b>${esc(m[1])}:</b> ${esc(m[2])}` : esc(s);
  };

  function parse(md) {
    const sections = {};
    let cur = null;
    md.split("\n").forEach((raw) => {
      const line = raw.trim();
      const h = line.match(/^##\s+(.*)$/);
      if (h) {
        cur = { title: h[1], items: [], rows: [], text: [] };
        sections[h[1]] = cur;
        return;
      }
      if (!cur || !line) return;
      if (line.startsWith("|")) {
        if (/^\|[\s|:-]+\|$/.test(line)) return;
        cur.rows.push(line.slice(1, -1).split("|").map((c) => c.trim()));
      } else if (/^- /.test(line)) cur.items.push(line.slice(2));
      else if (/^\d+\.\s/.test(line)) cur.items.push(line.replace(/^(\d+)\.\s/, "$1 "));
      else cur.text.push(line);
    });
    return sections;
  }

  const find = (sections, prefix) => Object.values(sections).find((s) => s.title.startsWith(prefix));

  function blockHtml(sections, verb) {
    return (BLOCKS[verb] || [])
      .map((b) => {
        const s = find(sections, b.h);
        if (!s) return "";
        if (b.table) {
          const [head, ...rows] = s.rows;
          return `<table><thead><tr>${head.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows
            .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table>`;
        }
        if (b.text) return `<p>${s.text.map(esc).join(" ")}</p>`;
        const items = s.items.filter((i) => !b.pick || b.pick.test(i));
        const isCheck = b.h === "Checkpoints";
        return `<ul>${items
          .map((i) => (isCheck ? `<li><b>checkpoint ${esc(i.split(" ")[0])}:</b> ${esc(i.slice(i.indexOf(" ") + 1))}</li>` : `<li>${labelled(i)}</li>`))
          .join("")}</ul>`;
      })
      .join("");
  }

  let lines = [];
  let ready = null;

  function build(sections) {
    const panel = find(sections, "Terminal panel lines");
    if (!panel) throw new Error("learning-sources.md has no 'Terminal panel lines' section");
    list.innerHTML = "";
    lines = panel.items.map((raw, i) => {
      const text = raw.replace(/^\d+\s/, "");
      const verb = text.split(/\s+/)[0];
      const rest = text.slice(verb.length).trim();
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "term-line";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "term-block-" + i);
      btn.innerHTML = `<span class="term-verb"></span><span class="term-rest"></span>`;
      const block = document.createElement("div");
      block.className = "term-block";
      block.id = "term-block-" + i;
      block.hidden = true;
      block.innerHTML = blockHtml(sections, verb);
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        block.hidden = open;
      });
      li.append(btn, block);
      list.appendChild(li);
      return { li, btn, verb, rest, v: btn.firstChild, r: btn.lastChild };
    });
  }

  function load() {
    if (!ready) {
      ready = fetch(SOURCE)
        .then((r) => {
          if (!r.ok) throw new Error(SOURCE + " returned " + r.status);
          return r.text();
        })
        .then((md) => build(parse(md)));
    }
    return ready;
  }

  const cursor = document.createElement("span");
  cursor.className = "term-cursor";
  cursor.setAttribute("aria-hidden", "true");
  let run = 0;
  const wait = (ms, id) =>
    new Promise((resolve, reject) => setTimeout(() => (id === run ? resolve() : reject(new Error("cancelled"))), ms));

  function printAll() {
    lines.forEach((l) => {
      l.v.textContent = l.verb;
      l.r.textContent = l.rest;
      l.li.classList.remove("is-pending");
    });
    out.classList.remove("is-pending");
    out.appendChild(cursor);
  }

  async function type(id) {
    lines.forEach((l) => {
      l.v.textContent = "";
      l.r.textContent = "";
      l.li.classList.add("is-pending");
    });
    out.classList.add("is-pending");
    await wait(200, id);
    for (const l of lines) {
      l.li.classList.remove("is-pending");
      l.btn.appendChild(cursor);
      const full = l.verb + " " + l.rest;
      for (let c = 1; c <= full.length; c++) {
        const s = full.slice(0, c);
        l.v.textContent = s.slice(0, l.verb.length);
        l.r.textContent = s.slice(l.verb.length + 1);
        await wait(CHAR_MS + Math.random() * JITTER_MS, id);
      }
      await wait(LINE_PAUSE_MS, id);
    }
    out.classList.remove("is-pending");
    out.appendChild(cursor);
  }

  term.addEventListener("toggle", () => {
    run += 1;
    const id = run;
    if (!term.open) return;
    load()
      .then(() => {
        if (id !== run) return;
        if (reducedMotion) printAll();
        else return type(id);
      })
      .catch((err) => {
        if (err.message === "cancelled") return;
        list.innerHTML = "";
        out.classList.remove("is-pending");
        throw err;
      });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && term.open) {
      term.open = false;
      term.querySelector("summary").focus();
    }
  });
})();
