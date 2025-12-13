import { Node, MutationCreateNodeArgs, MutationUpdateNodeArgs, MutationDeleteNodeArgs } from '@generated/graphql/types';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

export async function getRootNodes<T extends keyof Node>(fields: T[]): Promise<Pick<Node, T>[]>
{
	const selection = buildSelection(fields);

	const query = `
		query Query {
			rootNodes {
				${selection}
			}
		}
  	`;

	const response = await graphqlRequest<{ rootNodes: Pick<Node, T>[] }>(query);
	return response.rootNodes;
}

export async function getDescendantNodes(id: string): Promise<Node[]>
{
	const query = `
		query Query($id: ID!) {
			descendantNodes(id: $id) {
				id
				name
				type
				order
				parent {
					id
				}
				item {
					id
					name
				}
				recipe {
					id
				}
				children
			}
		}
  	`;

	const response = await graphqlRequest<{ descendantNodes: Node[] }>(query, { id });
	return response.descendantNodes;
}

export async function getNodes<T extends keyof Node>(fields: T[]): Promise<Pick<Node, T>[]>
{
	const selection = buildSelection(fields);

	const query = `
		query Query {
			nodes {
				${selection}
				children {
					id
				}
			}
		}
  	`;

	const response = await graphqlRequest<{ nodes: Pick<Node, T>[] }>(query);
	return response.nodes;
}

export async function getNode<T extends keyof Node>(id: string, fields: T[]): Promise<Pick<Node, T | 'id'>>
{
	const selection = buildSelection(fields);

	const query = `
		query Query($id: ID!) {
			node(id: $id) {
				${selection}
			}	
		}
	`;

	const response = await graphqlRequest<{ node: Node }>(query, { id });
	return response.node;
}

export async function createNode(args: MutationCreateNodeArgs): Promise<Node>
{
	const query = `
		mutation CreateNode($data: CreateNodeInput!) {
			createNode(data: $data) {
				id
				name
				type
				children
				parent {
					id
				}
				item {
					id
					name
				}
				recipe {
					id
				}
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
