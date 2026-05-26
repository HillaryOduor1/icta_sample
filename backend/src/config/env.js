import dotenv from 'dotenv';
import joi from 'joi';

dotenv.config();

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(5000),
  MONGODB_URI: joi.string().required(),
  TENANT_NAME: joi.string().default('icta_sample'),
  REDIS_URL: joi.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: joi.string().required(),
  JWT_REFRESH_SECRET: joi.string().required(),
  GOOGLE_CLIENT_ID: joi.string().required(),
  GOOGLE_CLIENT_SECRET: joi.string().required(),
  GOOGLE_CALLBACK_URL: joi.string().uri().required(),
  MASTER_GOOGLE_CALLBACK_URL: joi.string().uri().required(),
  FRONTEND_URL: joi.string().uri().required(),
  SMTP_HOST: joi.string().default('smtp.gmail.com'),  // Made optional with default
  SMTP_PORT: joi.number().default(587),
  SMTP_SECURE: joi.boolean().default(false),
  SMTP_USER: joi.string().default(''),  // Made optional
  SMTP_PASS: joi.string().default(''),  // Made optional
  SMTP_FROM: joi.string().email().default('noreply@example.com'),  // Made optional
  AWS_ACCESS_KEY_ID: joi.string().optional(),  // Made optional
  AWS_SECRET_ACCESS_KEY: joi.string().optional(),  // Made optional
  AWS_REGION: joi.string().default('us-east-1'),
  AWS_S3_BUCKET: joi.string().optional(),  // Made optional
  OTLP_ENDPOINT: joi.string().uri().default('http://localhost:4318/v1/traces'),
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);
if (error) {
  console.error('Config validation error:', error.message);
  console.error('Missing or invalid environment variables');
  // Don't throw in production, use defaults
  if (process.env.NODE_ENV === 'production') {
    console.warn('Using defaults for missing variables');
  } else {
    throw new Error(`Config validation error: ${error.message}`);
  }
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongodbUri: envVars.MONGODB_URI,
  defaultTenantDbName: envVars.TENANT_NAME,
  redisUrl: envVars.REDIS_URL,
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExpiry: '15m',
    refreshExpiry: '7d',
  },
  google: {
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
    masterCallbackUrl: envVars.MASTER_GOOGLE_CALLBACK_URL,
  },
  frontendUrl: envVars.FRONTEND_URL,
  email: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    secure: envVars.SMTP_SECURE,
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
    from: envVars.SMTP_FROM,
  },
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    bucket: envVars.AWS_S3_BUCKET,
  },
  otlpEndpoint: envVars.OTLP_ENDPOINT,
  
  express: {
    jsonLimit: process.env.NODE_ENV === 'production' ? '2mb' : '10mb',
    compressionLevel: process.env.NODE_ENV === 'production' ? 6 : 1,
  },
};
