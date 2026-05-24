(function () {
  var INTERVAL_MS = 20000;

  function initImportantBlock() {
    var textEl = document.querySelector(".important-text");
    if (!textEl) return;

    Promise.all([
      DataLoader.loadDescriptions(),
      DescriptionsLoader.loadImportantTips(),
    ])
      .then(function (results) {
        var data = results[0];
        var fromFile = results[1];
        var tips = fromFile && fromFile.length ? fromFile : data.importantTips || [];

        if (!tips.length) {
          textEl.textContent = "";
          return;
        }

        var index = 0;
        textEl.textContent = tips[0];

        setInterval(function () {
          textEl.classList.add("is-fading");
          setTimeout(function () {
            index = (index + 1) % tips.length;
            textEl.textContent = tips[index];
            textEl.classList.remove("is-fading");
          }, 500);
        }, INTERVAL_MS);
      })
      .catch(function () {
        textEl.textContent =
          "Откройте сайт через локальный сервер (Live Server).";
      });
  }

  document.addEventListener("DOMContentLoaded", initImportantBlock);
})();
