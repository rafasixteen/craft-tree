import { CreateItemParams, UpdateItemParams } from '@lib/validation/item-schemas';
import { Uuid } from '../validation/common-schemas';

export async function getItems(page = 0)
{
	const res = await fetch(`/api/items?page=${page}`, {
		method: 'GET',
		cache: 'no-store',
	});

	if (!res.ok)
	{
		const message = (await res.json()) || res.statusText;
		throw new Error(`Failed to fetch items: ${message} (status: ${res.status})`);
	}

	return res.json();
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
