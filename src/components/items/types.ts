export interface Node
{
	id: string;
	name: string;
	slug: string;
	type: 'folder' | 'item' | 'recipe';
	collectionSlug: string;
	children?: string[];
	resourceSlug?: string;
}
