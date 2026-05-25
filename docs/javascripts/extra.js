// Per-diagram "Open full-screen" button driven from the Mermaid source
// text, rather than the rendered SVG. Material for MkDocs renders
// Mermaid into a closed shadow root, so post-processing the inner SVG
// from page JS is not reliable.
//
// MkDocs Material renders Mermaid client-side; SVG appears
// asynchronously after the page DOM is ready. Material's instant
// navigation rebuilds the DOM in-place. A MutationObserver on
// document.body catches every insertion without timing assumptions.

(function () {
  var FULLSCREEN_THEME_CSS =
    ".nodeLabel p,.nodeLabel span,.nodeLabel b,.nodeLabel i{color:#f8fafc !important;}" +
    ".edgeLabel,.edgeLabel p,.edgeLabel span,.edgeLabel foreignObject div{color:#0f172a !important;}" +
    ".edgeLabel foreignObject div{background:#ffffff !important;border-radius:2px;padding:1px 3px;}" +
    ".labelBkg{fill:#ffffff !important;}";

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function ensureDiagramFrame(node) {
    var frame = node.closest(".diagram-frame");
    if (frame) return frame;

    var parent = node.parentElement;
    if (!parent) return null;

    frame = document.createElement("div");
    frame.className = "diagram-frame diagram-frame--auto";
    parent.insertBefore(frame, node);
    frame.appendChild(node);
    return frame;
  }

  function diagramFrameFor(node) {
    return node.closest(".diagram-frame") || node.parentElement;
  }

  function captureSources() {
    document.querySelectorAll("pre.mermaid").forEach(function (pre) {
      var frame = ensureDiagramFrame(pre);
      if (!frame || frame.dataset.mermaidSource) return;

      var code = pre.querySelector("code");
      var source = code ? code.textContent : pre.textContent;
      if (!source) return;

      frame.dataset.mermaidSource = source.trim();
    });
  }

  function addFullscreenButton(mermaidContainer) {
    var frame = ensureDiagramFrame(mermaidContainer);
    if (!frame || !frame.dataset.mermaidSource) return;
    if (frame.querySelector(".mermaid-fullscreen-btn")) return;

    var btn = document.createElement("button");
    btn.className = "mermaid-fullscreen-btn";
    btn.type = "button";
    btn.textContent = "\u26F6 Full-screen";
    btn.title = "Open this diagram in a new tab (full-screen)";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      openInNewTab(frame.dataset.mermaidSource);
    });
    frame.appendChild(btn);
  }

  function addDiagramClickTarget(mermaidContainer) {
    var frame = ensureDiagramFrame(mermaidContainer);
    if (!frame || !frame.dataset.mermaidSource) return;
    if (mermaidContainer.dataset.fullscreenBound) return;

    function openDiagram(e) {
      if (
        e.target &&
        (e.target.closest(".mermaid-fullscreen-btn") ||
          e.target.closest("a") ||
          e.target.closest("button"))
      ) {
        return;
      }

      e.preventDefault();
      openInNewTab(frame.dataset.mermaidSource);
    }

    mermaidContainer.classList.add("is-fullscreenable");
    mermaidContainer.title = "Click to open this diagram in a new tab";
    mermaidContainer.tabIndex = 0;
    mermaidContainer.addEventListener("click", openDiagram);
    mermaidContainer.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInNewTab(frame.dataset.mermaidSource);
      }
    });
    mermaidContainer.dataset.fullscreenBound = "true";
  }

  function openInNewTab(source) {
    var escapedSource = escapeHtml(source);

    var html =
      "<!doctype html>" +
      "<html><head>" +
      "<meta charset='utf-8'>" +
      "<title>Project H diagram</title>" +
      "<style>" +
      "  html, body { margin: 0; padding: 0; height: 100%; background: #fff; overflow: auto; }" +
      "  body { font-family: -apple-system, system-ui, sans-serif; }" +
      "  #diagram { min-width: max-content; min-height: 100vh; padding: 24px; box-sizing: border-box; }" +
      "  #diagram svg { display: block; }" +
      "  .hint { position: fixed; top: 8px; right: 12px;" +
      "          font: 12px/1 -apple-system, system-ui, sans-serif;" +
      "          color: #666; background: rgba(255,255,255,0.85);" +
      "          padding: 4px 8px; border-radius: 3px; pointer-events: none; }" +
      "</style>" +
      "</head><body>" +
      "<div class='hint'>Ctrl + wheel = zoom · scroll = pan · Ctrl+0 = reset</div>" +
      "<div id='diagram'></div>" +
      "<pre id='source' hidden>" +
      escapedSource +
      "</pre>" +
      "<script type='module'>" +
      "  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';" +
      "  const source = document.getElementById('source').textContent;" +
      "  mermaid.initialize({" +
      "    startOnLoad: false," +
      "    securityLevel: 'loose'," +
      "    flowchart: { useMaxWidth: false }," +
      "    themeCSS: " +
      JSON.stringify(FULLSCREEN_THEME_CSS) +
      "  });" +
      "  const { svg } = await mermaid.render('fullscreen-diagram', source);" +
      "  document.getElementById('diagram').innerHTML = svg;" +
      "<\/script>" +
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
    captureSources();

    // Material replaces <pre class="mermaid"> with <div class="mermaid">.
    // The rendered SVG lives in a closed shadow root, so we attach the
    // button to the outer host once it appears.
    var containers = document.querySelectorAll("div.mermaid");
    containers.forEach(function (c) {
      addFullscreenButton(c);
      addDiagramClickTarget(c);
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
})();
