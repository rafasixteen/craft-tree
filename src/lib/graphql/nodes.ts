import { Node, MutationCreateNodeArgs, MutationUpdateNodeArgs, MutationDeleteNodeArgs } from '@/graphql/generated/graphql';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

export async function getRootNodes<T extends keyof Node>(fields: T[], depth: number = 0): Promise<Pick<Node, T>[]>
{
	const maxDepth = 16;
	const minDepth = 0;

	if (depth < minDepth) depth = minDepth;
	if (depth > maxDepth) depth = maxDepth;

	const selection = buildDepthSelection(fields, depth);

	const query = `
		query RootNodes {
			rootNodes {
				${selection}
			}
		}
  	`;

	const response = await graphqlRequest<{ rootNodes: Pick<Node, T>[] }>(query);
	return response.rootNodes;

	function buildDepthSelection<T extends keyof Node>(fields: T[], depth: number): string
	{
		const base = fields.join('\n');

		if (depth <= 0) return base;

		return `
		${base}
			children {
				${buildDepthSelection(fields, depth - 1)}
			}
	`;
	}
}

export async function createNode<T extends keyof Node>(args: MutationCreateNodeArgs, fields: T[]): Promise<Pick<Node, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation CreateNode($data: CreateNodeInput!) {
			createNode(data: $data) {
				${selection}
			}	
		}
	`;

	const response = await graphqlRequest<{ createNode: Node }>(query, args);
	return response.createNode;
}

export async function updateNode<T extends keyof Node>(args: MutationUpdateNodeArgs, fields: T[]): Promise<Pick<Node, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation UpdateNode($id: ID!, $data: UpdateNodeInput!) {
			updateNode(id: $id, data: $data) {
				${selection}
			}
		}
	`;

	const response = await graphqlRequest<{ updateNode: Node }>(query, args);
	return response.updateNode;
}

export async function deleteNode<T extends keyof Node>(args: MutationDeleteNodeArgs, fields: T[]): Promise<Pick<Node, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation DeleteNode($id: ID!) {
			deleteNode(id: $id) {
				${selection}
			}
		}
	`;

	const response = await graphqlRequest<{ deleteNode: Node }>(query, args);
	return response.deleteNode;
}
