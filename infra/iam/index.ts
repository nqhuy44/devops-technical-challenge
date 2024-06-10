import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import { cluster } from "../eks";
import * as roles from "../iam/iamRoles";

const oidcProvider = cluster.core.oidcProvider;

try {
    // Create a ServiceAccount
    const serviceAccount = new k8s.core.v1.ServiceAccount("admin-sa", {
        metadata: {
            name: "admin-sa",
            namespace: "kube-system",
            annotations: {
                "eks.amazonaws.com/role-arn": roles.webappAdminRole.arn,
            },
        },
    }, { provider: cluster.provider });

    // Create a ClusterRoleBinding to bind the ServiceAccount to the cluster-admin role
    const clusterRoleBinding = new k8s.rbac.v1.ClusterRoleBinding("adminClusterRoleBinding", {
        metadata: {
            name: "admin-crb",
        },
        subjects: [{
            kind: "ServiceAccount",
            name: "admin-sa",
            namespace: "kube-system",
        }],
        roleRef: {
            kind: "ClusterRole",
            name: "cluster-admin",
            apiGroup: "rbac.authorization.k8s.io",
        },
    }, { provider: cluster.provider });
} catch (error) {
    console.error(`Failed to provision the admin ServiceAccount: ${error}`);
}