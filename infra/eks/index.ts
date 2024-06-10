import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes"; 
import * as vpc from "../vpc";
import { eksConfig, tags } from "../config";

// Create IAM role for EKS Cluster
const eksRole = new aws.iam.Role("eksRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "eks.amazonaws.com",
            },
        }],
    }),
});

new aws.iam.RolePolicyAttachment("eksRolePolicyAttachment", {
    role: eksRole,
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
});

// Create IAM role for EKS Node Group
export const nodeGroupRole = new aws.iam.Role("nodeGroupRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "ec2.amazonaws.com",
            },
        }],
    }),
});

// Assuming nodeGroupRole is an instance of aws.iam.Role
const autoscalingPolicy = new aws.iam.RolePolicy("AutoscalingPolicy", {
    role: nodeGroupRole.name,
    policy: {
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup",
                "ec2:DescribeLaunchTemplateVersions",
                "ec2:Get*",
                "ec2:Describe*",
            ],
            Resource: "*"
        }],
    },
});

new aws.iam.RolePolicyAttachment("nodeGroupRolePolicyAttachment1", {
    role: nodeGroupRole,
    policyArn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
});

new aws.iam.RolePolicyAttachment("nodeGroupRolePolicyAttachment2", {
    role: nodeGroupRole,
    policyArn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
});

new aws.iam.RolePolicyAttachment("nodeGroupRolePolicyAttachment3", {
    role: nodeGroupRole,
    policyArn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
});

// Create an EKS cluster
export const cluster = new eks.Cluster(eksConfig.clusterName, {
    name: eksConfig.clusterName,
    vpcId: vpc.vpcId,
    version: eksConfig.version ? eksConfig.version : undefined,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    nodeAssociatePublicIpAddress: eksConfig.nodeAssociatePublicIpAddress ? eksConfig.nodeAssociatePublicIpAddress : undefined,
    skipDefaultNodeGroup: true,
    minSize: eksConfig.minSize,
    instanceRoles: [nodeGroupRole],
    clusterTags: {
        ...tags,
    },
    tags: {
        Name: eksConfig.clusterName,
        ...tags,
    },
});

// Deploy the Metrics Server
const metricsServer = new k8s.yaml.ConfigFile("metrics-server", {
    file: "https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.5.0/components.yaml",
}, { provider: cluster.provider });

// Export the cluster's kubeconfig
export const kubeconfig = cluster.kubeconfig;
export const provider = new k8s.Provider('k8s', {
    kubeconfig: cluster.kubeconfig.apply(JSON.stringify),
});