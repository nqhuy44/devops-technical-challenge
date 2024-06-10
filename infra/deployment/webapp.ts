import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as k8sx from "@pulumi/kubernetes/kustomize";
import { provider } from "../eks";

const namespace = new k8s.core.v1.Namespace("webapp", {}, { provider });

// Define the current environment (dev or prod)
const environment = pulumi.getStack();

// Define the path to the Kustomize overlays based on the environment
const kustomizeDir = `${__dirname}/kustomize/${environment}`;

// Use Kustomize to deploy the resources
try {
    const k8sResources = new k8sx.Directory("web-app", {
        directory: kustomizeDir,
    }, { provider });
}
catch (error) {
    console.error(`Failed to deploy the webapp resources: ${error}`);
}