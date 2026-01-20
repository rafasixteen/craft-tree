'use client';

import { useTreeNodes } from '@/providers';
import { notFound, useParams } from 'next/navigation';
import { findNodeByPath } from '@/domain/tree';
import { FolderView } from '@/components/folder';
import { ItemView } from '@/components/item';
import { RecipeView } from '@/components/recipe';

const componentMap = {
	folder: FolderView,
	item: ItemView,
	recipe: RecipeView,
} as const;

export default function Page()
{
	const { 'path-segments': pathSegments } = useParams();
	const { nodes, isLoading } = useTreeNodes();

	if (!Array.isArray(pathSegments)) return notFound();

	if (isLoading) return <p>Loading...</p>;

	const node = findNodeByPath(nodes, pathSegments);

	if (!node) return <p>Node not found</p>;

	const Component = componentMap[node.type as keyof typeof componentMap];

	return Component ? <Component /> : notFound();
}
