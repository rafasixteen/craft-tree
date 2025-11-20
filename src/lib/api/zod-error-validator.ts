import { NextResponse } from 'next/server';
import { ErrorHandler, registerErrorHandler } from '@/lib/api/handle-error';

const zodErrorHandler: ErrorHandler = (err: any) =>
{
	if (err.name !== 'ZodError') return undefined;

	return NextResponse.json(
		{
			error: {
				name: 'ValidationError',
				message: err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; '),
			},
		},
		{ status: 400 },
	);
};

registerErrorHandler(zodErrorHandler);
