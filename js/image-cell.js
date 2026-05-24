/** Вставляет img с перебором путей, если файл не открывается */
function mountImage(container, imagePaths, alt) {
  var paths = (imagePaths || []).filter(Boolean);
  container.innerHTML = "";
  if (!paths.length) {
    container.classList.add("grid-cell--empty");
    return;
  }

  var index = 0;
  var img = document.createElement("img");
  img.alt = alt || "";
  img.loading = "lazy";
  img.decoding = "async";

  function tryNext() {
    if (index >= paths.length) {
      img.remove();
      container.classList.add("grid-cell--empty");
      return;
    }
    img.src = imageUrl(paths[index]);
    index += 1;
  }

  img.addEventListener("error", tryNext);
  img.addEventListener("load", function () {
    container.classList.remove("grid-cell--empty");
  });

  container.classList.remove("grid-cell--empty");
  container.appendChild(img);
  tryNext();
}

function mountImageHtml(imagePaths, alt) {
  var id = "imgc-" + Math.random().toString(36).slice(2);
  return (
    '<div class="grid-cell" id="' +
    id +
    '" data-images="' +
    escapeAttr(JSON.stringify(imagePaths || [])) +
    '" data-alt="' +
    escapeAttr(alt || "") +
    '"></div>'
  );
}

function hydrateImageCells(root) {
  var scope = root || document;
  scope.querySelectorAll("[data-images]").forEach(function (el) {
    var paths;
    try {
      paths = JSON.parse(el.getAttribute("data-images"));
    } catch (e) {
      paths = [];
    }
    mountImage(el, paths, el.getAttribute("data-alt") || "");
    el.removeAttribute("data-images");
  });
}
