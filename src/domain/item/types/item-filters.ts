import { Tag } from '@/domain/tag';

export interface ItemFilters
{
	search?: string;
	tagIds?: Tag['id'][];
}

export type ItemSort = 'name_asc' | 'name_desc' | 'created_at_asc' | 'created_at_desc';

export interface ItemQueryOptions
{
	filters?: ItemFilters;
	sort?: ItemSort;
}
