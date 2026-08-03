import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

import path from 'path';

const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname),
};

export default withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: process.env.NODE_ENV !== 'production',
    widenClientFileUpload: true,
    telemetry: false,
});
