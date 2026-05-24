function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Кодировка пути (# в имени файла ломает new URL без encode) */
function imageUrl(relativePath) {
  if (!relativePath) return "";

  var encoded = String(relativePath)
    .split("/")
    .map(function (part) {
      if (!part || part === "." || part === "..") return part;
      try {
        return encodeURIComponent(decodeURIComponent(part));
      } catch (e) {
        return encodeURIComponent(part);
      }
    })
    .join("/");

  try {
    return new URL(encoded, window.location.href).href;
  } catch (e) {
    return encoded;
  }
}

var CANONICAL_COLORS = [
  "Красный",
  "Оранжевый",
  "Жёлтый",
  "Зелёный",
  "Голубой",
  "Синий",
  "Фиолетовый",
  "Белый",
  "Чёрный",
  "Бежевый",
  "Розовый",
  "Серый",
  "Коричневый",
];

var COLOR_CSS = {
  Красный: "#e63946",
  Оранжевый: "#f77f00",
  Жёлтый: "#ffbe0b",
  Зелёный: "#2a9d8f",
  Голубой: "#48cae4",
  Синий: "#457b9d",
  Фиолетовый: "#7b2cbf",
  Белый: "#999999",
  Чёрный: "#1a1a2e",
  Бежевый: "#c4a77d",
  Розовый: "#ff85a1",
  Серый: "#6c757d",
  Коричневый: "#6f4e37",
};

function combinationHasColor(combo, colorName) {
  if (!combo || !colorName) return false;
  var sel = normalizeColorName(colorName);
  var nameNorm = normalizeColorName(combo.name);
  var comboColors = (combo.colors || []).map(normalizeColorName);

  if (comboColors.some(function (c) {
    return colorsMatch(c, sel);
  })) {
    return true;
  }
  return colorsMatch(nameNorm, sel);
}

function getColorsWithCombinations(combinations) {
  return CANONICAL_COLORS.filter(function (color) {
    return combinations.some(function (combo) {
      return combinationHasColor(combo, color);
    });
  });
}

function getValidSecondColors(combinations, firstColor) {
  if (!firstColor) return [];
  return getColorsWithCombinations(combinations).filter(function (color) {
    if (normalizeColorName(color) === normalizeColorName(firstColor)) return false;
    return (
      hasExactCombination(combinations, [firstColor, color]) ||
      getValidThirdColors(combinations, firstColor, color).length > 0
    );
  });
}

function getValidThirdColors(combinations, firstColor, secondColor) {
  if (!firstColor || !secondColor) return [];
  return getColorsWithCombinations(combinations).filter(function (color) {
    var n = normalizeColorName(color);
    if (n === normalizeColorName(firstColor) || n === normalizeColorName(secondColor)) {
      return false;
    }
    return combinations.some(function (combo) {
      return (
        combinationHasColor(combo, firstColor) &&
        combinationHasColor(combo, secondColor) &&
        combinationHasColor(combo, color)
      );
    });
  });
}

function normalizeColorName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .trim();
}

var COLOR_ALIASES = {
  красный: ["красн", "red"],
  оранжевый: ["оранж", "orange"],
  желтый: ["желт", "yellow"],
  зеленый: ["зелен", "green"],
  голубой: ["голуб", "light blue"],
  синий: ["син", "blue"],
  фиолетовый: ["фиолет", "violet", "purple"],
  белый: ["бел", "white"],
  черный: ["черн", "black"],
  бежевый: ["беж", "beige"],
  розовый: ["розов", "pink"],
  серый: ["сер", "grey", "gray"],
  коричневый: ["корич", "коричн", "brown"],
};

function colorTokens(name) {
  var norm = normalizeColorName(name);
  var tokens = [norm];
  Object.keys(COLOR_ALIASES).forEach(function (key) {
    if (norm.indexOf(key) !== -1 || key.indexOf(norm) !== -1) {
      tokens = tokens.concat(COLOR_ALIASES[key]);
      tokens.push(key);
    }
  });
  return tokens;
}

function colorsMatch(comboText, selected) {
  var tokens = colorTokens(selected);
  return tokens.some(function (t) {
    return t.length > 2 && comboText.indexOf(t) !== -1;
  });
}

function shuffleArray(arr) {
  var copy = arr.slice();
  for (var i = copy.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = copy[i];
    copy[i] = copy[j];
    copy[j] = t;
  }
  return copy;
}

function pickRandom(arr, count) {
  return shuffleArray(arr).slice(0, count);
}

function formatComboLabel(colors) {
  if (!colors || !colors.length) return "Цвет";
  return colors.map(function (c) {
    return c.charAt(0).toUpperCase() + c.slice(1);
  }).join("-");
}

function getComboColorCount(combo) {
  var parts = combo.colors || [];
  if (parts.length) return parts.length;
  var name = normalizeColorName(combo.name);
  if (name.indexOf(",") !== -1) {
    return name.split(",").length;
  }
  if (name.indexOf(" и ") !== -1) {
    return name.split(" и ").length;
  }
  return parts.length || 2;
}

function hasExactCombination(combinations, selectedColors) {
  var selected = selectedColors.filter(function (c) {
    return c && c !== "";
  });

  if (selected.length < 2) return false;

  return combinations.some(function (combo) {
    if (getComboColorCount(combo) !== selected.length) return false;
    return selected.every(function (sel) {
      return combinationHasColor(combo, sel);
    });
  });
}

function findCombination(combinations, selectedColors) {
  var selected = selectedColors.filter(function (c) {
    return c && c !== "";
  });

  if (selected.length < 2) return null;

  return (
    combinations.find(function (combo) {
      if (getComboColorCount(combo) !== selected.length) return false;
      return selected.every(function (sel) {
        return combinationHasColor(combo, sel);
      });
    }) || null
  );
}

function pairNeedsThirdColor(combinations, firstColor, secondColor) {
  if (!firstColor || !secondColor) return false;
  return !hasExactCombination(combinations, [firstColor, secondColor]);
}

function getColorDescription(colorInfo, textDescriptions) {
  var name = colorInfo.name;
  if (textDescriptions && textDescriptions[name]) {
    return textDescriptions[name];
  }
  if (colorInfo.description) return colorInfo.description;
  var parts = [];
  if (colorInfo.meaning) parts.push(colorInfo.meaning);
  if (colorInfo.usage) parts.push(colorInfo.usage);
  return parts.join(" ");
}

function createColorOption(name) {
  var opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  if (COLOR_CSS[name]) {
    opt.style.color = COLOR_CSS[name];
  }
  return opt;
}

function fillColorSelect(selectEl, colors, placeholder) {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  var empty = document.createElement("option");
  empty.value = "";
  empty.textContent = placeholder || "Цвет";
  selectEl.appendChild(empty);
  colors.forEach(function (name) {
    selectEl.appendChild(createColorOption(name));
  });
  applySelectColorStyle(selectEl);
}

function applySelectColorStyle(selectEl) {
  if (!selectEl) return;
  var name = selectEl.value;
  selectEl.style.color = name && COLOR_CSS[name] ? COLOR_CSS[name] : "#000";
  selectEl.classList.toggle("select-pill--has-color", Boolean(name));
}
