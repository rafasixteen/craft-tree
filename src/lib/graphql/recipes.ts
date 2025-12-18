import { CreateRecipeInput, MutationCreateRecipeArgs, MutationDeleteRecipeArgs, MutationUpdateRecipeArgs, Recipe, UpdateRecipeInput } from '@generated/graphql/types';
import { buildSelection, Selection, endpoint } from './utils';
import { request, gql } from 'graphql-request';

export async function getRecipeById(id: string, selection: Selection)
{
	const query = gql`
		query Recipe($id: ID!) {
			recipeById(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ recipeById: Recipe }>(endpoint, query, { id });
	return response.recipeById;
}

export async function getRecipeBySlug(slug: string, selection: Selection)
{
	const query = gql`
		query Recipe($slug: String!) {
			recipeBySlug(slug: $slug) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ recipeBySlug: Recipe }>(endpoint, query, { slug });
	return response.recipeBySlug;
}

export async function createRecipe(data: CreateRecipeInput, selection: Selection)
{
	const query = gql`
		mutation Mutation($data: CreateRecipeInput!) {
			createRecipe(data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ createRecipe: Recipe }>(endpoint, query, { data });
	return response.createRecipe;
}

export async function updateRecipe(id: string, data: UpdateRecipeInput, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!, $data: UpdateRecipeInput!) {
			updateRecipe(id: $id, data: $data) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ updateRecipe: Recipe }>(endpoint, query, { id, data });
	return response.updateRecipe;
}

export async function deleteRecipe(id: string, selection: Selection)
{
	const query = gql`
		mutation Mutation($id: ID!) {
			deleteRecipe(id: $id) {
				${buildSelection(selection)}
			}
		}
	`;

	const response = await request<{ deleteRecipe: Recipe }>(endpoint, query, { id });
	return response.deleteRecipe;
}
