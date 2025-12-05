import { CreateNodeInput, Node, MutationCreateNodeArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';

export async function getRootNodes()
{
	const query = `
		query RootNodes {
			rootNodes {
				id
				name
				type
				resourceId
				parentId
				order
			}
		}
  `;

	const response = await graphqlRequest<{ rootNodes: Node[] }>(query);
	return response.rootNodes;
}

export async function createNode(args: MutationCreateNodeArgs)
{
	const query = `
		mutation CreateNode($data: CreateNodeInput!) {
			createNode(data: $data) {
				id
				name
				type
				resourceId
				parentId
				order
			}	
		}
	`;

	const response = await graphqlRequest<{ node: Node }>(query, args);
	return response.node;
}
