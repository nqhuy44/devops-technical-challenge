import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { vpcId } from "../vpc";
import { SecurityGroupConfig } from "../interface"
import { vpcConfig, tags } from "../config";

const securityGroupConfig = vpcConfig.securityGroups;

const securityGroupIds: pulumi.Output<string>[] = [];

try {
    securityGroupConfig.forEach((sg: SecurityGroupConfig) => {
        const securityGroup = new aws.ec2.SecurityGroup(sg.name, {
            name: sg.name,
            vpcId: vpcId,
            description: sg.description,
            ingress: sg.ingress.map((rule: any) => ({
                fromPort: rule.fromPort,
                toPort: rule.toPort,
                protocol: rule.protocol,
                cidrBlocks: [rule.cidrBlocks],
            })),
            egress: sg.egress.map((rule: any) => ({
                fromPort: rule.fromPort,
                toPort: rule.toPort,
                protocol: rule.protocol,
                cidrBlocks: [rule.cidrBlocks],
            })),
            tags: {
                Name: sg.name,
                ...tags,
            }
        });
        securityGroupIds.push(securityGroup.id);
    });
} catch (error) {
    console.error(`Failed to provision security groups: ${error}`);
}

const securityGroupIdsOutput = pulumi.all(securityGroupIds);
export { securityGroupIdsOutput };