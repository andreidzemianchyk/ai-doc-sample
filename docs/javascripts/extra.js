// Per-diagram "Open full-screen" button.
//
// Approach (replaces the previous svg-pan-zoom integration):
//   - The .mermaid container is scrollable (CSS extra.css overflow:auto +
//     max-height); browser-native Ctrl+wheel zoom works inside it.
//   - This script injects a single button below each rendered Mermaid SVG
//     that opens the SVG in a new browser tab when clicked. The new tab
//     fills the viewport with the SVG, giving the user browser-native
//     zoom (Ctrl+wheel), pan (scrollbars), and "Save image as" / "Open
//     image in new tab" affordances.
//
// Mermaid renders asynchronously after the page loads, and MkDocs
// Material rebuilds the DOM during instant navigation, so we poll for
// new diagrams briefly and re-attach on document$ events.

(function () {
  var BTN_LABEL = "⛶ Open full-screen";

  function addFullscreenButton(svg) {
    if (svg.dataset.fullscreenBtn === "true") return;
    var container = svg.parentElement;
    if (!container || !container.classList.contains("mermaid")) return;
    svg.dataset.fullscreenBtn = "true";

    var btn = document.createElement("button");
    btn.className = "mermaid-fullscreen-btn";
    btn.type = "button";
    btn.textContent = BTN_LABEL;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab(svg);
    });

    container.appendChild(btn);
  }

  function openInNewTab(svg) {
    // Serialize a clean copy of the SVG (no inline event handlers, no
    // svg-pan-zoom artefacts).
    var clone = svg.cloneNode(true);
    // Make the clone fill the viewport when opened standalone.
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
    clone.style.width = "100vw";
    clone.style.height = "100vh";

    var serializer = new XMLSerializer();
    var svgXml = serializer.serializeToString(clone);

    var html =
      "<!doctype html>" +
      "<html><head>" +
      "<meta charset='utf-8'>" +
      "<title>Project H diagram — full-screen</title>" +
      "<style>" +
      "  html, body { margin: 0; padding: 0; height: 100%; background: #fff; }" +
      "  svg { display: block; width: 100vw; height: 100vh; }" +
      "  .hint { position: fixed; top: 8px; right: 12px;" +
      "          font-family: -apple-system, system-ui, sans-serif;" +
      "          font-size: 12px; color: #666; background: rgba(255,255,255,0.85);" +
      "          padding: 4px 8px; border-radius: 3px; pointer-events: none; }" +
      "</style>" +
      "</head><body>" +
      "<div class='hint'>Ctrl + wheel = zoom · scroll = pan · Ctrl+0 = reset</div>" +
      svgXml +
      "</body></html>";

    var win = window.open("", "_blank");
    if (!win) {
      // Popup blocked — fall back to data URI in the same tab.
      var dataUri =
        "data:text/html;charset=utf-8," + encodeURIComponent(html);
      window.location.href = dataUri;
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function attachAll() {
    document.querySelectorAll(".mermaid svg").forEach(addFullscreenButton);
  }

  function pollAndAttach() {
    var attempts = 0;
    var maxAttempts = 40; // ~10 s of polling at 250 ms
    var interval = setInterval(function () {
      attempts++;
      attachAll();
      var pending = document.querySelectorAll(
        ".mermaid svg:not([data-fullscreen-btn])"
      ).length;
      if (attempts >= maxAttempts || pending === 0) {
        clearInterval(interval);
      }
    }, 250);
  }

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
