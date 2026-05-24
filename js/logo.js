(function () {
  var slot = document.getElementById("logo-slot");
  var img = document.getElementById("site-logo");
  if (!img || !slot) return;

  var files = ["logo.png", "logo.jpg", "logo.jpeg", "logo.svg", "logo.webp"];
  var index = 0;

  function showPlaceholder() {
    img.classList.add("is-hidden");
    slot.classList.add("logo-slot--empty");
  }

  img.addEventListener("error", function () {
    index += 1;
    if (index < files.length) {
      img.src = "../images/logo/" + files[index];
    } else {
      showPlaceholder();
    }
  });

  img.addEventListener("load", function () {
    slot.classList.remove("logo-slot--empty");
    img.classList.remove("is-hidden");
  });
})();
