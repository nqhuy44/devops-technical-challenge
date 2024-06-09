import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import { eksConfig, nodeGroupConfig, tags } from "../config";
import { NodeConfig } from "../interface";
import { cluster } from "../eks"

// Create an IAM role for the node group
const nodeGroupRole = new aws.iam.Role("nodeGroupRole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "ec2.amazonaws.com" }),
});

// Attach the AmazonEKSWorkerNodePolicy to the node group role
const nodeGroupRolePolicyAttachment = new aws.iam.RolePolicyAttachment("nodeGroupRolePolicyAttachment", {
    role: nodeGroupRole.name,
    policyArn: aws.iam.ManagedPolicy.AmazonEKSWorkerNodePolicy,
});
const nodeGroupRolePolicyAttachmentForECR = new aws.iam.RolePolicyAttachment("nodeGroupRolePolicyAttachmentForECR", {
    role: nodeGroupRole.name,
    policyArn: aws.iam.ManagedPolicy.AmazonEC2ContainerRegistryReadOnly,
});

// Create an EKS Node Group V2 with autoscaling configuration

const nodeAnnotations: String[] = [];
nodeGroupConfig.forEach((node: NodeConfig) => {
    const nodetains = node.taints && node.taints.length > 0 ? node.taints.reduce((acc, taint) => ({...acc, [`${taint.key}=${taint.value}:${taint.effect}`]: taint}), {}) : {};    new eks.NodeGroupV2(node.name, {
        cluster: cluster,
        instanceType: node.instanceType,
        desiredCapacity: node.desiredCapacity,
        minSize: node.minSize,
        maxSize: node.maxSize,
        spotPrice: node.spotPrice ? node.spotPrice : undefined,
        amiId: node.amiId ? node.amiId : undefined,
        nodeRootVolumeSize: node.nodeRootVolumeSize ? node.nodeRootVolumeSize : undefined,
        taints: nodetains,
        // tags: node.tags,
    });
    nodeAnnotations.push(`--nodes=${node.minSize}:${node.maxSize}:${eksConfig.clusterName}`);
});

const clusterAutoscaler = new k8s.yaml.ConfigFile("cluster-autoscaler", {
    file: "https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml",
    transformations: [
        (obj: any) => {
            if (obj.kind === "Deployment" && obj.metadata.name === "cluster-autoscaler") {
                obj.spec.template.spec.containers[0].command.push(
                    ...nodeAnnotations
                );
            }
        }
    ],
}, { provider: cluster.provider });
