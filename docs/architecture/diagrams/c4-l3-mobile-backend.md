# C4 L3 — Patient Mobile App Backend

Internal decomposition of the **Patient Mobile App Backend** container from the [C4 L2 view](c4-l2-container.md). This is where the cross-system orchestration happens — EPIC FHIR exchange, FDB queries, report assembly, recommendation invocation. **Interact with the diagram:** scroll-wheel zoom, double-click, drag to pan, controls top-left.

<div class="diagram-frame" markdown>

```mermaid
flowchart TB
    classDef component fill:#85bbf0,stroke:#5d99c6,color:#000
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
