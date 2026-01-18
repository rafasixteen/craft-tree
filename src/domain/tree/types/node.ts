export interface Node
{
	id: string;
	name: string;
	slug: string;
	type: 'collection' | 'folder' | 'item' | 'recipe';
	collectionSlug: string;
	collectionId: string;
	children?: string[];
	resourceSlug?: string;
}
