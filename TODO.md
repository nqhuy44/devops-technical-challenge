# To do list
## 1. TLS/SSL
### Route53
- Provision a domain
- Create CNAME record point to loadbalancer which created when deploy `nginx ingress controller`
### ACM
- Request public certificate for domain
- DNS validation and add the CNAME record provided by ACM to Route 53
### Application ingress (manifest)
- Update ingress of application with annotations
`service.beta.kubernetes.io/aws-load-balancer-ssl-cert` and add more tls option:
```bash
  tls:
    - hosts:
        - your-domain.com
      secretName: tls-secret
```

## 2. Monitoring
### Prometheus (monitor)
Implement Prometheus in cluster by using helm
- Custom helm values:
  - Custom expose ports
  - Authen method JWT (recommend) or BasicAuth
  - Custom scrape config and labels
- Export metrics to external:
  - Update open ports in security groups
  - Optional individual ingress for metrics or ingress controller
Grafana Instance
  - Connect to Exported prometheus by expose port and credentials
  - Setup Dashboard monitor metrics
### Datadog (monitor and logs)
Implement Datadog in cluster by using helm
- Custom helm values:
  - Token key to access Datadog tenant
  - Filter logs if need
- Deployment update annotation:
  - filter unnecessary logs
  - relabels log ingress

## 3. CI/CD
### Lint and unit test
- Implement lint rules and unit test in application code
- Adjust stage `lint` and `unit-test` in pipline (which is commented)
### Component and Integration test
- Implement integrate with other tools in Github
- Implemnet more stage or individual workflow