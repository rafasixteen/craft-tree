'use client';

import { Item } from '@/domain/item';
import { RecipeTreeFlow, RecipeTreeProvider } from '@/components/item/recipe-tree';

interface ItemViewProps
{
	itemId: Item['id'];
}

export function ItemView({ itemId }: ItemViewProps)
{
	return (
		<RecipeTreeProvider itemId={itemId}>
			<RecipeTreeFlow />
		</RecipeTreeProvider>
	);
}
