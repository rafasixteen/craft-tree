'use server';

import { headers } from 'next/headers';

/**
 * Returns the absolute origin (protocol + host) for the current request.
 * Works both locally and in production.
 */
export async function getOrigin(): Promise<string>
{
	const headersList = await headers();
	const host = headersList.get('host') ?? 'localhost:3000';
	const protocol = headersList.get('x-forwarded-proto') ?? 'http';

	return `${protocol}://${host}`;
}
