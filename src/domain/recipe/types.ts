export interface CreateRecipeInput
{
	name: string;
	itemId: string;
}

export interface IngredientInput
{
	itemId: string;
	quantity: number;
}

export interface UpdateRecipeInput
{
	name?: string;
	quantity?: number;
	time?: number;
	ingredients?: IngredientInput[];
}
