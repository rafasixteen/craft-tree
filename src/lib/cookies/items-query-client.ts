import { ItemsQueryParams } from '@/lib/cookies/items-query';

/**
 * Updates the items query cookie via the Route Handler.
 * @param params Partial page / limit / search
 */
export async function setItemsQueryParams(params: Partial<ItemsQueryParams>): Promise<{ ok: true }>
{
	const res = await fetch('/api/items-query', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	});

	if (!res.ok)
	{
		throw new Error('Failed to update items query cookie');
	}

	return res.json();
}

/**
 * Convenience: set page
 */
export async function setPage(page: number)
{
	return setItemsQueryParams({ page });
}

/**
 * Convenience: set limit
 */
export async function setLimit(limit: number)
{
	return setItemsQueryParams({ limit });
}

/**
 * Convenience: set search term
 */
export async function setSearch(search: string)
{
	return setItemsQueryParams({ search, page: 1 });
}
