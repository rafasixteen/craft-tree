import { QueryItemsArgs, QueryTotalItemsArgs, MutationUpdateItemArgs, CreateItemInput, MutationCreateItemArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';
import { Item } from '@prisma/client';

export async function getItems(args: QueryItemsArgs)
{
	const ITEMS_QUERY = `
		query Items($search: String!, $skip: Int!, $take: Int!) {
			items(search: $search, skip: $skip, take: $take) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ items: Item[] }>(ITEMS_QUERY, args)).items;
}

export async function getTotalItems(args: QueryTotalItemsArgs)
{
	const TOTAL_ITEMS_QUERY = `
		query TotalItems($search: String!) {
			totalItems(search: $search)
		}
	`;

	return (await graphqlRequest<{ totalItems: number }>(TOTAL_ITEMS_QUERY, args)).totalItems;
}

export async function createItem(args: MutationCreateItemArgs)
{
	const CREATE_ITEM = `
		mutation CreateItem($data: CreateItemInput!) {
			createItem(data: $data) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ createItem: Item }>(CREATE_ITEM, args)).createItem;
}

export async function updateItem(args: MutationUpdateItemArgs)
{
	const UPDATE_ITEM = `
		mutation UpdateItem($data: UpdateItemInput!) {
			updateItem(data: $data) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ updateItem: Item }>(UPDATE_ITEM, args)).updateItem;
}

export async function deleteItem(id: string)
{
	const DELETE_ITEM = `
		mutation DeleteItem($id: ID!) {
			deleteItem(id: $id) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ deleteItem: Item }>(DELETE_ITEM, { id })).deleteItem;
}
