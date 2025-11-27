import { Item, QueryItemsArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';

interface ItemsQueryResponse
{
	items: Item[];
}

export async function getItems(params: { page: number; pageSize: number; search?: string })
{
	const { search, page, pageSize } = params;

	const variables: QueryItemsArgs = {
		search,
		skip: (page - 1) * pageSize,
		take: pageSize,
	};

	const ITEMS_QUERY = `
		query Items( $skip: Int!, $take: Int!, $search: String) {
			items(skip: $skip, take: $take,search: $search) {
				id
				name
			}
		}
	`;

	return await graphqlRequest<ItemsQueryResponse>(ITEMS_QUERY, variables);
}
