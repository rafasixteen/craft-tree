'use client';

import { useState } from 'react';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { RecipeTreeComponent, ProductionFlow } from '@/components/item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
	const [activeTab, setActiveTab] = useState('tree');
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

			{hasRecipes && (
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value="tree">Recipe Tree</TabsTrigger>
						<TabsTrigger value="production">Production</TabsTrigger>
					</TabsList>

					<TabsContent value="tree" className="space-y-6">
						<RecipeTreeComponent item={item} quantity={1} allRecipes={allRecipes} allIngredients={allIngredients} allItems={allItems} />
					</TabsContent>

					<TabsContent value="production" className="space-y-6">
						<ProductionFlow item={item} allRecipes={allRecipes} allIngredients={allIngredients} allItems={allItems} />
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
}
