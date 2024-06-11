# Considerrations:
## 1. Database
### Fully Manage service
Not recommend to provision database inside cluster (in prod) should use individual cluster or database services like AWS RDS.

- **Potential for data loss or corruption**: Running a database within a cluster can expose it to risks that could lead to data loss or corruption. Using a dedicated database service can provide more robust data protection and backup options.
- **Specialized knowledge**: Managing a database requires specialized knowledge. Using a managed service can free your team to focus on application development.
- **Performance**: Databases can be resource-intensive, and running a database in your cluster could impact the performance of your other services.
- **Scalability**: Run database in cluster take more effort to scale database resource like compute, memory, storages.
- **Maintenance overhead**: Databases require regular maintenance, including updates, backups, and security checks. This can be time-consuming and distract from other important tasks.

**There are more things to setup:**
***Provision in cluster***
    - Dedicate nodegroup for database (prevent resource appropriation)
    - Dedicate storage for database - persistent volume
    - Ingress or Network expose if database is used from external applications
    - Backup mechanism
***Use database services***
    - Provision database service example AWS RDS
    - Use Secret Manager to store database connection string

### Performance
The Application can need high IOPS or connection dedicated to have a good performance. If database lack of iops or connection reception it can cause decrease of application's performance
- **Read-Write Separation**: If the application requires high IOPS, implementing a layer to separate read and write operations
- **Dedicated Instance for Read Operations**: Allocating a dedicated instance for handling read operations can further enhance performance.
- **Connection Pooling**: Connection pooling maintaining a cache of database connections that can be reused when future requests to the database are required, reducing the overhead of establishing a new connection for every request.
  
## 2. Cluster Complexity

Managing a cluster that runs multiple applications or services can increase the complexity of deployment and infrastructure provisioning. This complexity is further amplified if the repository containing the application code also handles infrastructure provisioning.

### Dedicate repository to provision infrastructure
To manage this complexity, consider using a dedicated repository for infrastructure provisioning.
- This repository focus on the necessary scripts, configuration files, and resources needed to set up and manage the infrastructure and cluster manifests, components.
- Separating infrastructure management from application code can lead to cleaner, more maintainable codebases.

### Platform/Tool to sync manifests of clusters and applications
To manage complexity is to use a platform or tool that can synchronize the manifests of clusters and applications.
- Tools like ArgoCD, Flux, can automatically apply changes to cluster manifest based on changes in your Git repositories.
- This GitOps approach can help ensure consistency and reproducibility across deployments.
- Centralize deployments and operations of multi cluster into one platform is esier to manage and operate


## 3. Application architecture
When designing application, consider the most suitable compute orchestration platform. The choice between Kubernetes, serverless architectures (like AWS Lambda), or container services (like ECS) depends on application's specific needs and constraints.

### Serverless Compute (example: AWS Lambda)
- Ideal for applications with unpredictable traffic patterns, as they can automatically scale to match demand.
- Offload server management tasks, allowing developers to focus more on writing code.
- Perfectly suited for a microservices architecture, as each function can be developed, deployed, and scaled independently.
- Supports event-driven architecture, where functions can be triggered by events from other AWS services.
- However, they may not be suitable for long-running tasks or applications with specific runtime requirements.

### Container Service (example: ECS)
- Offers more control over the runtime environment compared to serverless architectures.
- Suitable for applications that require specific runtime configurations or those that need to run long, uninterrupted processes.
- Ideal when you need a simplified environment for container orchestration, a more straightforward solution compared to Kubernetes.

### Platform service (example: Beanstalk, Vercel)
- Provides a complete platform solution for deploying and running applications.
- Manages the underlying infrastructure, including network resources, operating system security, and database connections, allowing developers to focus on writing code.
- Supports multiple programming languages and frameworks.
- Ideal for applications that require a quick, simple deployment process without the need for extensive infrastructure management.
- However, they may offer less control over the runtime environment compared to serverless or container services.

## 4. Security
### Cluster Security
- Implemented AWS IAM role associated with Cluster Service account to grant permission a group/user can access cluster but need to provision to prevent user place in wrong IAM Group
- Least Privilege: Ensure IAM roles and policies follow the least privilege
- Regular check update version of kubernetes
### Node Security:
- Regularly updated Amazon Machine Images (AMIs) for worker nodes
- Use distinct IAM roles for different node groups to limit access.
### Pod Security
- Pod Security Policies: Pod Security Standards (PSS) to enforce security standards pods.
- Resource Limits: If necessary resource limits for CPU and memory.
### Use Secret Manager
- Use AWS Secrets Manager or another secrets management tool to securely store and manage sensitive information such as database credentials.
### Pulumi backend
- Can move pulumi backend to Storage service like AWS S3 or Google GCS