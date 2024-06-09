import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { provider } from "../eks";
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const customValues = yaml.load(fs.readFileSync(`${__dirname}/helm/${pulumi.getStack()}/postgres.yaml`, 'utf8')) as pulumi.Inputs;
const postgres = new k8s.helm.v3.Chart("postgresql", {
    chart: "postgresql",
    fetchOpts: {
        repo: "https://charts.bitnami.com/bitnami",
    },
    values: customValues,
    namespace: "postgresql",
}, { provider });

