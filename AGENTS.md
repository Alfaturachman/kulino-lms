<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:global-error-handling -->

# Global Error Handling

The project uses a centralized error handling system (`lib/errors.ts`):

## Custom Error Classes

- `AppError` — base class (code, statusCode, digest)
- `NotFoundError` (404), `UnauthorizedError` (401), `ForbiddenError` (403), `ValidationError` (400), `ConfigurationError` (500)

## Utility Functions

- `getErrorMessage(error)` — safe message extraction
- `getErrorStatusCode(error)` — extracts HTTP status
- `logError(error, context?)` — structured console logging
- `serializeError(error)` — serializes to JSON for API responses
- `captureError(error, context?)` — logs + sends to Sentry if `NEXT_PUBLIC_SENTRY_DSN` is set

## Next.js Error Files

| File                                    | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `app/error.tsx`                         | Segment-level error boundary (uses `unstable_retry`) |
| `app/global-error.tsx`                  | Root layout error boundary (own `<html>`/`<body>`)   |
| `app/not-found.tsx`                     | 404 page                                             |
| `app/loading.tsx`                       | Root loading spinner                                 |
| `app/(protected)/loading.tsx`           | Protected layout loading                             |
| `app/(protected)/dashboard/loading.tsx` | Dashboard skeleton                                   |
| `app/(protected)/admin/loading.tsx`     | Admin skeleton                                       |
| `app/courses/loading.tsx`               | Courses skeleton                                     |
| `app/login/loading.tsx`                 | Login spinner                                        |

## API Route Error Handling

Use `withErrorHandler(handler)` from `lib/api-error-handler.ts` to wrap route handlers:

```ts
import { withErrorHandler } from '@/lib/api-error-handler';
export const GET = withErrorHandler(async (request, context) => { ... });
```

## Error Monitoring (Sentry)

- Configured via `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- Instrumentation in `instrumentation.ts` with `onRequestError`
- Set `NEXT_PUBLIC_SENTRY_DSN` in `.env.local` to activate
- `captureError()` auto-forwards to Sentry when DSN is present
    <!-- END:global-error-handling -->
