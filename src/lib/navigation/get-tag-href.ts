import { Tag } from '@/domain/tag';

export function getTagHref(tag: Tag, action?: string)
{
	const base = `/inventories/${tag.inventoryId}/tags/${tag.id}`;
	return action ? `${base}/${action}` : base;
}
