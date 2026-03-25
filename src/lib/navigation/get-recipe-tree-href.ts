import { Item } from '@/domain/item';

import { getItemHref } from './get-item-href';
import { Inventory } from '@/domain';

interface GetRecipeTreeHrefParams
{
	inventoryId: Inventory['id'];
	itemId: Item['id'];
}

export function getRecipeTreeHref({ inventoryId, itemId }: GetRecipeTreeHrefParams)
{
	return getItemHref({ inventoryId, itemId, path: ['recipe-tree'] });
}
