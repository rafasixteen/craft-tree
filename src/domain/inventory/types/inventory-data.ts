import { Collection } from '@/domain/collection';
import { Folder } from '@/domain/folder';
import { Item } from '@/domain/item';
import { Recipe } from '@/domain/recipe';

export interface InventoryData
{
	collection: Collection;
	items: Item[];
	recipes: Recipe[];
	folders: Folder[];
}
