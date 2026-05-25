# C4 L3 — Patient Mobile App Backend

Internal decomposition of the **Patient Mobile App Backend** container from the [C4 L2 view](c4-l2-container.md). This is where the cross-system orchestration happens — EPIC FHIR exchange, FDB queries, report assembly, recommendation invocation.

<div class="diagram-frame" markdown>

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#5b9bd5","primaryBorderColor":"#4a86b8","primaryTextColor":"#f8fafc","secondaryColor":"#d6e2f0","secondaryBorderColor":"#9fb3c8","secondaryTextColor":"#0f172a","tertiaryColor":"#d6e2f0","tertiaryBorderColor":"#9fb3c8","tertiaryTextColor":"#0f172a","clusterBkg":"#d6e2f0","clusterBorder":"#9fb3c8","lineColor":"#475569","textColor":"#0f172a","background":"#ffffff","mainBkg":"#5b9bd5","secondBkg":"#d6e2f0","tertiaryBkg":"#d6e2f0","edgeLabelBackground":"#ffffff"},"themeCSS":".nodeLabel p,.nodeLabel span,.nodeLabel b,.nodeLabel i{color:#f8fafc !important;} .cluster .nodeLabel,.cluster .nodeLabel *,.cluster .nodeLabel p,.cluster .nodeLabel span,.cluster .nodeLabel b,.cluster .nodeLabel i,.cluster-label,.cluster-label *,.cluster-label p,.cluster-label span,.cluster-label b,.cluster-label i,.cluster-label .nodeLabel,.cluster-label .nodeLabel *,.cluster-label .nodeLabel p,.cluster-label .nodeLabel span,.cluster-label .nodeLabel b,.cluster-label .nodeLabel i{color:#0f172a !important;fill:#0f172a !important;font-weight:700 !important;} .edgeLabel,.edgeLabel p,.edgeLabel span,.edgeLabel foreignObject div{color:#0f172a !important;} .edgeLabel foreignObject div{background:#ffffff !important;border-radius:2px;padding:1px 3px;} .labelBkg{fill:#ffffff !important;}"}}%%
flowchart TB
    classDef component fill:#5b9bd5,stroke:#4a86b8,color:#fff
    classDef ext fill:#999,stroke:#6B6B6B,color:#fff

    subgraph PMB["Patient Mobile App Backend [Container: Python · FastAPI]"]
        AH["Auth Handler<br/>token validate / refresh"]:::component
        FA["FHIR Adapter<br/>EPIC Bundle assembly/parsing"]:::component
        FDA["FDB Adapter<br/>DDI / DFI / DA / DDC / DPT / SIDE"]:::component
        RA["Report Assembler<br/>HTML template → PDF"]:::component
        RI["Recommendation Invoker<br/>Python lib black-box"]:::component
        AL["Audit Logger<br/>per-request UID"]:::component
    end

    EP[EPIC FHIR API]:::ext
    FDB[FDB endpoints]:::ext
    KR["Project H Recommendation [Library]"]:::ext

    AH -- "refresh via MyChart" --> EP
    FA -- "Patient / Observation / Condition / DocumentReference" --> EP
    FDA -- "real-time + weekly-cached" --> FDB
    RA --> RI
    RI -- "invoke" --> KR
```

</div>

## Cross-references

- [Architecture overview — Component view (C4 L3) — Mobile App Backend](../overview.md#patient-mobile-app-backend-l3) — six components with per-component role descriptions.
- [Data flow — Report to clinician](../data-flows/report-to-clinician.md) — how these six components compose at runtime to assemble the clinician PDF.
- [Architecture overview — CDSS Class I boundary architectural assessment](../overview.md#architectural-assessments) — why the **Recommendation Invoker** treating the library as a black box matters beyond engineering hygiene.
