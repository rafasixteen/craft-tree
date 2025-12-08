import { GraphQLClient } from 'graphql-request';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.GRAPHQL_ENDPOINT;

const client = new GraphQLClient(`${baseUrl}/api/graphql`);

export async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T>
{
	return client.request<T>(query, variables);
}
