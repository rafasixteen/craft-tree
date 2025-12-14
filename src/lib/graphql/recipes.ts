import { MutationCreateRecipeArgs, MutationDeleteRecipeArgs, MutationUpdateRecipeArgs, Recipe } from '@generated/graphql/types';
import { buildSelection, Selection, endpoint } from './utils';
import { request, gql } from 'graphql-request';

export async function createRecipe(args: MutationCreateRecipeArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($data: CreateRecipeInput!) {
			createRecipe(data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ createRecipe: Recipe }>(endpoint, query, { data: args.data });
	return response.createRecipe;
}

export async function updateRecipe(args: MutationUpdateRecipeArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!, $data: UpdateRecipeInput!) {
			updateRecipe(id: $id, data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ updateRecipe: Recipe }>(endpoint, query, { id: args.id, data: args.data });
	return response.updateRecipe;
}

export async function deleteRecipe(args: MutationDeleteRecipeArgs, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!) {
			deleteRecipe(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ deleteRecipe: Recipe }>(endpoint, query, { id: args.id });
	return response.deleteRecipe;
}
