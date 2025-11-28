import { QueryItemsArgs, QueryTotalItemsArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';
import { Item } from '@prisma/client';

export async function getItems(params: { page: number; pageSize: number; search?: string })
{
	const { search, page, pageSize } = params;

	const variables: QueryItemsArgs = {
		search,
		skip: (page - 1) * pageSize,
		take: pageSize,
	};

	const ITEMS_QUERY = `
		query Items($search: String!, $skip: Int!, $take: Int!) {
			items(search: $search, skip: $skip, take: $take) {
				id
				name
			}
		}
	`;

	return (await graphqlRequest<{ items: Item[] }>(ITEMS_QUERY, variables)).items;
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
