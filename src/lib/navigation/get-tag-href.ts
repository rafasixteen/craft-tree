import { Inventory } from '@/domain/inventory';
import { Tag } from '@/domain/tag';
import { getInventoryHref } from '@/lib/navigation';

interface GetTagHrefParams
{
	inventoryId: Inventory['id'];
	tagId: Tag['id'];
	path?: string[];
}

export function getTagHref({ inventoryId, tagId, path }: GetTagHrefParams)
{
	const tagPath = ['tags', tagId];
	const fullPath = [...tagPath, ...(path || [])];
	return getInventoryHref({ inventoryId, path: fullPath });
}
