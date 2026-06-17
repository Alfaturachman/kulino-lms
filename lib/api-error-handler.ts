import { NextResponse } from 'next/server';
import { AppError, logError, serializeError } from '@/lib/errors';

type RouteHandler<T = unknown> = (
    request: Request,
    context: T,
) => Promise<Response | NextResponse> | Response | NextResponse;

export function withErrorHandler<T>(handler: RouteHandler<T>): RouteHandler<T> {
    return async (request: Request, context: T) => {
        try {
            return await handler(request, context);
        } catch (error) {
            logError(error, 'API');

            if (error instanceof AppError) {
                return NextResponse.json(serializeError(error), {
                    status: error.statusCode,
                });
            }

            const message =
                process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : error instanceof Error
                      ? error.message
                      : 'Unknown error';

            return NextResponse.json({ message }, { status: 500 });
        }
    };
}
