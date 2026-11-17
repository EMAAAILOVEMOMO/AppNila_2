(function () {
  "use strict";

  /* ---- barra de progreso de scroll ---- */
  var bar = document.getElementById("scrollBar");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- menú móvil ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- aparición al hacer scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("show");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("show"); });
  }

  /* ---- sección activa en el menú y número resaltado ---- */
  var topics = document.querySelectorAll(".topic");
  var navAnchors = {};
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    navAnchors[a.getAttribute("href").slice(1)] = a;
  });
  function setActive(id) {
    Object.keys(navAnchors).forEach(function (k) {
      navAnchors[k].classList.toggle("active", k === id);
    });
  }
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle("in-view", en.isIntersecting);
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    topics.forEach(function (t) { so.observe(t); });

    var vid = document.getElementById("video");
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) setActive("video");
    }, { rootMargin: "-35% 0px -55% 0px" }).observe(vid);
  }

  /* ---- temario marcable con progreso (se guarda en el navegador) ---- */
  var KEY = "movil-temario-v1";
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { saved = {}; }

  var boxes = Array.prototype.slice.call(document.querySelectorAll(".checks input"));
  var groups = document.querySelectorAll(".syllabus");

  function idFor(input) {
    var g = input.closest(".syllabus").getAttribute("data-group");
    var i = Array.prototype.indexOf.call(
      input.closest(".checks").querySelectorAll("input"), input);
    return g + ":" + i;
  }

  function refresh() {
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
    document.getElementById("doneCount").textContent = pct + "%";

    groups.forEach(function (g) {
      var all = g.querySelectorAll("input");
      var ok = g.querySelectorAll("input:checked").length;
      g.querySelector(".count").textContent = "· " + ok + "/" + all.length;
    });
  }

  boxes.forEach(function (b) {
    var id = idFor(b);
    b.checked = !!saved[id];
    b.addEventListener("change", function () {
      saved[id] = b.checked;
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* sin almacenamiento */ }
      refresh();
    });
  });
  refresh();
})();
