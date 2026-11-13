(function () {
  "use strict";

  // Enable JS-dependent classes
  document.documentElement.classList.add("js");

  // ---- Header scrolled state (subtle shadow on scroll) ----
  var header = document.querySelector(".header");
  var headerH = 72;

  function onScroll() {
    if (window.scrollY > headerH) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  if (header) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu toggle ----
  var navToggle = document.getElementById("nav-toggle");
  var navList = document.getElementById("nav");
  var navLinks = navList ? navList.querySelectorAll("a") : [];

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      if (navList) {
        navList.classList.toggle("open", !expanded);
      }
      // Close menu on link tap (mobile)
      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          navToggle.setAttribute("aria-expanded", "false");
          if (navList) navList.classList.remove("open");
        });
      });
    });
  }

  // Close mobile menu when a link is tapped (safety net)
  document.querySelectorAll(".nav-list a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navToggle && navList) {
        navToggle.setAttribute("aria-expanded", "false");
        navList.classList.remove("open");
      }
    });
  });

  // ---- Smooth scroll for same-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = anchor.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---- Scroll reveal ----
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: reveal on load when JS isn't supported
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ---- Highlight current nav link on scroll ----
  var sections = [];
  document.querySelectorAll("section[id]").forEach(function (section) {
    sections.push(section);
  });
  var navAnchors = [];
  document.querySelectorAll(".nav-list a").forEach(function (a) {
    navAnchors.push(a);
  });

  function updateActiveLink() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var id = section.getAttribute("id");
      var offset = section.offsetTop;
      if (offset <= scrollPos) {
        navAnchors.forEach(function (a) {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + id
          );
        });
      }
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  }
})();
