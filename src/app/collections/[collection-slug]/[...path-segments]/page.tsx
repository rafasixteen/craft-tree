'use client';

import { useTreeNodes } from '@/providers';
import { notFound, useParams } from 'next/navigation';
import { findNodeByPath } from '@/domain/tree';
import { FolderView } from '@/components/folder';
import { ItemView } from '@/components/item';
import { RecipeView } from '@/components/recipe';

export default function Page()
{
	const { 'path-segments': pathSegments } = useParams();
	const { nodes, isLoading } = useTreeNodes();

	if (!Array.isArray(pathSegments))
	{
		return notFound();
	}

	const node = findNodeByPath(nodes, pathSegments);

	if (isLoading)
	{
		return <p>Loading...</p>;
	}

	if (!node)
	{
		return notFound();
	}

	switch (node.type)
	{
		case 'folder':
			return <FolderView />;
		case 'item':
			return <ItemView />;
		case 'recipe':
			return <RecipeView />;
		default:
			return notFound();
	}
}
