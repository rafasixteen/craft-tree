import { Item } from '@/domain';
import { Tag } from '@/domain/tag';

export interface ItemTag
{
	itemId: Item['id'];
	tagId: Tag['id'];
}
