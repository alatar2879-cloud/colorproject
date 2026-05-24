(function () {
  var combinations = [];
  var availableColors = [];

  function initCustomPage() {
    var color1 = document.getElementById("color-1");
    var color2 = document.getElementById("color-2");
    var color3 = document.getElementById("color-3");
    var submitBtn = document.getElementById("btn-show-combo");
    var hintEl = document.getElementById("third-color-hint");

    if (!color1 || !submitBtn) return;

    DataLoader.loadCombinations()
      .then(function (data) {
        combinations = data.combinations || [];
        availableColors = getColorsWithCombinations(combinations);

        fillColorSelect(color1, availableColors);
        fillColorSelect(color2, []);
        fillColorSelect(color3, []);

        refreshDropdowns();
      })
      .catch(function () {
        submitBtn.disabled = true;
      });

    color1.addEventListener("change", function () {
      refreshDropdowns();
      applySelectColorStyle(color1);
    });

    color2.addEventListener("change", function () {
      refreshDropdowns();
      applySelectColorStyle(color2);
    });

    color3.addEventListener("change", function () {
      applySelectColorStyle(color3);
      updateSubmitState();
    });

    submitBtn.addEventListener("click", function () {
      var selected = [color1.value, color2.value, color3.value].filter(function (v) {
        return v && v !== "";
      });

      var match = findCombination(combinations, selected);
      if (!match) {
        alert("Такого сочетания нет. Выберите другие цвета.");
        return;
      }

      sessionStorage.setItem(
        "selectedCombination",
        JSON.stringify({
          id: match.id,
          name: match.name,
          colors: match.colors,
        })
      );

      window.location.href = "result.html";
    });
  }

  function refreshDropdowns() {
    var color1 = document.getElementById("color-1");
    var color2 = document.getElementById("color-2");
    var color3 = document.getElementById("color-3");
    var hintEl = document.getElementById("third-color-hint");
    var wrap3 = document.getElementById("selector-wrap-3");

    var c1 = color1.value;
    var c2 = color2.value;

    var secondOptions = c1 ? getValidSecondColors(combinations, c1) : [];
    var prev2 = c2;
    fillColorSelect(color2, secondOptions);
    if (prev2 && secondOptions.indexOf(prev2) !== -1) {
      color2.value = prev2;
    } else {
      color2.value = "";
    }

    var c2new = color2.value;
    var needsThird = c1 && c2new && pairNeedsThirdColor(combinations, c1, c2new);
    var thirdOptions =
      c1 && c2new ? getValidThirdColors(combinations, c1, c2new) : [];

    if (needsThird) {
      fillColorSelect(color3, thirdOptions);
      color3.removeAttribute("disabled");
      if (wrap3) wrap3.classList.add("selector-wrap--required");
      if (hintEl) {
        hintEl.textContent = "обязательно";
        hintEl.hidden = false;
      }
    } else {
      var optionalThird = c1 && c2new ? thirdOptions : [];
      fillColorSelect(color3, optionalThird);
      color3.removeAttribute("disabled");
      if (wrap3) wrap3.classList.remove("selector-wrap--required");
      if (hintEl) {
        hintEl.textContent = "не обязательно";
        hintEl.hidden = false;
      }
      if (!c1 || !c2new) {
        fillColorSelect(color3, []);
        if (hintEl) hintEl.hidden = true;
      }
    }

    var prev3 = color3.value;
    if (prev3 && thirdOptions.indexOf(prev3) === -1) {
      color3.value = "";
    } else if (prev3) {
      color3.value = prev3;
    }

    applySelectColorStyle(color1);
    applySelectColorStyle(color2);
    applySelectColorStyle(color3);
    updateSubmitState();
  }

  function updateSubmitState() {
    var color1 = document.getElementById("color-1");
    var color2 = document.getElementById("color-2");
    var color3 = document.getElementById("color-3");
    var submitBtn = document.getElementById("btn-show-combo");
    if (!submitBtn || !color1 || !color2) return;

    var c1 = color1.value;
    var c2 = color2.value;
    var c3 = color3.value;

    if (!c1 || !c2) {
      submitBtn.disabled = true;
      return;
    }

    var needsThird = pairNeedsThirdColor(combinations, c1, c2);
    var valid = false;

    if (needsThird) {
      valid = Boolean(c3) && hasExactCombination(combinations, [c1, c2, c3]);
    } else if (c3) {
      valid = hasExactCombination(combinations, [c1, c2, c3]);
    } else {
      valid = hasExactCombination(combinations, [c1, c2]);
    }

    submitBtn.disabled = !valid;
  }

  document.addEventListener("DOMContentLoaded", initCustomPage);
})();
