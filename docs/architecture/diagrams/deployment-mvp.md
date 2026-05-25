# Deployment view — MVP

AWS deployment for the MVP release. Region us-east-2 with Multi-AZ primary→read-replica replication; ECS Cluster with Docker workloads across three availability zones; AWS managed services rail on the right (Cognito, KMS, CloudWatch, ElastiCache, WAF, Shield, Certificate Manager, S3, SageMaker, Secrets Manager, SES, SNS).

<div class="diagram-frame" markdown>

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#5b9bd5","primaryBorderColor":"#4a86b8","primaryTextColor":"#f8fafc","secondaryColor":"#d6e2f0","secondaryBorderColor":"#9fb3c8","secondaryTextColor":"#0f172a","tertiaryColor":"#d6e2f0","tertiaryBorderColor":"#9fb3c8","tertiaryTextColor":"#0f172a","clusterBkg":"#d6e2f0","clusterBorder":"#9fb3c8","lineColor":"#475569","textColor":"#0f172a","background":"#ffffff","mainBkg":"#5b9bd5","secondBkg":"#d6e2f0","tertiaryBkg":"#d6e2f0","edgeLabelBackground":"#ffffff"},"themeCSS":".nodeLabel p,.nodeLabel span,.nodeLabel b,.nodeLabel i{color:#f8fafc !important;} .cluster .nodeLabel,.cluster .nodeLabel *,.cluster .nodeLabel p,.cluster .nodeLabel span,.cluster .nodeLabel b,.cluster .nodeLabel i,.cluster-label,.cluster-label *,.cluster-label p,.cluster-label span,.cluster-label b,.cluster-label i,.cluster-label .nodeLabel,.cluster-label .nodeLabel *,.cluster-label .nodeLabel p,.cluster-label .nodeLabel span,.cluster-label .nodeLabel b,.cluster-label .nodeLabel i{color:#0f172a !important;fill:#0f172a !important;font-weight:700 !important;} .edgeLabel,.edgeLabel p,.edgeLabel span,.edgeLabel foreignObject div{color:#0f172a !important;} .edgeLabel foreignObject div{background:#ffffff !important;border-radius:2px;padding:1px 3px;} .labelBkg{fill:#ffffff !important;}"}}%%
flowchart TB
    U((User))
    APP[Mobile Application]
    BR[Web Browser]
    AS[App Store]
    TF[TestFlight]
    GH[GitHub]
    INT((Internet))

    U --> APP
    U --> BR
    APP -- install --> AS
    AS -- publish --> TF
    TF -- GitHub actions --> GH
    APP --> INT
    BR --> INT

    subgraph AWS["AWS Cloud · Region us-east-2"]
        R53[AWS Route 53]

        subgraph VPC["VPC"]
            subgraph PUB["Public subnet · Load balancing"]
                ALB[Application Load Balancer]
                NAT[NAT Gateway]
            end

            subgraph PRIV["Private subnet · Compute + autoscaling"]
                subgraph ECS["ECS Cluster"]
                    N1[Node<br/>us-east-2a]
                    N2[Node<br/>us-east-2b]
                    N3[Node<br/>us-east-2c]
                end
                RDSP[("RDS PostgreSQL<br/>Primary · us-east-2a")]
                RDSR[("RDS PostgreSQL<br/>Read Replica · us-east-2b")]
                RDSP -- replication --> RDSR
            end
        end

        subgraph SVC["AWS managed services"]
            AMP[Amplify]
            COG[Cognito]
            EB[EventBridge]
            CW[CloudWatch]
            KMS[KMS]
            EC[(ElastiCache)]
            SH[Shield]
            WAF[WAF]
            ACM[Certificate Manager]
            S3[(S3 File Storage)]
            SAGE[Sagemaker]
            SM[Secrets Manager]
            SES[Simple Email Service]
            SNS[Simple Notification Service]
        end
    end

    INT --> R53
    R53 --> ALB
    ALB --> N1 & N2 & N3
    N1 & N2 & N3 --> RDSP
    N1 & N2 & N3 -.-> NAT
    NAT -.-> INT
    GH -. GitHub actions .-> AMP
    SAGE -- load --> S3
```

</div>

Source: AVD 4.3 Deployment view (Confluence page `420911696`). RPO 5–10 min (continuous transaction-log backup); RTO 15–30 min (DB restore drill) per AVD §5.5.

## Cross-references

- [Architecture overview — Deployment view](../overview.md#deployment-view) — ten layers (DNS, Load Balancing, Compute, Networking, Database, ML & Storage, Monitoring, Security, CI/CD, Environments) with per-service one-liners.
- [Architecture overview — Operations](../overview.md#operations) — backup, DR, CI/CD, monitoring details.
- [Release coexistence](../release-coexistence.md) — references this view as MVP topology; a larger "final product" topology is post-MVP infrastructure.
