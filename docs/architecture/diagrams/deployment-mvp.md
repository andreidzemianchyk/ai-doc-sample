# Deployment view — MVP

AWS deployment for the MVP release. Region us-east-2 with Multi-AZ primary→read-replica replication; ECS Cluster with Docker workloads across three availability zones; AWS managed services rail on the right (Cognito, KMS, CloudWatch, ElastiCache, WAF, Shield, Certificate Manager, S3, SageMaker, Secrets Manager, SES, SNS). **Interact with the diagram:** scroll-wheel zoom, double-click, drag to pan, controls top-left.

<div class="diagram-frame" markdown>

```mermaid
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
