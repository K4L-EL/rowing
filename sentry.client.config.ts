import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.25,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
