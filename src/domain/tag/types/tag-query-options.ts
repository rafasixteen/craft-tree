export interface TagFilters
{
	search?: string;
}

export type TagSort =
	| 'name_asc'
	| 'name_desc'
	| 'created_at_asc'
	| 'created_at_desc';

export interface TagQueryOptions
{
	filters?: TagFilters;
	sort?: TagSort;
}
