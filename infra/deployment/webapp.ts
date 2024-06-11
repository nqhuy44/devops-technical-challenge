import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as k8sx from "@pulumi/kubernetes/kustomize";
import * as fs from "fs";
import { provider } from "../eks";
import { deployment } from "../config";

const namespace = new k8s.core.v1.Namespace("webapp", {
    metadata: { name: "webapp" },
}, { provider });

// Define the current environment (dev or prod)
const environment = pulumi.getStack();

// Define the path to the Kustomize overlays based on the environment
let kustomizeDir: string;
kustomizeDir = `${__dirname}/kustomize/${environment}`;
const kustomizeBaseDir = `${__dirname}/kustomize/base/${environment}`;

// Copy the .env file from the root directory to the kustomizeDir
fs.copyFileSync(`../.env`, `${kustomizeBaseDir}/.env`);

// Use Kustomize to deploy the resources
try {
    if (environment === "prod") {
        const color = deployment.color;
        const k8sResources = new k8sx.Directory("web-app", {
            directory: kustomizeDir,
            transformations: [
                (obj: any) => {
                    if (obj.kind === "Ingress" && obj.metadata.name === "webapp-ingress") {
                        obj.spec.rules.forEach((rule: any) => {
                            if (rule.host === "my-domain.com") {
                                rule.http.paths[0].backend.service.name = "webapp-service-" + color;
                            }
                        });
                    }
                },
            ],
        }, { provider });
    }
    else {
        const k8sResources = new k8sx.Directory("web-app", {
            directory: kustomizeDir,
        }, { provider });
    }
}
catch (error) {
    console.error(`Failed to deploy the webapp resources: ${error}`);
}