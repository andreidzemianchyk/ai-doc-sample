// Attach svg-pan-zoom to every Mermaid SVG on the page.
// svg-pan-zoom is loaded via extra_javascript in mkdocs.yml.
//
// Mermaid renders asynchronously after page load, and MkDocs Material's
// "instant" navigation rebuilds the DOM in-place — so we poll for SVGs
// briefly and also subscribe to Material's document$ reactive subject
// if it's available.

(function () {
  function attachPanZoom() {
    if (typeof svgPanZoom !== "function") return false;
    var svgs = document.querySelectorAll(".mermaid svg");
    var attached = false;
    svgs.forEach(function (svg) {
      if (svg.dataset.panZoomAttached === "true") return;
      // Ensure the SVG has a viewBox; svg-pan-zoom needs one.
      if (!svg.getAttribute("viewBox")) {
        var bbox = svg.getBBox && svg.getBBox();
        if (bbox && bbox.width && bbox.height) {
          svg.setAttribute(
            "viewBox",
            bbox.x + " " + bbox.y + " " + bbox.width + " " + bbox.height
          );
        }
      }
      // Set responsive width/height before attaching pan-zoom.
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.maxWidth = "100%";
      try {
        svgPanZoom(svg, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.3,
          maxZoom: 20,
          mouseWheelZoomEnabled: false, // don't hijack page scroll
          dblClickZoomEnabled: true,
          panEnabled: true
        });
        svg.parentElement.dataset.panZoomAttached = "true";
        svg.dataset.panZoomAttached = "true";
        attached = true;
      } catch (e) {
        // svg-pan-zoom occasionally throws on diagrams that aren't laid
        // out yet — retry on the next tick.
        console.warn("svg-pan-zoom not ready yet:", e.message);
      }
    });
    return attached;
  }

  function pollAndAttach() {
    var attempts = 0;
    var maxAttempts = 30;
    var interval = setInterval(function () {
      attempts++;
      attachPanZoom();
      if (
        attempts >= maxAttempts ||
        document.querySelectorAll(".mermaid svg:not([data-pan-zoom-attached])")
          .length === 0
      ) {
        clearInterval(interval);
      }
    }, 250);
  }

  // First page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pollAndAttach);
  } else {
    pollAndAttach();
  }

  // MkDocs Material instant navigation
  if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
    document$.subscribe(function () {
      pollAndAttach();
    });
  }
})();
