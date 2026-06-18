import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import https from "https";

const endpoint = process.env.S3_END_POINT;
const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;

if (!endpoint) {
  throw new Error("S3_ENDPOINT is not defined");
}

if (!accessKeyId) {
  throw new Error("S3_ACCESS_KEY_ID is not defined");
}

if (!secretAccessKey) {
  throw new Error("S3_SECRET_ACCESS_KEY is not defined");
}

export const s3Client = new S3Client({
  region: "default",
  endpoint,
  forcePathStyle: true,
  maxAttempts: 1,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 10_000,
    socketTimeout: 30_000,
    httpsAgent: new https.Agent({
      keepAlive: true,
    }),
  }),
});
