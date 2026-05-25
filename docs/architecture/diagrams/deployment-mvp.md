# Deployment view — MVP

AWS deployment for the MVP release. Region us-east-2 with Multi-AZ primary→read-replica replication; ECS Cluster with Docker workloads across three availability zones; AWS managed services rail on the right (Cognito, KMS, CloudWatch, ElastiCache, WAF, Shield, Certificate Manager, S3, SageMaker, Secrets Manager, SES, SNS).

<div class="diagram-frame" markdown>

```mermaid
%%{init: {"theme":"base","themeVariables":{"primaryColor":"#5b9bd5","primaryBorderColor":"#4a86b8","primaryTextColor":"#f8fafc","secondaryColor":"#d6e2f0","secondaryBorderColor":"#9fb3c8","secondaryTextColor":"#0f172a","tertiaryColor":"#d6e2f0","tertiaryBorderColor":"#9fb3c8","tertiaryTextColor":"#0f172a","clusterBkg":"#d6e2f0","clusterBorder":"#9fb3c8","lineColor":"#475569","textColor":"#0f172a","background":"#ffffff","mainBkg":"#5b9bd5","secondBkg":"#d6e2f0","tertiaryBkg":"#d6e2f0","edgeLabelBackground":"#ffffff"}}}%%
flowchart TB
    U((User))
    APP["Mobile App"]
    BR["Web Browser"]
    AS["App Store"]
    TF["TestFlight"]
    GH["GitHub"]
    INT((Internet))

    U --> APP
    U --> BR
    APP -- install --> AS
    AS -- publish --> TF
    TF -- "GitHub Actions" --> GH
    APP --> INT
    BR --> INT

    subgraph AWS["AWS Cloud · us-east-2"]
        direction TB
        R53["Route 53"]

        subgraph VPC["VPC"]
            direction TB
            subgraph PUB["Public subnet"]
                direction LR
                ALB["Application Load Balancer"]
                NAT["NAT Gateway"]
            end

            subgraph PRIV["Private subnet · Compute + autoscaling"]
                direction LR
                subgraph ECS["ECS Cluster"]
                    direction TB
                    N1["Node<br/>us-east-2a"]
                    N2["Node<br/>us-east-2b"]
                    N3["Node<br/>us-east-2c"]
                end
                subgraph RDS["RDS PostgreSQL · Multi-AZ"]
                    direction TB
                    RDSP[("Primary<br/>us-east-2a")]
                    RDSR[("Read Replica<br/>us-east-2b")]
                    RDSP -- replication --> RDSR
                end
            end
        end

        subgraph SVC["AWS managed services"]
            direction TB
            subgraph SVC_AUTH["Identity & auth"]
                direction LR
                AMP["Amplify"]
                COG["Cognito"]
            end
            subgraph SVC_SEC["Security & secrets"]
                direction LR
                KMS["KMS"]
                SM["Secrets Mgr"]
                WAF["WAF"]
                SH["Shield"]
                ACM["Cert Manager"]
            end
            subgraph SVC_OBS["Observability"]
                direction LR
                CW["CloudWatch"]
                EB["EventBridge"]
            end
            subgraph SVC_DATA["Storage & cache"]
                direction LR
                S3[("S3")]
                EC[("ElastiCache")]
            end
            subgraph SVC_ML["Machine learning"]
                SAGE["SageMaker"]
            end
            subgraph SVC_NOTIF["Notifications"]
                direction LR
                SES["SES email"]
                SNS["SNS push"]
            end
        end
    end

    INT --> R53
    R53 --> ALB
    ALB --> ECS
    ECS --> RDSP
    ECS -.-> NAT
    NAT -.-> INT
    GH -. CI/CD .-> AMP
    SAGE -- load --> S3
```

</div>

Source: AVD 4.3 Deployment view (Confluence page `420911696`). RPO 5–10 min (continuous transaction-log backup); RTO 15–30 min (DB restore drill) per AVD §5.5.

## Cross-references

- [Architecture overview — Deployment view](../overview.md#deployment-view) — ten layers (DNS, Load Balancing, Compute, Networking, Database, ML & Storage, Monitoring, Security, CI/CD, Environments) with per-service one-liners.
- [Architecture overview — Operations](../overview.md#operations) — backup, DR, CI/CD, monitoring details.
- [Release coexistence](../release-coexistence.md) — references this view as MVP topology; a larger "final product" topology is post-MVP infrastructure.
