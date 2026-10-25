(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const routeItems = document.querySelectorAll(".route-list li");
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    routeItems.forEach((el, i) => {
      el.style.transitionDelay = `${i * 45}ms`;
      io.observe(el);
    });
  } else {
    routeItems.forEach((el) => el.classList.add("in"));
  }

  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  const tabs = document.querySelectorAll(".area-map-picker button");
  const panels = document.querySelectorAll(".area-panel");

  function showArea(area) {
    tabs.forEach((tab) => {
      tab.setAttribute("aria-selected", tab.dataset.area === area ? "true" : "false");
    });

    panels.forEach((panel) => {
      const match = panel.dataset.area === area;
      panel.hidden = !match;
      panel.classList.toggle("is-active", match);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showArea(tab.dataset.area));
  });

  const hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("map-")) {
    const area = hash.slice(4);
    if (document.querySelector(`.area-panel[data-area="${area}"]`)) {
      showArea(area);
    }
  }
})();
