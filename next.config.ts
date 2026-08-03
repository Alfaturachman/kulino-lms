import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

import path from 'path';

const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingRoot: path.join(__dirname),
};

const isProd = process.env.NODE_ENV === 'production';

export default isProd
    ? withSentryConfig(nextConfig, {
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          silent: true,
          widenClientFileUpload: false,
          telemetry: false,
      })
    : nextConfig;
