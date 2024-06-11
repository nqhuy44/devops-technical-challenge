import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";
import { provider } from "../eks";
import { tags } from "../config";
import * as fs from 'fs';
import * as yaml from 'js-yaml';


const prometheusConfigPath = `${__dirname}/helm/${pulumi.getStack()}/prometheus.yaml`;
let customValues: pulumi.Inputs | undefined;

if (fs.existsSync(prometheusConfigPath)) {
    customValues = yaml.load(fs.readFileSync(prometheusConfigPath, 'utf8')) as pulumi.Inputs;
}


const namespace = new k8s.core.v1.Namespace("prometheus", {
    metadata: { name: "prometheus" },
}, { provider });


try {
    const prometheus = new k8s.helm.v3.Chart("prometheus", {
        chart: "prometheus",
        fetchOpts: {
            repo: "https://prometheus-community.github.io/helm-charts",
        },
        values: customValues,
        namespace: namespace.metadata.name,
    }, { provider });
} catch (error) {
    console.error(`Failed to provision Prometheus: ${error}`);
}