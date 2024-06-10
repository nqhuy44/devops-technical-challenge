export interface SecurityGroupConfig {
    name: string;
    description: string;
    ingress: Array<{
        fromPort: number;
        toPort: number;
        protocol: string;
        cidrBlocks: string;
    }>;
    egress: Array<{
        fromPort: number;
        toPort: number;
        protocol: string;
        cidrBlocks: string;
    }>;
}

interface SubnetConfig {
    type: string;
    cidrMask: Number;
    name: string;
}

export interface NodeConfig {
    name: string;
    amiId: string;
    instanceType: string;
    desiredCapacity: number;
    nodeRootVolumeSize: number;
    minSize: number;
    maxSize: number;
    spotPrice: string;
    taints: { key: string; value: string; effect: string }[];
    tags: { [key: string]: string }[];
}