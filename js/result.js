(function () {
  function initResultPage() {
    var titleEl = document.getElementById("combo-title");
    var gridEl = document.getElementById("result-grid");

    if (!gridEl) return;

    DataLoader.loadCombinations()
      .then(function (data) {
        var combinations = data.combinations || [];
        var combo = null;
        var stored = sessionStorage.getItem("selectedCombination");

        if (stored) {
          try {
            var parsed = JSON.parse(stored);
            combo =
              combinations.find(function (c) {
                return c.id === parsed.id;
              }) || null;
          } catch (e) {
            combo = null;
          }
        }

        if (!combo) {
          gridEl.innerHTML =
            '<p class="error-msg">Сначала выберите цвета на странице «Своё сочетание».</p>';
          if (titleEl) titleEl.textContent = "Цвет-Цвет-Цвет";
          return;
        }

        if (titleEl) {
          titleEl.textContent = formatComboLabel(combo.colors || [combo.name]);
        }

        gridEl.innerHTML = "";
        var images = (combo.images || []).slice(0, 9);
        while (images.length < 9) images.push(null);

        for (var i = 0; i < 9; i++) {
          var cell = document.createElement("div");
          cell.className = "grid-cell";
          gridEl.appendChild(cell);
          var paths = combo.images || [];
          var start = i % paths.length;
          var rotated = paths.slice(start).concat(paths.slice(0, start));
          mountImage(cell, rotated, "");
        }
      })
      .catch(function (err) {
        gridEl.innerHTML =
          '<p class="error-msg">' + escapeHtml(err.message) + "</p>";
      });
  }

  document.addEventListener("DOMContentLoaded", initResultPage);
})();
