(function () {
  function initCombinationsPage() {
    var gridEl = document.getElementById("combinations-grid");
    if (!gridEl) return;

    DataLoader.loadCombinations()
      .then(function (data) {
        var all = data.combinations || [];
        renderGrid(gridEl, pickRandom(all, 9));
      })
      .catch(function (err) {
        gridEl.innerHTML =
          '<p class="error-msg">' + escapeHtml(err.message) + "</p>";
      });
  }

  function renderGrid(container, combos) {
    container.innerHTML = "";

    combos.forEach(function (combo) {
      var label = formatComboLabel(combo.colors || [combo.name]);
      var item = document.createElement("div");
      item.className = "grid-item";

      var cell = document.createElement("div");
      cell.className = "grid-cell";

      var caption = document.createElement("p");
      caption.className = "grid-item-label";
      caption.textContent = label;

      item.appendChild(cell);
      item.appendChild(caption);
      container.appendChild(item);

      mountImage(cell, combo.images || [], label);
    });
  }

  document.addEventListener("DOMContentLoaded", initCombinationsPage);
})();
