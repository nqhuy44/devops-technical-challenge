import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const tagConfig = config.requireObject<{ key: string, value: string }[]>("tags");

export const vpcConfig = config.requireObject<any>("vpc");
export const eksConfig = config.requireObject<any>("eks");
export const nodeGroupConfig = config.requireObject<any>("nodeGroup");

export const tags = tagConfig && tagConfig.length > 0 ? Object.fromEntries(tagConfig.map(tag => [tag.key, tag.value])) : {};