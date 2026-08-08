import { config } from '../config/env.js';

// Only initialize tracing in production or if OTLP endpoint is set
if (config.env === 'production' && config.otlpEndpoint !== 'http://localhost:4318/v1/traces') {
  const { NodeSDK } = await import('@opentelemetry/sdk-node');
  const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
  const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
  const resourcesModule = await import('@opentelemetry/resources');
  const { Resource } = resourcesModule;
  const semConvModule = await import('@opentelemetry/semantic-conventions');
  const { SemanticResourceAttributes } = semConvModule;

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'saas-backend',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
    }),
    traceExporter: new OTLPTraceExporter({ url: config.otlpEndpoint }),
    instrumentations: getNodeAutoInstrumentations(),
  });
  sdk.start();
  process.on('SIGTERM', () => sdk.shutdown().catch(console.error));
} else {
  console.log('OpenTelemetry tracing disabled in development');
}
