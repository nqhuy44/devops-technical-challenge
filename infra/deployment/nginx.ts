import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";
import { provider } from "../eks";
import { tags } from "../config";
import * as fs from 'fs';
import * as yaml from 'js-yaml';


const customValues = yaml.load(fs.readFileSync(`${__dirname}/helm/${pulumi.getStack()}/nginx.yaml`, 'utf8')) as pulumi.Inputs;

const namespace = new k8s.core.v1.Namespace("nginx-ingress", {}, { provider });

let ingressControllerServiceUrl: any;

try {
    const nginxIngress = new k8s.helm.v3.Chart("nginx-ingress-controller", {
        chart: "nginx-ingress-controller",
        fetchOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: customValues,
        namespace: namespace.metadata.name,
    }, { provider });
    ingressControllerServiceUrl = nginxIngress.getResource("v1/Service", "ingress-nginx-controller").status.loadBalancer.ingress[0].hostname;
} catch (error) {
    console.error(`Failed to deploy the nginx ingress controller: ${error}`);
}

export { ingressControllerServiceUrl };