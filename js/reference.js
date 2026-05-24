(function () {
  var combinations = [];
  var colorsData = [];
  var textDescriptions = {};

  function initReferencePage() {
    var descEl = document.getElementById("color-description");
    var gridEl = document.getElementById("ref-combos-grid");
    var colorSelect = document.getElementById("ref-color-select");

    if (!gridEl || !colorSelect) return;

    Promise.all([
      DataLoader.loadDescriptions(),
      DataLoader.loadCombinations(),
      DescriptionsLoader.loadTextDescriptions(),
    ])
      .then(function (results) {
        var descriptions = results[0];
        var combosData = results[1];
        textDescriptions = results[2] || {};

        combinations = combosData.combinations || [];
        colorsData = (descriptions.colors || []).filter(function (c) {
          return getColorsWithCombinations(combinations).indexOf(c.name) !== -1;
        });

        buildColorSelect(colorSelect, colorsData);

        if (colorsData.length) {
          colorSelect.value = colorsData[0].name;
          showColor(colorsData[0].name, descEl, gridEl, colorSelect);
        }
      })
      .catch(function (err) {
        gridEl.innerHTML =
          '<p class="error-msg">' + escapeHtml(err.message) + "</p>";
      });

    colorSelect.addEventListener("change", function () {
      if (!colorSelect.value) return;
      showColor(colorSelect.value, descEl, gridEl, colorSelect);
    });
  }

  function buildColorSelect(selectEl, colors) {
    fillColorSelect(
      selectEl,
      colors.map(function (c) {
        return c.name;
      })
    );
  }

  function showColor(name, descEl, gridEl, selectEl) {
    var colorInfo = colorsData.find(function (c) {
      return c.name === name;
    });

    if (!colorInfo) return;

    applySelectColorStyle(selectEl);

    if (descEl) {
      descEl.textContent = getColorDescription(colorInfo, textDescriptions);
    }

    var ids = colorInfo.combinationIds || [];
    var combos = ids
      .map(function (id) {
        return combinations.find(function (c) {
          return c.id === id;
        });
      })
      .filter(Boolean);

    if (combos.length < 9) {
      var extra = combinations.filter(function (c) {
        return combinationHasColor(c, name);
      });
      var seen = {};
      combos.concat(extra).forEach(function (c) {
        if (!seen[c.id]) seen[c.id] = c;
      });
      combos = Object.keys(seen).map(function (k) {
        return seen[k];
      });
    }

    renderRefGrid(gridEl, combos.slice(0, 9));
  }

  function getColorBlockColor(colorName) {
    var normalized = normalizeColorName(colorName);

    if (!normalized) {
      return "#d9d9d9";
    }

    if (normalized.indexOf("бел") !== -1) {
      return "#ffffff";
    }
    if (normalized.indexOf("черн") !== -1) {
      return "#1a1a2e";
    }
    if (normalized.indexOf("крас") !== -1) {
      return "#e63946";
    }
    if (normalized.indexOf("оранж") !== -1) {
      return "#f77f00";
    }
    if (normalized.indexOf("желт") !== -1) {
      return "#ffbe0b";
    }
    if (normalized.indexOf("зел") !== -1) {
      return "#2a9d8f";
    }
    if (normalized.indexOf("голуб") !== -1) {
      return "#48cae4";
    }
    if (normalized.indexOf("син") !== -1) {
      return "#457b9d";
    }
    if (normalized.indexOf("фиолет") !== -1) {
      return "#7b2cbf";
    }
    if (normalized.indexOf("роз") !== -1) {
      return "#ff85a1";
    }
    if (normalized.indexOf("беж") !== -1) {
      return "#c4a77d";
    }
    if (normalized.indexOf("сер") !== -1) {
      return "#6c757d";
    }
    if (normalized.indexOf("корич") !== -1) {
      return "#6f4e37";
    }

    return "#d9d9d9";
  }

  function renderRefGrid(container, combos) {
    container.innerHTML = "";
    container.className = "grid-3x3 ref-combos-grid";

    var items = combos.slice(0, 9);
    while (items.length < 9) items.push(null);

    items.forEach(function (combo) {
      var item = document.createElement("div");
      item.className = "grid-item";

      if (!combo) {
        var emptyCell = document.createElement("div");
        emptyCell.className = "grid-cell grid-cell--empty";
        item.appendChild(emptyCell);
        container.appendChild(item);
        return;
      }

      var label = formatComboLabel(combo.colors || [combo.name]);
      var cell = document.createElement("div");
      cell.className = "grid-cell ref-color-cell";

      var swatchStrip = document.createElement("div");
      swatchStrip.className = "ref-swatch-strip";

      (combo.colors || [combo.name]).forEach(function (colorName) {
        var swatch = document.createElement("div");
        swatch.className = "ref-swatch";
        swatch.style.backgroundColor = getColorBlockColor(colorName);
        swatch.setAttribute("aria-label", colorName);
        swatch.title = colorName;
        swatchStrip.appendChild(swatch);
      });

      cell.appendChild(swatchStrip);

      var caption = document.createElement("p");
      caption.className = "grid-item-label";
      caption.textContent = label;

      item.appendChild(cell);
      item.appendChild(caption);
      container.appendChild(item);
    });
  }

  document.addEventListener("DOMContentLoaded", initReferencePage);
})();
