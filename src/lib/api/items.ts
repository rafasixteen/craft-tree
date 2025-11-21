import { Uuid } from '../validation/common-schemas';
import { CreateItemParams, Item, UpdateItemParams } from '@lib/types/item';
import { getOrigin } from './get-origin';

export async function getItems(page = 1, search = ''): Promise<{ items: Item[]; hasNext: boolean }>
{
	const origin = await getOrigin();
	const safePage = Math.max(1, Math.floor(page));

	const res = await fetch(`${origin}/api/items?page=${safePage}&search=${encodeURIComponent(search)}`, {
		method: 'GET',
		cache: 'no-store',
	});

	const json = await res.json();

	if (!res.ok)
	{
		throw json;
	}

	return json;
}

export async function createItem(params: CreateItemParams)
{
	const res = await fetch('/api/items', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	});

	if (!res.ok)
	{
		const message = (await res.json()) || res.statusText;
		throw new Error(`Failed to create item: ${message} (status: ${res.status})`);
	}

	return res.json();
}

export async function updateItem(id: string, params: UpdateItemParams)
{
	const res = await fetch(`/api/items/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(params),
	});

	if (!res.ok)
	{
		const message = (await res.json()) || res.statusText;
		throw new Error(`Failed to update item: ${message} (status: ${res.status})`);
	}

	return res.json();
}

export async function deleteItem(id: Uuid)
{
	const res = await fetch(`/api/items/${id}`, {
		method: 'DELETE',
	});

	if (!res.ok)
	{
		const message = (await res.json()) || res.statusText;
		throw new Error(`Failed to delete item: ${message} (status: ${res.status})`);
	}

	return res.json();
}
