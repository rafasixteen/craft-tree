import { Item } from '@domain/item';

export interface Recipe
{
	id: string;
	name: string;
	slug: string | null;
	quantity: number;
	time: number;
	ingredients: Ingredient[];
}

export interface Ingredient
{
	id: string;
	item: Item;
	quantity: number;
}

export interface CreateRecipeInput
{
	name: string;
	itemId: string;
}

export interface CreateIngredientInput
{
	itemId: string;
	quantity: number;
}

export interface UpdateRecipeInput
{
	name?: string;
	quantity?: number;
	time?: number;
	ingredients?: CreateIngredientInput[];
}
