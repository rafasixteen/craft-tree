export interface Node
{
	id: string;
	name: string;
	slug: string;
	type: 'folder' | 'item' | 'recipe';
	collectionSlug: string;
	collectionId: string;
	children?: string[];
	resourceSlug?: string;
}
