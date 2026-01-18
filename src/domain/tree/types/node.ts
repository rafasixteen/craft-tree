import { NodeType } from '@/domain/tree';

export interface Node
{
	id: string;
	name: string;
	slug: string;
	type: NodeType;
	collectionSlug: string;
	collectionId: string;
	children?: string[];
	resourceSlug?: string;
}
