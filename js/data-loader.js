var DataLoader = (function () {
  var cache = {};

  function fetchJSON(path) {
    if (cache[path]) {
      return Promise.resolve(cache[path]);
    }

    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error("Не удалось загрузить " + path);
      }
      return response.json();
    }).then(function (data) {
      cache[path] = data;
      return data;
    });
  }

  function combinationsPath() {
    return new URL("../data/combinations.json", window.location.href).href;
  }

  function descriptionsPath() {
    return new URL("../data/descriptions.json", window.location.href).href;
  }

  function loadCombinations() {
    return fetchJSON(combinationsPath());
  }

  function loadDescriptions() {
    return fetchJSON(descriptionsPath());
  }

  return {
    loadCombinations: loadCombinations,
    loadDescriptions: loadDescriptions,
  };
})();
