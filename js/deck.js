// deck.js: the Writing section. Shows the newest 7 cards; "Show all" reveals the rest. Cards are written into
// index.html by build/sync_substack.py. Without JS every card shows.
(function () {
  "use strict";
  const box = document.querySelector("[data-deck]");
  if (!box) return;
  const cards = [...box.querySelectorAll(".wcard")];
  const countEl = box.querySelector("[data-deck-count]");
  const allBtn = box.querySelector("[data-deck-all]");
  const LIMIT = parseInt(box.dataset.limit, 10) || 7;
  let expanded = false;

  function apply() {
    cards.forEach((c, i) => (c.hidden = !expanded && i >= LIMIT));
    countEl.textContent = expanded ? cards.length + " of " + cards.length : Math.min(LIMIT, cards.length);
    if (!allBtn) return;
    allBtn.hidden = cards.length <= LIMIT;
    allBtn.textContent = expanded ? "Show latest " + LIMIT : "Older posts (" + (cards.length - LIMIT) + ")";
    allBtn.setAttribute("aria-expanded", String(expanded));
  }
  if (allBtn) allBtn.addEventListener("click", () => { expanded = !expanded; apply(); });
  apply();
})();
