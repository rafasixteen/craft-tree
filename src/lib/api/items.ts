import { CreateItemParams } from '@lib/validation/item-schemas';

export async function createItem(params: CreateItemParams)
{
	const res = await fetch('/api/items', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	});

	if (!res.ok)
	{
		throw new Error('Failed to create item');
	}

	return res.json();
}

export async function getItems(page = 1)
{
	const res = await fetch(`/api/items?page=${page}`);

	if (!res.ok)
	{
		throw new Error('Failed to fetch items');
	}

	return res.json();
}
