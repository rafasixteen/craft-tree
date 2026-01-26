'use client';

import { useState } from 'react';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ingredient } from '@/domain/ingredient';
import { ProductionFlowReact } from '@/components/item/production-tree';
import { RecipeTreeFlow } from '@/components/item/recipe-tree';
import { RecipeTreeFlowV2 } from '@/components/item/recipe-tree-v2';

type ItemViewTabs = 'recipe-tree' | 'production-tree' | 'test-flow';

interface ItemViewProps
{
	item: Item;
	allRecipes: Map<string, Recipe[]>;
	allIngredients: Map<string, Ingredient[]>;
	allItems: Map<string, Item>;
}

export function ItemView({ item, allRecipes, allIngredients, allItems }: ItemViewProps)
{
	const [tab, setTab] = useState<ItemViewTabs>('test-flow');

	return (
		<Tabs className="h-full" value={tab} onValueChange={(value) => setTab(value as ItemViewTabs)}>
			<div className="flex items-center border-b px-1.75">
				<TabsList variant="line">
					<TabsTrigger value="recipe-tree">Recipe Tree</TabsTrigger>
					<TabsTrigger value="production-tree">Production</TabsTrigger>
					<TabsTrigger value="test-flow">Test Flow</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="recipe-tree" className="h-full">
				<RecipeTreeFlow item={item} quantity={1} allRecipes={allRecipes} allIngredients={allIngredients} allItems={allItems} />
			</TabsContent>

			<TabsContent value="production-tree" className="h-full">
				<ProductionFlowReact item={item} allRecipes={allRecipes} allIngredients={allIngredients} allItems={allItems} />
			</TabsContent>

			<TabsContent value="test-flow" className="h-full">
				<RecipeTreeFlowV2 item={item} />
			</TabsContent>
		</Tabs>
	);
}
