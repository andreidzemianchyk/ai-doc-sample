# C4 L3 — Authorization Service

Internal decomposition of the **Authorization Service** (AWS Cognito + Project H glue) container from the [C4 L2 view](c4-l2-container.md). This view exposes the **Per-clinic Config Resolver** as the extraction surface called out in the [per-clinic EPIC integration cost architectural assessment](../overview.md#architectural-assessments).

<div class="diagram-frame" markdown>

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#5b9bd5","primaryBorderColor":"#4a86b8","primaryTextColor":"#f8fafc","secondaryColor":"#d6e2f0","secondaryBorderColor":"#9fb3c8","secondaryTextColor":"#0f172a","tertiaryColor":"#d6e2f0","tertiaryBorderColor":"#9fb3c8","tertiaryTextColor":"#0f172a","clusterBkg":"#d6e2f0","clusterBorder":"#9fb3c8","lineColor":"#475569","textColor":"#0f172a","background":"#ffffff","mainBkg":"#5b9bd5","secondBkg":"#d6e2f0","tertiaryBkg":"#d6e2f0","edgeLabelBackground":"#ffffff"},"themeCSS":".nodeLabel p,.nodeLabel span,.nodeLabel b,.nodeLabel i{color:#f8fafc !important;} .cluster .nodeLabel,.cluster .nodeLabel *,.cluster .nodeLabel p,.cluster .nodeLabel span,.cluster .nodeLabel b,.cluster .nodeLabel i,.cluster-label,.cluster-label *,.cluster-label p,.cluster-label span,.cluster-label b,.cluster-label i,.cluster-label .nodeLabel,.cluster-label .nodeLabel *,.cluster-label .nodeLabel p,.cluster-label .nodeLabel span,.cluster-label .nodeLabel b,.cluster-label .nodeLabel i{color:#0f172a !important;fill:#0f172a !important;font-weight:700 !important;} .edgeLabel,.edgeLabel p,.edgeLabel span,.edgeLabel foreignObject div{color:#0f172a !important;} .edgeLabel foreignObject div{background:#ffffff !important;border-radius:2px;padding:1px 3px;} .labelBkg{fill:#ffffff !important;}"}}%%
flowchart TB
    classDef component fill:#5f9e67,stroke:#4d8555,color:#fff
    classDef ext fill:#999,stroke:#6B6B6B,color:#fff

    subgraph AUTH["Authorization Service [AWS Cognito + Project H glue]"]
        MCT["MyChart Token Store<br/>encrypted, per-patient"]:::component
        CP["Cognito Provider<br/>non-EPIC fallback path"]:::component
        PCR["Per-clinic Config Resolver<br/>(discovery: per-clinic literals)"]:::component
        RL["Refresh Loop<br/>access ↔ refresh dance"]:::component
        BG["Biometric Gate<br/>Face ID / passcode"]:::component
    end

    MC["MyChart per clinic"]:::ext
    Patient[Patient via app]

    Patient -- "EPIC flow" --> MCT
    Patient -- "non-EPIC flow" --> CP
    MCT -- "PKCE" --> MC
    PCR -- "resolves URL for" --> MCT
    PCR -- "resolves IdP for" --> CP
    MCT --> RL
    BG -- "gates" --> MCT
    BG -- "gates" --> CP
```

</div>

## Cross-references

- [Architecture overview — Component view (C4 L3) — Authorization Service](../overview.md#authorization-service-l3) — five components with per-component role descriptions.
- [Auth & Authorization module — Variations (EPIC vs non-EPIC)](../../modules/auth-authorization/variations.md) — the two paths through this service shown side by side.
- [ADR-0001 MyChart as per-clinic SSO](../decisions/0001-mychart-as-per-clinic-sso.md) — the decision the **MyChart Token Store** + **Per-clinic Config Resolver** operationalise.
- [Architecture overview — Per-clinic EPIC integration cost architectural assessment](../overview.md#architectural-assessments) — why the **Per-clinic Config Resolver** is the proposed extraction target.
