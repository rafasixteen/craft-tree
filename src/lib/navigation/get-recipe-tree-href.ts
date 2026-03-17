import { Item } from '@/domain/item';
import { getItemHref } from './get-item-href';

export function getRecipeTreeHref(item: Item)
{
	return getItemHref(item) + '/recipe-tree';
}
