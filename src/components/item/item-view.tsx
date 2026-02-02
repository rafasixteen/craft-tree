'use client';

import { useState } from 'react';
import { Item } from '@/domain/item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeTreeFlow } from '@/components/item/recipe-tree';

type ItemViewTabs = 'recipe-tree';

interface ItemViewProps
{
	item: Item;
}

export function ItemView({ item }: ItemViewProps)
{
	const [tab, setTab] = useState<ItemViewTabs>('recipe-tree');

	return (
		<Tabs className="h-full" value={tab} onValueChange={(value) => setTab(value as ItemViewTabs)}>
			<div className="flex items-center border-b px-1.75">
				<TabsList variant="line">
					<TabsTrigger value="recipe-tree">Recipe Tree</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="recipe-tree" className="h-full">
				<RecipeTreeFlow item={item} />
			</TabsContent>
		</Tabs>
	);
}
