import { metrics } from '@opentelemetry/api';
import { MeterProvider, PeriodicExportingMetricReader} from '@opentelemetry/sdk-metrics';
//import { Resource } from '@opentelemetry/resources';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import pkga from '@opentelemetry/semantic-conventions';
const { ATTRS_SERVICE_NAME } = pkga;
import pkgb from '@opentelemetry/resources';
const { Resource } = pkgb;

const resource = Resource.default().merge(
  new Resource({
    [ATTRS_SERVICE_NAME]: 'order-service'
  }),
);metrics

const otlpMetricsExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318/v1/metrics'
});


const metricReader = new PeriodicExportingMetricReader({
  exporter: otlpMetricsExporter,

  // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
  exportIntervalMillis: 10000,
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
  readers: [metricReader],
});

// Set this MeterProvider to be global to the app being instrumented.
metrics.setGlobalMeterProvider(myServiceMeterProvider);
