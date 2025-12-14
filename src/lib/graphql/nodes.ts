import { Node, MutationCreateNodeArgs, MutationUpdateNodeArgs, MutationDeleteNodeArgs } from '@generated/graphql/types';
import { buildSelection, Selection, endpoint } from './utils';
import { request, gql } from 'graphql-request';

export async function getNode(id: string, selection: Selection)
{
	const query = gql`
		query Node($id: ID!) {
			node(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ node: Node }>(endpoint, query, { id });
	return response.node;
}

export async function getNodes(selection: Selection)
{
	const query = gql`
		query Nodes {
			nodes {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ nodes: Node[] }>(endpoint, query);
	return response.nodes;
}

export async function getRootNodes(selection: Selection)
{
	const query = gql`
		query Query {
			rootNodes {
				${buildSelection(selection)}
			}
		}
  	`;

	const response = await request<{ rootNodes: Node[] }>(endpoint, query);
	return response.rootNodes;
}

export async function getDescendantNodes(id: string, selection: Selection)
{
	const query = gql`
		query Query($id: ID!) {
			descendantNodes(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ descendantNodes: Node[] }>(endpoint, query, { id });
	return response.descendantNodes;
}

export async function createNode(args: MutationCreateNodeArgs, selection: Selection)
{
	const query = gql`
		mutation CreateNode($data: CreateNodeInput!) {
			createNode(data: $data) {
				${buildSelection(selection)}
			}	
		}
	`;

	const response = await request<{ createNode: Node }>(endpoint, query, { data: args.data });
	return response.createNode;
}

export async function updateNode(args: MutationUpdateNodeArgs, selection: Selection)
{
	const query = gql`
		mutation UpdateNode($id: ID!, $data: UpdateNodeInput!) {
			updateNode(id: $id, data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ updateNode: Node }>(endpoint, query, { id: args.id, data: args.data });
	return response.updateNode;
}

export async function deleteNode(args: MutationDeleteNodeArgs, selection: Selection)
{
	const query = gql`
		mutation DeleteNode($id: ID!) {
			deleteNode(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ deleteNode: Node }>(endpoint, query, { id: args.id });
	return response.deleteNode;
}
