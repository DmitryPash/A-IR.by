let open = document.querySelectorAll(".request-my-items-item");

open.forEach(function (i) {
  i.addEventListener("click", function () {
    i.classList.toggle("backgroundgrey");
  });
});
