#To do list
## TLS/SSL
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

## Monitoring
### Prometheus
Implement Prometheus in cluster by using helmchart and deploy by pulumi
- Customs helm values:
  - Custom expose ports
  - Authen method JWT (recommend) or BasicAuth
  - Custom scrape config and labels
- Export metrics to external:
  - Update open ports in security groups
  - Optional individual ingress for metrics or ingress controller
- Grafana Instance
  - Connect to Exported prometheus by