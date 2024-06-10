import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";
import { provider } from "../eks";
import { tags } from "../config";
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Allocate a new Elastic IP
// const staticIP = new aws.ec2.Eip("webappStaticIP", {
//     tags: {
//         Name: "webappStaticIP",
//         ...tags,
//     },
// });


const customValues = yaml.load(fs.readFileSync(`${__dirname}/helm/${pulumi.getStack()}/nginx.yaml`, 'utf8')) as pulumi.Inputs;
// customValues.controller.service.annotations = {
//     "service.beta.kubernetes.io/aws-load-balancer-eip-allocations": staticIP.id,
// }

const namespace = new k8s.core.v1.Namespace("nginx-ingress", {}, { provider });

const nginxIngress = new k8s.helm.v3.Chart("nginx-ingress-controller", {
    chart: "nginx-ingress-controller",
    fetchOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
    values: customValues,
    namespace: namespace.metadata.name,
}, { provider });

// export const webappStaticIP = staticIP.publicIp;
export const ingressControllerServiceUrl = nginxIngress.getResource("v1/Service", "ingress-nginx-controller").status.loadBalancer.ingress[0].hostname;