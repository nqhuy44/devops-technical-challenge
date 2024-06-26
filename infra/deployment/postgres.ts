import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { provider } from "../eks";
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const postgresConfigPath = `${__dirname}/helm/${pulumi.getStack()}/postgres.yaml`;
let customValues: pulumi.Inputs | undefined;
if (fs.existsSync(postgresConfigPath)) {
    customValues = yaml.load(fs.readFileSync(postgresConfigPath, 'utf8')) as pulumi.Inputs;
}

const namespace = new k8s.core.v1.Namespace("postgresql", {}, { provider });

try {
    const postgres = new k8s.helm.v3.Chart("postgresql", {
        chart: "postgresql",
        fetchOpts: {
            repo: "https://charts.bitnami.com/bitnami",
        },
        values: customValues,
        namespace: namespace.metadata.name,
    }, { provider });
} catch (error) {
    console.error(`Failed to deploy the postgres resources: ${error}`);
}

