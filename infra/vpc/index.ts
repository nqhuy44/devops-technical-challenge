import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { vpcConfig } from "../config";
import { tags } from "../config";
import { SubnetConfig } from "../interface";

let vpcId: pulumi.Output<string> | undefined;
let privateSubnetIds: pulumi.Output<string[]> | undefined;
let publicSubnetIds: pulumi.Output<string[]> | undefined;

try {
    const subnetConfig = vpcConfig.subnets;
    const vpc = new awsx.ec2.Vpc(vpcConfig.name, {
        cidrBlock: vpcConfig.cidrBlock,
        numberOfAvailabilityZones: Number(vpcConfig.numberOfAvailabilityZones),
        subnetSpecs: subnetConfig ? subnetConfig.map((subnet: SubnetConfig) => ({
            type: subnet.type,
            cidrMask: subnet.cidrMask,
            name: subnet.name,
            tags: {
                Name: subnet.name,
            },
        })) : undefined,
        tags: {
            Name: vpcConfig.name,
            ...tags,
        },
        natGateways: vpcConfig.natGateway ? {
            strategy: vpcConfig.natGateway.strategy,
        } : undefined,
    });

    vpcId = vpc.vpcId;
    privateSubnetIds = vpc.privateSubnetIds;
    publicSubnetIds = vpc.publicSubnetIds;
} catch (error) {
    console.error(`Failed to provision VPC: ${error}`);
}

export { vpcId, privateSubnetIds, publicSubnetIds };