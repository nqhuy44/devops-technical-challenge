# Scalable Web Application Infrastructure

This repository contains an Infrastructure as Code (IaC) solution for deploying a scalable web application stack consisting of containerized components using Pulumi and Kubernetes on AWS EKS.

## Services:
- `Github Action` for CI/CD
- `AWS EKS` for Kubernetes cluster where to place application
- `Pulumi` for Infra provision and configuration
- Consider additional services:
  + 

## Directory Structure

- **.pulumi/**: Pulumi stack configurations for different environments.
- **app/**: Application source code and Dockerfile.
- **infra/**: Pulumi program and configurations for different environments.

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
    cd scalable-web-app
    ```

2. Install dependencies:
    ```bash
    cd infra
    npm install
    ```

3. Configure AWS credentials:
    ```bash
    aws configure
    ```

### Deploy to Development Environment

1. Select the dev stack:
    ```bash
    pulumi stack select dev
    ```

2. Deploy the infrastructure:
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

## Cleanup

To destroy the infrastructure:

1. Select the stack (dev or prod):
    ```bash
    pulumi stack select <stack>
    ```

2. Destroy the resources:
    ```bash
    pulumi destroy
    ```