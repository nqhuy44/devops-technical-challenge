# Scalable Web Application Infrastructure

This repository contains an Infrastructure as Code (IaC) solution for deploying a scalable web application stack consisting of containerized components using Pulumi and Kubernetes on AWS EKS.

## Services:
- `Github Action` for CI/CD
- `AWS EKS` for Kubernetes cluster where to place application
- `Pulumi` for Infra provision and configuration
- Consider additional services need:
  + AWS VPC
  + AWS EC2
  + AWS ACM
  + AWS Route53
  + AWS Loadbalancer
  + AWS RDS
  + AWS KMS
  + AWS ECR

## Directory Structure
```bash
./
├── src/
│   ├── index.ts
├── package.json
├── tsconfig.json
├── Dockerfile
├── infra
├── ├── eks/
│       ├── index.ts
├── ├── vpc/
│       ├── index.ts
├── ├── nodeGroup/
│       ├── index.ts
├── ├── securityGroup/
│       ├── index.ts
├── ├── iam/
│       ├── index.ts
├── ├── deployment/
│       ├── kustomize
│       ├── helm
│   ├── Pulumi.dev.yaml
│   ├── Pulumi.prod.yaml
│   ├── package.json
│   ├── tsconfig.json
├── .gitignore
├── README.md
├── TODO.md
├── CONSIDERATIONS.md
```

- **src/**: Application source code and Dockerfile.
- **infra/**: Pulumi program and configurations for different environments.
  + ***deployment***: applications manifest
  + ***eks***: eks provision
  + ***iam***: additional iam provision
  + ***nodeGroup***: nodegroup provision use in eks cluster
  + ***securityGroup***: security group provision
  + ***vpc***: vpc provision
  + **Pulumi.yaml**: Pulumi config
  + **Pulumi`<stack>`.yaml**: Pulumi stack config

## Getting Started

### Prerequisites

- Node.js
- Pulumi CLI
- AWS CLI
- Docker

### Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Configure AWS credentials:
    ```bash
    aws configure
    ```

### Local Development:
1. Init `.env` from `.env.example` and update parameters

2. Install dependencies
   ```bash
   npm install
   ```
   
3. For more components (database) in local, check `docker-compose.yaml` (ports, volumes)

4. Run docker to start app and database
   ```bash
   docker compose up -d
   ```

### Deploy by using Pulumi

1. Go to infra directory
   ```bash
   cd infra
   ```

2. Install dependencies
    ```
    npm install
    ```

3. Select the dev stack:
    ```bash
    pulumi stack select dev
    ```

4. Review changes
   ```bash
   pulumi preview
   ```

5. Deploy the infrastructure:
    ```bash
    pulumi up
    ```

### Deploy to Production Environment

1. Select the prod stack:
    ```bash
    pulumi stack select prod
    ```

2. Deploy the infrastructure:
    ```bash
    pulumi up
    ```

### Cleanup

To destroy the infrastructure:

1. Select the stack (dev or prod):
    ```bash
    pulumi stack select <stack>
    ```

2. Destroy the resources:
    ```bash
    pulumi destroy
    ```

### Update Infra Configuration:

To udpate infastructure configuration, update config parameters in `Pulumi.<stack>.yaml`

1. Go to `infra` directory
   ```bash
   cd infra
   ```

2. Update desired config in `Pulumi.<stack>.yaml`
3. Preview and Apply pulumi provision

**Usecase exmaple:**
***exmp1: Add more nodegroup:***
- Add more config in `nodeGroup` in Pulumi config
  ```yaml
  config:
    nodegroup:
        - name: nodegroup-1
          instanceType: t3.medium
        ...
        - name: new-nodegroup
          instanceType: t3.medium
  ```
- Then run `pulumi preview` and `pulumi up`

***examp2: Deploy Blue/Green in production:***
- Select stack prod in pulumi `pulumi stack select prod`
- Update deployment for `green (test)` in pulumi config `Pulumi.prod.yaml`
  ```yaml
  config:
    deployment:
        corlor: "green"
  ```
- Then run `pulumi preview` and `pulumi up`
- After test and verify `green (test)` environment work properly
- Update deployment for `blue` in pulumi config `Pulumi.prod.yaml`
    ```yaml
  config:
    deployment:
        corlor: "blue"
  ```
- Then run `pulumi preview` and `pulumi up`

## Github
### Environment and Secrets:
These environment secrets are required for CI/CD
```bash
AWS_ACCESS_KEY_ID 
AWS_REGION
AWS_SECRET_ACCESS_KEY
DB_HOST
DB_NAME
DB_PASSWORD
DB_USER
DB_USERPASSWORD
ECR_REGISTRY
ECR_REPOSITORY
PULUMI_ACCESS_TOKEN
```

# TODO
Reference:
- [TODO.md](TODO.md)

# CONSIDERATIONS
Reference:
- [CONSIDERATIONS.md](CONSIDERATIONS.md)