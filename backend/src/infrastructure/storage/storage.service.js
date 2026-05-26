import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../../config/env.js';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const storageService = {
  async upload(file, tenantId) {
    const key = `${tenantId}/${randomUUID()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3Client.send(command);
    const url = `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
    return { key, url };
  },

  async delete(key) {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
    });
    await s3Client.send(command);
  },
};