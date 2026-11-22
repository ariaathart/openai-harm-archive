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

  // Old homepage links to a single testimony (index.html#testimony-NN) now point to the archive page.
  var hashMatch = /^#testimony-\d+$/.exec(location.hash);
  if (hashMatch && document.querySelector(".testimony-entry") && !document.getElementById(location.hash.slice(1))) {
    location.replace("testimonies/" + location.hash);
    return;
  }

  // Lightbox for links marked [data-lightbox]. Without JS (or <dialog> support)
  // the link simply opens the full image.
  // Links inside a [data-lightbox-group] element (one testimony = one post) open as a set:
  // Previous/Next buttons and the arrow keys move through that group's screenshots, in order, and only those.
  var box = document.getElementById("lightbox");
  if (box && typeof box.showModal === "function") {
    var boxImg = box.querySelector(".lightbox-img");
    var boxCap = box.querySelector(".lightbox-caption");
    var boxNav = box.querySelector(".lightbox-nav");
    if (!boxNav) {
      boxNav = document.createElement("div");
      boxNav.className = "lightbox-nav";
      boxNav.hidden = true;
      boxNav.innerHTML = '<button class="lightbox-prev" type="button" aria-label="Previous screenshot">← Previous</button>' +
        '<span class="lightbox-count" aria-live="polite"></span>' +
        '<button class="lightbox-next" type="button" aria-label="Next screenshot">Next →</button>';
      box.insertBefore(boxNav, boxCap);
    }
    var prevBtn = boxNav.querySelector(".lightbox-prev");
    var nextBtn = boxNav.querySelector(".lightbox-next");
    var boxCount = boxNav.querySelector(".lightbox-count");
    var group = [];
    var groupIndex = 0;
    var lastTrigger = null;

    var showShot = function (i) {
      var link = group[i];
      groupIndex = i;
      var img = link.querySelector("img");
      var fig = link.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      boxImg.src = link.getAttribute("href");
      boxImg.alt = img ? img.alt : "";
      boxCap.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
      // Tall screenshots: show at readable width and let the dialog scroll.
      box.classList.toggle("lightbox--scroll", link.hasAttribute("data-lightbox-scroll"));
      box.scrollTop = 0;
      var multi = group.length > 1;
      boxNav.hidden = !multi;
      if (multi) {
        boxCount.textContent = "Screenshot " + (i + 1) + " of " + group.length;
        prevBtn.disabled = i === 0;
        nextBtn.disabled = i === group.length - 1;
      }
    };
    var openShot = function (link, trigger) {
      var g = link.closest("[data-lightbox-group]");
      group = g ? Array.prototype.slice.call(g.querySelectorAll("a[data-lightbox]")) : [link];
      lastTrigger = trigger || link;
      showShot(Math.max(0, group.indexOf(link)));
      if (!box.open) box.showModal();
    };

    document.querySelectorAll("a[data-lightbox]").forEach(function (link) {
      link.addEventListener("click", function (ev) {
        ev.preventDefault();
        openShot(link);
      });
    });
    prevBtn.addEventListener("click", function () { if (groupIndex > 0) showShot(groupIndex - 1); });
    nextBtn.addEventListener("click", function () { if (groupIndex < group.length - 1) showShot(groupIndex + 1); });
    box.addEventListener("keydown", function (ev) {
      if (group.length < 2) return;
      if (ev.key === "ArrowLeft" && groupIndex > 0) { ev.preventDefault(); showShot(groupIndex - 1); }
      if (ev.key === "ArrowRight" && groupIndex < group.length - 1) { ev.preventDefault(); showShot(groupIndex + 1); }
    });
    box.querySelector(".lightbox-close").addEventListener("click", function () { box.close(); });
    // Click on the backdrop closes it
    box.addEventListener("click", function (ev) { if (ev.target === box) box.close(); });
    box.addEventListener("close", function () {
      boxImg.src = "";
      group = [];
      if (lastTrigger) lastTrigger.focus();
    });

    // Testimony archive: each testimony becomes a compact card (first screenshot as preview)
    // with one button that opens the whole post in the viewer.
    var archive = document.querySelector(".testimony-archive");
    if (archive) {
      archive.classList.add("testimony-archive--cards");
      archive.querySelectorAll(".testimony[data-lightbox-group]").forEach(function (t) {
        var links = t.querySelectorAll("a[data-lightbox]");
        if (!links.length) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn testimony-view";
        btn.textContent = links.length > 1 ? "View post · " + links.length + " screenshots" : "View post · 1 screenshot";
        btn.addEventListener("click", function () { openShot(links[0], btn); });
        t.appendChild(btn);
      });
    }
  }

  // Footer year
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
