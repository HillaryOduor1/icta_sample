/*export {}; // marks module as having side effects
console.log('TELEMETRY FILE LOADED');
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

// Create the exporter
const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
});

// --- FIX: Pass spanProcessors directly to the constructor ---
// The deprecated addSpanProcessor method is removed or not typed.
// Use this new API format instead.
const provider = new WebTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)]
});

// Register the provider globally
provider.register();

// Instrument fetch/XHR
registerInstrumentations({
    instrumentations: [
        new FetchInstrumentation(),
        new XMLHttpRequestInstrumentation(),
    ],
});

console.log('Frontend OpenTelemetry initialized');*/