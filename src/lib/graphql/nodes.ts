import { Node, MutationCreateNodeArgs, MutationUpdateNodeArgs, MutationDeleteNodeArgs } from '@generated/graphql/types';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

type NodeWithChildren<T extends keyof Node> = Pick<Node, T | 'id'> & {
	children: NodeWithChildren<T>[] | null;
};

export async function getRootNodes<T extends keyof Node>(fields: T[]): Promise<Pick<Node, T>[]>
{
	const selection = buildSelection(fields);

	const query = `
		query RootNodes {
			rootNodes {
				${selection}
			}
		}
  	`;

	const response = await graphqlRequest<{ rootNodes: Pick<Node, T>[] }>(query);
	return response.rootNodes;
}

export async function getNodeWithChildren<T extends keyof Node>(id: string, fields: T[]): Promise<NodeWithChildren<T>>
{
	const node = await getNode(id, fields);
	const children = await getNodeChildren(id, fields);

	const childrenWithSubtree: NodeWithChildren<T>[] | null = children.length > 0 ? await Promise.all(children.map((child) => getNodeWithChildren(child.id, fields))) : null;
	return { ...node, children: childrenWithSubtree };
}

export async function getNodeChildren<T extends keyof Node>(id: string, fields: T[]): Promise<Pick<Node, T | 'id'>[]>
{
	const selection = buildSelection(fields);

	const query = `
		query Query($id: ID!) {
			node(id: $id) {
				children {
					${selection}
				}
			}
		}
  	`;

	const response = await graphqlRequest<{ node: { children: Pick<Node, T | 'id'>[] } }>(query, { id });
	return response.node.children;
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
