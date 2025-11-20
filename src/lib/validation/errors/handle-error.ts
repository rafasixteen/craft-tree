import { NextResponse } from 'next/server';

export type ErrorHandler = (err: any) => NextResponse | undefined;

const errorHandlers: ErrorHandler[] = [];

export function registerErrorHandler(handler: ErrorHandler)
{
	errorHandlers.push(handler);
}

export function handleError(err: any)
{
	console.error(err);

	for (const handler of errorHandlers)
	{
		const response = handler(err);
		if (response) return response;
	}

	return NextResponse.json(
		{
			error: {
				name: err.name ?? 'InternalServerError',
				message: err.message ?? 'An unexpected error occurred',
			},
		},
		{ status: err.status ?? 500 },
	);
}
