import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import { vpcConfig } from "../config";
import { tags } from "../config";

const vpc = new awsx.ec2.Vpc(vpcConfig.name, {
    cidrBlock: vpcConfig.cidrBlock,
    numberOfAvailabilityZones: Number(vpcConfig.numberOfAvailabilityZones),
    tags: {
        Name: vpcConfig.name,
        ...tags,
    },
    natGateways: {
        strategy: vpcConfig.natGateway.strategy,
    }
});

export const vpcId = vpc.vpcId;
export const privateSubnetIds = vpc.privateSubnetIds;
export const publicSubnetIds = vpc.publicSubnetIds;