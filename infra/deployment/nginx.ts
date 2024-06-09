import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { provider } from "../eks";
import * as fs from 'fs';
import * as yaml from 'js-yaml';


const customValues = yaml.load(fs.readFileSync(`${__dirname}/helm/${pulumi.getStack()}/nginx.yaml`, 'utf8')) as pulumi.Inputs;
const nginxIngress = new k8s.helm.v3.Chart("nginx-ingress", {
    chart: "ingress-nginx",
    version: "3.36.0",
    fetchOpts: {
        repo: "https://kubernetes.github.io/ingress-nginx",
    },
    values: customValues,
    namespace: "nginx-ingress"
}, { provider });

export const ingressControllerServiceUrl = nginxIngress.getResource("v1/Service", "ingress-nginx-controller").status.loadBalancer.ingress[0].hostname;