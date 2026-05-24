# C4 L1 — System Context

Project H sits at the centre of the diagram; the four persons and four external systems surround it.

<div class="diagram-frame" markdown>

```mermaid
flowchart TB
    classDef person fill:#08427b,stroke:#073B6F,color:#fff
    classDef system fill:#1168bd,stroke:#0E5DAA,color:#fff
    classDef external fill:#999,stroke:#6B6B6B,color:#fff

    P["<b>Patient</b><br/><i>Person</i>"]:::person
    CA["<b>Clinic Admin</b><br/><i>Person</i>"]:::person
    KA["<b>Project H Admin</b><br/><i>Person</i>"]:::person
    CL["<b>Clinician</b><br/><i>Person</i>"]:::person

    K["<b>Project H</b><br/><i>Software System</i><br/>The entire system with all components"]:::system

    MC["<b>MyChart application</b><br/><i>Patient Portal</i><br/>Web interface of EPIC"]:::external
    ST["<b>Stripe</b><br/><i>Payment System</i><br/>Subscription mgmt for Clinic Web App"]:::external
    IC["<b>Intercom</b><br/><i>Customer Service System</i><br/>AI chat/ticketing"]:::external
    EP["<b>Clinic EHR</b><br/><i>EPIC EHR</i><br/>Desktop/web for Clinicians"]:::external

    P -- "Mobile App" --> K
    CA -- "Browser · Clinic Admin Web App" --> K
    KA -- "Browser · Project H Admin Web App" --> K
    CL -- "using as EHR system" --> EP

    P -- "uses as Patient Portal · login" --> MC
    P -- "payment" --> ST
    CA -- "accounting" --> ST
    CL -- "customer support" --> IC

    K <-- "refresh/access tokens<br/>redirect for auth" --> MC
    K <-- "embedding · payment webhook" --> ST
    K -- "embedding into web and mobile apps" --> IC
    K <-- "EPIC FHIR API (read/write)<br/>embedding as SMART FHIR app" --> EP
```

</div>

Source: AVD 4.1 System Context View / Business Flow (Confluence page `420911679`). The architectural narrative around this diagram lives in [architecture overview — System Context view (C4 L1)](../overview.md#system-context-view-c4-l1) — that page lists the actors and systems with one-line role descriptions.

## Cross-references

- [Architecture overview — System Context view](../overview.md#system-context-view-c4-l1) — components in this view, prose form.
- [Integration points](../integration-points.md) — per-system contracts (auth, direction, cardinality, failure mode).
- [ADR-0001 MyChart as per-clinic SSO](../decisions/0001-mychart-as-per-clinic-sso.md) — the decision that determines the MyChart edge.
