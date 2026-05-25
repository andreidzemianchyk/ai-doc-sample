import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const EXTRA_THEME_CSS = `
.nodeLabel p,
.nodeLabel span {
  color: #fff !important;
  font-weight: 700;
  line-height: 1.3;
}
`;

const originalInitialize = mermaid.initialize.bind(mermaid);

mermaid.initialize = function initializeWithProjectDefaults(config = {}) {
  const flowchart = {
    useMaxWidth: false,
    ...(config.flowchart || {}),
  };

  const themeCSS = [config.themeCSS, EXTRA_THEME_CSS]
    .filter(Boolean)
    .join("\n");

  return originalInitialize({
    ...config,
    securityLevel: "loose",
    flowchart,
    themeCSS,
  });
};

window.mermaid = mermaid;
