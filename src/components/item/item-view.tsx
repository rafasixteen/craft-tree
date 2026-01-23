'use client';

import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { RecipeTreeComponent } from '@/components/recipe-tree';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ingredient } from '@/domain/ingredient';

interface ItemViewProps
{
	item: Item;
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

export function ItemView({ item, allRecipes, allIngredients, allItems }: ItemViewProps)
{
	const hasRecipes = allRecipes.has(item.id) && (allRecipes.get(item.id)?.length || 0) > 0;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>{item.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{hasRecipes ? 'This item can be crafted using the recipes below.' : 'This item has no recipes.'}</p>
				</CardContent>
			</Card>

			{hasRecipes && <RecipeTreeComponent item={item} quantity={1} allRecipes={allRecipes} allIngredients={allIngredients} allItems={allItems} />}
		</div>
	);
}
