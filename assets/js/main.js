/* Minimal progressive enhancement. The site works fully without JS. */
(function () {
  "use strict";

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Light/dark theme toggle (remembered per browser; falls back to system setting)
  var root = document.documentElement;
  var themeBtn = document.querySelector(".theme-toggle");
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {}
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function label() {
    if (themeBtn) themeBtn.textContent = currentTheme() === "dark" ? "Light mode" : "Dark mode";
  }
  if (themeBtn) {
    label();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
  }

  // Simple client-side filter for any list marked [data-filter-list]
  // Items need data-search (text) and optionally data-category.
  var search = document.querySelector("[data-filter-search]");
  var category = document.querySelector("[data-filter-category]");
  var items = document.querySelectorAll("[data-filter-list] [data-search]");
  function applyFilter() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var c = category ? category.value : "";
    items.forEach(function (el) {
      var matchQ = !q || el.getAttribute("data-search").toLowerCase().indexOf(q) !== -1;
      var matchC = !c || el.getAttribute("data-category") === c;
      el.hidden = !(matchQ && matchC);
    });
  }
  if (search) search.addEventListener("input", applyFilter);
  if (category) category.addEventListener("change", applyFilter);

  // Lightbox for links marked [data-lightbox]. Without JS (or <dialog> support)
  // the link simply opens the full image.
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector(".lightbox-img");
    var boxCap = box.querySelector(".lightbox-caption");
    var lastTrigger = null;
    document.querySelectorAll("a[data-lightbox]").forEach(function (link) {
      link.addEventListener("click", function (ev) {
        ev.preventDefault();
        var img = link.querySelector("img");
        var fig = link.closest("figure");
        var cap = fig ? fig.querySelector("figcaption") : null;
        boxImg.src = link.getAttribute("href");
        boxImg.alt = img ? img.alt : "";
        boxCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
        lastTrigger = link;
        box.showModal();
      });
    });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    // Click on the backdrop closes it
    box.addEventListener("click", function (ev) { if (ev.target === box) box.close(); });
    box.addEventListener("close", function () {
      boxImg.src = "";
      if (lastTrigger) lastTrigger.focus();
    });
  }

  // Footer year
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
