import { MutationUpdateItemArgs, MutationCreateItemArgs, Item, MutationDeleteItemArgs } from '@generated/graphql/types';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

export async function getItem<T extends keyof Item>(id: string, fields: T[]): Promise<Pick<Item, T>>
{
	const selection = buildSelection(fields);

	const query = `
		query Item($id: ID!) {
			item(id: $id) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ item: Item }>(query, { id })).item;
}

export async function createItem<T extends keyof Item>(args: MutationCreateItemArgs, fields: T[]): Promise<Pick<Item, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation CreateItem($data: CreateItemInput!) {
			createItem(data: $data) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ createItem: Item }>(query, args)).createItem;
}

export async function updateItem<T extends keyof Item>(args: MutationUpdateItemArgs, fields: T[]): Promise<Pick<Item, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation UpdateItem($id: ID!, $data: UpdateItemInput!) {
			updateItem(id: $id, data: $data) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ updateItem: Item }>(query, args)).updateItem;
}

export async function deleteItem<T extends keyof Item>(args: MutationDeleteItemArgs, fields: T[]): Promise<Pick<Item, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation DeleteItem($id: ID!) {
			deleteItem(id: $id) {
				${selection}
			}
		}
  	`;

	return (await graphqlRequest<{ deleteItem: Pick<Item, T> }>(query, args)).deleteItem;
}
