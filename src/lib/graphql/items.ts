import { QueryItemsArgs, MutationUpdateItemArgs, MutationCreateItemArgs, Item, MutationDeleteItemArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

export async function getItems(args: QueryItemsArgs)
{
	const query = `
		query Items($search: String!, $skip: Int!, $take: Int!) {
			items(search: $search, skip: $skip, take: $take) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ items: Item[] }>(query, args)).items;
}

export async function getItemById(id: string)
{
	const query = `
		query ItemById($id: ID!) {
			itemById(id: $id) {
				id
				name
				recipes {
					id
					item {
						id
						name
					}
					quantity
					time
					ingredients {
						id
						item {
							id 
							name
						}
						quantity
					}
				}
			}
		}
	`;

	return (await graphqlRequest<{ itemById: Item }>(query, { id })).itemById;
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
