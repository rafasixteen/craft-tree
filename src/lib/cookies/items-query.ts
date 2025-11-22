import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const ItemsQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().default(16),
	search: z.string().max(32).default(''),
});

export type ItemsQueryParams = z.infer<typeof ItemsQuerySchema>;

const COOKIE_NAME = 'items_query_params';

/**
 * Reads the items query params from the cookie.
 * Returns defaults if cookie does not exist or is invalid.
 */
export async function readItemsQueryParams(): Promise<ItemsQueryParams>
{
	const cookiesStore = await cookies();
	const raw = cookiesStore.get(COOKIE_NAME)?.value;

	try
	{
		const parsed = raw ? JSON.parse(raw) : {};
		return ItemsQuerySchema.parse(parsed);
	}
	catch
	{
		return ItemsQuerySchema.parse({});
	}
}

/**
 * Writes items query params to the cookie.
 * Can be called from a Route Handler or Server Action.
 */
export async function saveItemsQueryParams(params: Partial<ItemsQueryParams>)
{
	const current = await readItemsQueryParams();

	const merged = { ...current, ...params };
	const parsed = ItemsQuerySchema.parse(merged);

	const res = NextResponse.json({ ok: true });

	res.cookies.set(COOKIE_NAME, JSON.stringify(parsed), {
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: false,
	});

	return res;
}
