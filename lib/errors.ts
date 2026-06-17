export class AppError extends Error {
    constructor(
        message: string,
        public code: string = 'INTERNAL_ERROR',
        public statusCode: number = 500,
        public digest?: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', digest?: string) {
        super(message, 'NOT_FOUND', 404, digest);
        this.name = 'NotFoundError';
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', digest?: string) {
        super(message, 'UNAUTHORIZED', 401, digest);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', digest?: string) {
        super(message, 'FORBIDDEN', 403, digest);
        this.name = 'ForbiddenError';
    }
}

export class ValidationError extends AppError {
    constructor(
        message = 'Validation failed',
        public details?: unknown,
        digest?: string,
    ) {
        super(message, 'VALIDATION_ERROR', 400, digest);
        this.name = 'ValidationError';
    }
}

export class ConfigurationError extends AppError {
    constructor(message = 'Configuration error', digest?: string) {
        super(message, 'CONFIGURATION_ERROR', 500, digest);
        this.name = 'ConfigurationError';
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof AppError) return error.message;
    if (error instanceof Error) return error.message;
    return 'An unexpected error occurred';
}

export function getErrorStatusCode(error: unknown): number {
    if (error instanceof AppError) return error.statusCode;
    return 500;
}

export function logError(error: unknown, context?: string): void {
    const prefix = context ? `[${context}]` : '';
    if (error instanceof AppError) {
        console.error(
            `${prefix} [${error.code}] ${error.message}`,
            error.digest ?? '',
        );
    } else if (error instanceof Error) {
        console.error(`${prefix} ${error.message}`, error.stack);
    } else {
        console.error(`${prefix} Unknown error`, error);
    }
}

export function serializeError(error: unknown): Record<string, unknown> {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            ...(error instanceof ValidationError && error.details
                ? { details: error.details }
                : {}),
        };
    }
    if (error instanceof Error) {
        return { message: error.message };
    }
    return { message: 'An unexpected error occurred' };
}

export function captureError(
    error: unknown,
    context?: Record<string, unknown>,
): void {
    logError(error, context?.source as string);

    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const Sentry = require('@sentry/nextjs');
            if (error instanceof Error) {
                Sentry.captureException(error, { extra: context });
            } else {
                Sentry.captureException(new Error(String(error)), {
                    extra: context,
                });
            }
        } catch {
            // Sentry not available
        }
    }
}
