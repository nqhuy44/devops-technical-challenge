import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { cluster } from "../eks";

let webappAdminRole: aws.iam.Role;

try {
    // Create IAM groups
    const webappAdminsGroup = new aws.iam.Group("webappAdmin");

    // Create an IAM role
    webappAdminRole = new aws.iam.Role("webappAdminRole", {
        assumeRolePolicy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        Service: "eks.amazonaws.com"
                    },
                    Action: "sts:AssumeRole"
                }
            ]
        })
    });

    // Attach a policy to the role
    const webappAdminPolicy = new aws.iam.Policy("webappAdminPolicy", {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: "eks:ManageCluster",
                    Resource: cluster.eksCluster.arn
                }
            ]
        })
    });

    const eksAdminRolePolicyAttachment = new aws.iam.RolePolicyAttachment("eksAdminRolePolicyAttachment", {
        role: webappAdminRole.name,
        policyArn: webappAdminPolicy.arn,
    });

    // Create a policy that allows the group to assume the role
    const webappAssumeRolePolicy = new aws.iam.Policy("webappAssumeRolePolicy", {
        policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: "sts:AssumeRole",
                    Resource: webappAdminRole.arn
                }
            ]
        })
    });

    // Attach the policy to the group
    const groupPolicyAttachment = new aws.iam.GroupPolicyAttachment("groupPolicyAttachment", {
        group: webappAdminsGroup.name,
        policyArn: webappAssumeRolePolicy.arn
    });
} catch (error) {
    console.error(`Failed to provision IAM roles: ${error}`);
}

export { webappAdminRole };