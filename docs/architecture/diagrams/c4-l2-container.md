# C4 L2 — Container view

The single Project H box from the [System Context](c4-l1-system-context.md) opened up. Persons on top; external systems around the periphery; the Project H system boundary is the dashed area in the centre. **Interact with the diagram:** scroll-wheel zoom inside the frame, double-click to zoom in, drag to pan, use the on-canvas controls (top-left) to fit / reset.

<div class="diagram-frame" markdown>

```mermaid
flowchart TB
    classDef person fill:#08427b,stroke:#073B6F,color:#fff
    classDef andersen fill:#1168bd,stroke:#0E5DAA,color:#fff
    classDef kivira fill:#a855f7,stroke:#7C3AED,color:#fff
    classDef cloud fill:#a7e1ad,stroke:#73B27B,color:#000
    classDef ext fill:#999,stroke:#6B6B6B,color:#fff

    P[Patient]:::person
    KA[Project H Admin]:::person
    CA[Clinic Admin]:::person
    CL[Clinician]:::person

    subgraph PrjH["Project H [System]"]
        direction TB
        PMA["Patient Mobile App<br/>iOS · React Native · TS"]:::andersen
        PMB["Patient Mobile App Backend<br/>Python · FastAPI"]:::andersen
        KAW["Project H Admin Web App<br/>Python · Django Admin"]:::andersen
        CAW["Clinic Admin Web App<br/>Python · Django Admin"]:::andersen

        KG["Project H Games<br/>React Native lib<br/>(cognitive games)"]:::kivira
        KR["Project H Recommendation<br/>Python lib · Rules Engine"]:::kivira
        KML["Project H ML Environment<br/>SageMaker"]:::kivira

        AUTH["Authorization Service<br/>AWS Cognito"]:::cloud
        LB["Load Balancing<br/>AWS ALB"]:::cloud
        NS["Notification Service<br/>AWS SNS / SES / EventBridge"]:::cloud
        LM["Logging & Monitoring<br/>AWS CloudWatch"]:::cloud

        subgraph Data["Data layer"]
            RDS[("Relational DB<br/>AWS RDS PostgreSQL")]:::cloud
            EC[("Caching Service<br/>AWS ElastiCache")]:::cloud
            S3[("File Storage / Datalake<br/>AWS S3")]:::cloud
        end
    end

    SJ["SurveyJS<br/>External library"]:::ext
    MC["MyChart<br/>Patient portal per clinic"]:::ext
    EP["EPIC EHR"]:::ext
    ST["Stripe<br/>Payment System"]:::ext
    FDB["FDB<br/>Medical Database"]:::ext
    IC["Intercom"]:::ext
    APNS["Apple Push Notification Service"]:::ext

    P -- "Mobile App" --> PMA
    KA -- "Browser" --> KAW
    CA -- "Browser" --> CAW
    CL -- "SMART FHIR" --> CAW

    PMA -- "includes as package" --> KG
    PMA -- "includes as package · WebView" --> SJ
    PMA -- "https · REST API" --> LB
    LB --> PMB
    LB --> KAW
    LB --> CAW

    PMA -- "credentials" --> MC
    MC -- "login page WebView · email/sms" --> PMA
    PMA -- "Amplify Authenticator" --> AUTH

    PMB -- "includes as package" --> KR
    PMB -- "AWS SDK" --> NS
    NS -- "push" --> APNS
    NS -- "email" --> IC

    PMB -- "FHIR API" --> EP
    CAW -- "embedding · WebHook" --> ST

    KR -- "request" --> KML
    KML -- "load" --> S3

    PMB -- "read/write" --> RDS
    KAW -- "read/write" --> RDS
    CAW -- "read/write · metadata" --> RDS

    PMB -- "API" --> FDB
    PMB -- "Admin REST API" --> IC
```

</div>

Source: AVD 4.2 Container View (Confluence page `420911687`). Legend: dark-blue = Person, blue = Andersen-implemented container, purple = Project H-implemented library (D30 black-box), green = AWS managed service, grey = external system.

## Cross-references

- [Architecture overview — Container view](../overview.md#container-view-c4-l2) — components in this view, prose form (Andersen vs Project H vs cloud vs external split).
- [C4 L3 — Mobile App Backend](c4-l3-mobile-backend.md) — internal decomposition of the **Patient Mobile App Backend** container.
- [C4 L3 — Authorization Service](c4-l3-authorization-service.md) — internal decomposition of the **Authorization Service** (AWS Cognito glue).
- [Integration points](../integration-points.md) — per-external-system contract details (MyChart, FDB, Stripe, Intercom, AWS managed services).
