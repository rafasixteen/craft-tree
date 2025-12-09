import { MutationCreateRecipeArgs, MutationDeleteRecipeArgs, MutationUpdateRecipeArgs, Recipe } from '@generated/graphql/types';
import { graphqlRequest } from './api';
import { buildSelection } from './utils';

export async function createRecipe<T extends keyof Recipe>(args: MutationCreateRecipeArgs, fields: T[]): Promise<Pick<Recipe, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation CreateRecipe($data: CreateRecipeInput!) {
			createRecipe(data: $data) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ createRecipe: Recipe }>(query, args)).createRecipe;
}

export async function updateRecipe<T extends keyof Recipe>(args: MutationUpdateRecipeArgs, fields: T[]): Promise<Pick<Recipe, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation UpdateRecipe($id: ID!, $data: UpdateRecipeInput!) {
			updateRecipe(id: $id, data: $data) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ updateRecipe: Recipe }>(query, args)).updateRecipe;
}

export async function deleteRecipe<T extends keyof Recipe>(args: MutationDeleteRecipeArgs, fields: T[]): Promise<Pick<Recipe, T>>
{
	const selection = buildSelection(fields);

	const query = `
		mutation DeleteRecipe($id: ID!) {
			deleteRecipe(id: $id) {
				${selection}
			}
		}
	`;

	return (await graphqlRequest<{ deleteRecipe: Pick<Recipe, T> }>(query, args)).deleteRecipe;
}
