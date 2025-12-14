import { MutationUpdateItemArgs, MutationCreateItemArgs, Item, MutationDeleteItemArgs } from '@generated/graphql/types';
import { buildSelection, Selection, endpoint } from './utils';
import { gql, request } from 'graphql-request';

export async function getItem(id: string, selection: Selection)
{
	const query = gql`
		query Item($id: ID!) {
			item(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ item: Item }>(endpoint, query, { id });
	return response.item;
}

export async function createItem(args: MutationCreateItemArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($data: CreateItemInput!) {
			createItem(data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ createItem: Item }>(endpoint, query, args);
	return response.createItem;
}

export async function updateItem(args: MutationUpdateItemArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!, $data: UpdateItemInput!) {
			updateItem(id: $id, data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ updateItem: Item }>(endpoint, query, args);
	return response.updateItem;
}

export async function deleteItem(args: MutationDeleteItemArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!) {
			deleteItem(id: $id) {
				${buildSelection(selection)}
			}
		}
  	`;

	const response = await request<{ deleteItem: Item }>(endpoint, query, args);
	return response.deleteItem;
}
