import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { cluster } from "../eks";

let webappAdminRole: aws.iam.Role;


// Create IAM groups
const webappAdminsGroup = new aws.iam.Group("webappAdmin");

// Create an IAM role
webappAdminRole = new aws.iam.Role("webappAdminRole", {
    name: "webappAdminRole",
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
    name: "webappAdminPolicy",
    policy: cluster.eksCluster.arn.apply(arn => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "eks:*",
                Resource: arn
            }
        ]
    }))
});

const eksAdminRolePolicyAttachment = new aws.iam.RolePolicyAttachment("eksAdminRolePolicyAttachment", {
    role: webappAdminRole.name,
    policyArn: webappAdminPolicy.arn,
});

// Create a policy that allows the group to assume the role
const webappAssumeRolePolicy = new aws.iam.Policy("webappAssumeRolePolicy", {
    name: "webappAssumeRolePolicy",
    policy: webappAdminRole.arn.apply(arn => JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Resource: arn
            }
        ]
    }))
});

// Attach the policy to the group
const groupPolicyAttachment = new aws.iam.GroupPolicyAttachment("groupPolicyAttachment", {
    group: webappAdminsGroup.name,
    policyArn: webappAssumeRolePolicy.arn
});

export { webappAdminRole };