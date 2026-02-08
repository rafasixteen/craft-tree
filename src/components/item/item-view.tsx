'use client';

import { Item } from '@/domain/item';
import { RecipeTreeProvider } from '@/domain/recipe-tree';
import { RecipeTreeFlow } from '@/components/recipe-tree';

import { RecipeTreeProvider as RecipeTreeProviderOld } from './recipe-tree';
import { RecipeTreeFlow as RecipeTreeFlowOld } from './recipe-tree';

interface ItemViewProps
{
	itemId: Item['id'];
}

export function ItemView({ itemId }: ItemViewProps)
{
	const showOld = false;

	if (showOld)
	{
		return (
			<RecipeTreeProviderOld itemId={itemId}>
				<RecipeTreeFlowOld />
			</RecipeTreeProviderOld>
		);
	}
	else
	{
		return (
			<RecipeTreeProvider itemId={itemId}>
				<RecipeTreeFlow />
			</RecipeTreeProvider>
		);
	}
}
