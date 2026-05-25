import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const EXTRA_THEME_CSS = `
.nodeLabel p,
.nodeLabel span,
.label text,
.cluster-label text,
.stateLabel text {
  color: #f8fafc !important;
  fill: #f8fafc !important;
  font-weight: 700;
  line-height: 1.3;
}
.edgeLabel,
.labelBkg {
  background: #0f172a !important;
  fill: #0f172a !important;
  color: #f8fafc !important;
}
.edgeLabel p {
  color: #f8fafc !important;
}
`;

const EXTRA_THEME_VARIABLES = {
  primaryColor: "#334155",
  primaryTextColor: "#f8fafc",
  primaryBorderColor: "#0f172a",
  lineColor: "#334155",
  secondaryColor: "#1e293b",
  tertiaryColor: "#475569",
  clusterBkg: "#1e293b",
  clusterBorder: "#0f172a",
  mainBkg: "#334155",
  secondBkg: "#1e293b",
  tertiaryBkg: "#475569",
  background: "#f8fafc",
  edgeLabelBackground: "#0f172a",
  actorBkg: "#334155",
  actorBorder: "#0f172a",
  actorTextColor: "#f8fafc",
  labelBoxBkgColor: "#334155",
  labelBoxBorderColor: "#0f172a",
  labelTextColor: "#f8fafc",
  nodeBorder: "#0f172a",
  nodeTextColor: "#f8fafc",
  textColor: "#0f172a",
  cScale0: "#334155",
  cScale1: "#1e293b",
  cScale2: "#475569",
  cScaleLabel0: "#f8fafc",
  cScaleLabel1: "#f8fafc",
  cScaleLabel2: "#f8fafc",
};

const originalInitialize = mermaid.initialize.bind(mermaid);

mermaid.initialize = function initializeWithProjectDefaults(config = {}) {
  const flowchart = {
    // Fit diagrams to the page container by default. The dedicated
    // full-screen view in extra.js renders from source separately with
    // useMaxWidth disabled, so users still get a natural-size canvas there.
    useMaxWidth: true,
    ...(config.flowchart || {}),
  };

  const themeCSS = [config.themeCSS, EXTRA_THEME_CSS]
    .filter(Boolean)
    .join("\n");

  return originalInitialize({
    ...config,
    theme: config.theme || "base",
    securityLevel: "loose",
    flowchart,
    themeVariables: {
      ...EXTRA_THEME_VARIABLES,
      ...(config.themeVariables || {}),
    },
    themeCSS,
  });
};

window.mermaid = mermaid;
