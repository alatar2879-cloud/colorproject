var DescriptionsLoader = (function () {
  function parseDescriptionsText(text) {
    var map = {};
    if (!text || !text.trim()) return map;

    var blocks = text.split(/\r?\n\s*\r?\n/);
    blocks.forEach(function (block) {
      block = block.trim();
      if (!block) return;

      var bracket = block.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
      if (bracket) {
        map[bracket[1].trim()] = bracket[2].trim();
        return;
      }

      var colon = block.match(/^([^:\n]+):\s*([\s\S]*)$/);
      if (colon) {
        map[colon[1].trim()] = colon[2].trim();
      }
    });

    return map;
  }

  function loadTextDescriptions() {
    var path = new URL("../texts/descriptions.txt", window.location.href).href;
    return fetch(path)
      .then(function (r) {
        if (!r.ok) return {};
        return r.text();
      })
      .then(parseDescriptionsText)
      .catch(function () {
        return {};
      });
  }

  function loadImportantTips() {
    var path = new URL("../texts/important.txt", window.location.href).href;
    return fetch(path)
      .then(function (r) {
        if (!r.ok) return null;
        return r.text();
      })
      .then(function (text) {
        if (!text || !text.trim()) return null;
        return text
          .split(/\r?\n/)
          .map(function (line) {
            return line.trim();
          })
          .filter(Boolean);
      })
      .catch(function () {
        return null;
      });
  }

  return {
    loadTextDescriptions: loadTextDescriptions,
    loadImportantTips: loadImportantTips,
  };
})();
