import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const EXTRA_THEME_CSS = `
.nodeLabel p,
.nodeLabel span,
.nodeLabel b,
.nodeLabel i {
  color: #f8fafc !important;
}

.cluster .nodeLabel,
.cluster .nodeLabel *,
.cluster-label,
.cluster-label *,
.cluster-label .nodeLabel,
.cluster-label .nodeLabel * {
  color: #0f172a !important;
  fill: #0f172a !important;
  font-weight: 700 !important;
}

.edgeLabel,
.edgeLabel p,
.edgeLabel span,
.edgeLabel foreignObject div {
  color: #0f172a !important;
}

.edgeLabel foreignObject div {
  background: #ffffff !important;
  border-radius: 2px;
  padding: 1px 3px;
}

.labelBkg {
  fill: #ffffff !important;
}
`;

const originalInitialize = mermaid.initialize.bind(mermaid);

mermaid.initialize = function initializeWithProjectDefaults(config = {}) {
  const flowchart = {
    // Fit diagrams to the page container by default. The dedicated
    // full-screen view in extra.js renders from source separately with
    // useMaxWidth disabled, so users still get a natural-size canvas there.
    useMaxWidth: true,
    ...(config.flowchart || {}),
  };

  return originalInitialize({
    ...config,
    securityLevel: "loose",
    flowchart,
    themeCSS: [config.themeCSS, EXTRA_THEME_CSS].filter(Boolean).join("\n"),
  });
};

window.mermaid = mermaid;
