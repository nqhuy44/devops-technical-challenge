import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import * as k8sx from "@pulumi/kubernetes/kustomize";
import { provider } from "../eks";

// Define the current environment (dev or prod)
const environment = pulumi.getStack();

// Define the path to the Kustomize overlays based on the environment
const kustomizeDir = `${__dirname}/kustomize/${environment}`;

// Use Kustomize to deploy the resources
const k8sResources = new k8sx.Directory("web-app", {
    directory: kustomizeDir,
}, { provider });

// Export some of the resources' properties, if needed
// export const deploymentName = k8sResources.resources.apply(resources => {
//     const deployment = resources.find(resource => resource.kind === "Deployment");
//     return deployment ? deployment.metadata.name : "no-deployment-found";
// });