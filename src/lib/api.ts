import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.GRAPHQL_ENDPOINT!;
const client = new GraphQLClient(endpoint);

export async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T>
{
	return client.request<T>(query, variables);
}
