import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

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
  });
};

window.mermaid = mermaid;
