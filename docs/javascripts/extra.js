// Per-diagram "Open full-screen" button + remove Mermaid's inline
// max-width / max-height so the SVG renders at natural size and the
// .mermaid container can scroll.
//
// MkDocs Material renders Mermaid client-side; SVG appears
// asynchronously after the page DOM is ready. Material's instant
// navigation rebuilds the DOM in-place. A MutationObserver on
// document.body catches every insertion without timing assumptions.

(function () {
  console.log("[project-h-docs] extra.js loaded");

  function unconstrainSvg(svg) {
    // Mermaid sets style="max-width: NNNpx; max-height: NNNpx;" on the
    // root SVG when useMaxWidth: true (default). Strip those so the
    // SVG renders at its natural pixel size and the parent container
    // scrolls instead of squeezing the diagram. CSS rules with
    // !important don't always beat inline styles on every renderer,
    // so we clear them directly.
    if (svg.dataset.unconstrained === "true") return;
    svg.style.maxWidth = "none";
    svg.style.maxHeight = "none";
    svg.style.width = "auto";
    svg.style.height = "auto";
    svg.dataset.unconstrained = "true";
  }

  function addFullscreenButton(mermaidContainer) {
    if (mermaidContainer.querySelector(".mermaid-fullscreen-btn")) return;
    var svg = mermaidContainer.querySelector("svg");
    if (!svg) return;

    unconstrainSvg(svg);

    var btn = document.createElement("button");
    btn.className = "mermaid-fullscreen-btn";
    btn.type = "button";
    btn.textContent = "\u26F6 Full-screen";
    btn.title = "Open this diagram in a new tab (full-screen)";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab(svg);
    });
    mermaidContainer.appendChild(btn);
  }

  function openInNewTab(svg) {
    var clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.style.maxWidth = "none";
    clone.style.maxHeight = "none";
    clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clone.style.width = "100vw";
    clone.style.height = "100vh";

    var svgXml = new XMLSerializer().serializeToString(clone);

    var html =
      "<!doctype html>" +
      "<html><head>" +
      "<meta charset='utf-8'>" +
      "<title>Project H diagram</title>" +
      "<style>" +
      "  html, body { margin: 0; padding: 0; height: 100%; background: #fff; }" +
      "  svg { display: block; width: 100vw; height: 100vh; }" +
      "  .hint { position: fixed; top: 8px; right: 12px;" +
      "          font: 12px/1 -apple-system, system-ui, sans-serif;" +
      "          color: #666; background: rgba(255,255,255,0.85);" +
      "          padding: 4px 8px; border-radius: 3px; pointer-events: none; }" +
      "</style>" +
      "</head><body>" +
      "<div class='hint'>Ctrl + wheel = zoom · scroll = pan · Ctrl+0 = reset</div>" +
      svgXml +
      "</body></html>";

    var win = window.open("", "_blank");
    if (!win) {
      window.location.href =
        "data:text/html;charset=utf-8," + encodeURIComponent(html);
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function scanAndAttach() {
    // Cover both shapes pymdownx + Mermaid can produce: <pre class="mermaid">
    // and <div class="mermaid">. Some Mermaid versions wrap the SVG in
    // <pre>, some in <div>.
    var containers = document.querySelectorAll(".mermaid, pre.mermaid, div.mermaid");
    if (containers.length) {
      console.log("[project-h-docs] scan: " + containers.length + " .mermaid containers");
    }
    containers.forEach(function (c) {
      var svg = c.querySelector("svg");
      if (!svg) return;
      addFullscreenButton(c);
    });
  }

  // Run once now in case Mermaid is already rendered
  scanAndAttach();

  // Watch for late SVG insertion
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "childList" && m.addedNodes.length) {
        scanAndAttach();
        return;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // MkDocs Material instant navigation
  if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
    document$.subscribe(scanAndAttach);
  }

  // Belt-and-suspenders poll for 5 s in case the observer is late
  var pollCount = 0;
  var pollInterval = setInterval(function () {
    pollCount++;
    scanAndAttach();
    if (pollCount > 20) clearInterval(pollInterval);
  }, 250);
})();
