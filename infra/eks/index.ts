import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes"; 
import * as vpc from "../vpc";
import { eksConfig, tags } from "../config";
// 
// Create an EKS cluster
export const cluster = new eks.Cluster(eksConfig.clusterName, {
    vpcId: vpc.vpcId,
    publicSubnetIds: vpc.publicSubnetIds,
    privateSubnetIds: vpc.privateSubnetIds,
    nodeAssociatePublicIpAddress: eksConfig.nodeAssociatePublicIpAddress,
    skipDefaultNodeGroup: true,
    clusterTags: {
        ...tags,
    },
    tags: {
        ...tags,
    },
});

// Export the cluster's kubeconfig
export const kubeconfig = cluster.kubeconfig;
export const provider = new k8s.Provider('k8s', {
    kubeconfig: cluster.kubeconfig.apply(JSON.stringify),
});





// // Construct the OIDC provider URL
// const oidcProviderUrl = pulumi.interpolate`https://oidc.eks.${aws.config.region}.amazonaws.com/id/${cluster.eksCluster.name}`;

// // Create IAM role for EKS Admin
// const eksAdminRole = new aws.iam.Role("eksAdminRole", {
//     assumeRolePolicy: JSON.stringify({
//         Version: "2012-10-17",
//         Statement: [{
//             Action: "sts:AssumeRole",
//             Effect: "Allow",
//             Principal: { AWS: pulumi.output(aws.getCallerIdentity()).accountId },
//         }],
//     }),
// });

// const eksAdminPolicyAttachment = new aws.iam.RolePolicyAttachment("eksAdminPolicyAttachment", {
//     role: eksAdminRole.name,
//     policyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
// });

// const eksAdminServicePolicyAttachment = new aws.iam.RolePolicyAttachment("eksAdminServicePolicyAttachment", {
//     role: eksAdminRole.name,
//     policyArn: "arn:aws:iam::aws:policy/AmazonEKSServicePolicy",
// });

// // Map IAM role to Kubernetes RBAC
// const awsAuthConfigMap = new k8s.core.v1.ConfigMap("aws-auth", {
//     metadata: { 
//         name: "aws-auth", 
//         namespace: "kube-system",
//     },
//     data: {
//         mapRoles: JSON.stringify([{
//             rolearn: eksAdminRole.arn,
//             username: "admin",
//             groups: ["system:masters"],
//         }]),
//     },
// });
