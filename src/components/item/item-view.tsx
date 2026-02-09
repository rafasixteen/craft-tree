'use client';

import { Item } from '@/domain/item';
import { RecipeTreeProvider } from '@/domain/recipe-tree';
import { RecipeTreeFlow } from '@/components/recipe-tree';

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
