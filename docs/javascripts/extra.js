// Per-diagram "Open full-screen" button.
//
// Mermaid renders client-side, asynchronously, after the page DOM is
// ready. MkDocs Material also uses instant navigation, which rebuilds
// the page DOM without a full reload. Both make timing-based hooks
// (DOMContentLoaded + setTimeout) fragile.
//
// This script uses a MutationObserver on document.body so it picks up
// rendered Mermaid SVGs whenever they appear — first load, instant
// nav, late re-renders. Idempotent: each .mermaid container gets at
// most one button.

(function () {
  console.log("[project-h-docs] extra.js loaded");

  function addFullscreenButton(mermaidContainer) {
    if (mermaidContainer.querySelector(".mermaid-fullscreen-btn")) return;
    var svg = mermaidContainer.querySelector("svg");
    if (!svg) return;

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
    document.querySelectorAll(".mermaid").forEach(addFullscreenButton);
  }

  // Initial scan in case Mermaid is already rendered
  scanAndAttach();

  // Watch for Mermaid SVGs being inserted asynchronously
  var observer = new MutationObserver(function (mutations) {
    var shouldScan = false;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === "childList" && m.addedNodes.length) {
        shouldScan = true;
        break;
      }
    }
    if (shouldScan) scanAndAttach();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // MkDocs Material instant navigation
  if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
    document$.subscribe(scanAndAttach);
  }

  // Belt-and-suspenders fallback: poll for the first few seconds
  var pollCount = 0;
  var pollInterval = setInterval(function () {
    pollCount++;
    scanAndAttach();
    if (pollCount > 20) clearInterval(pollInterval); // 5 s
  }, 250);
})();
