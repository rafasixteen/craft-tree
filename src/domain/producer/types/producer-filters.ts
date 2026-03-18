import { Tag } from '@/domain/tag';

export interface ProducerFilters
{
	search?: string;
	tagIds?: Tag['id'][];
}

export type ProducerSort =
	| 'name_asc'
	| 'name_desc'
	| 'created_at_asc'
	| 'created_at_desc';

export interface ProducerQueryOptions
{
	filters?: ProducerFilters;
	sort?: ProducerSort;
}
