import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { vpcConfig } from "../config";
import { tags } from "../config";
import { SubnetConfig } from "../interface";

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

export const vpcId = vpc.vpcId;
export const privateSubnetIds = vpc.privateSubnetIds;
export const publicSubnetIds = vpc.publicSubnetIds;