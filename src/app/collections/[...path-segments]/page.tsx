'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useInventory } from '@/domain/inventory';
import { ItemView } from '@/components/item';
import { RecipeView, RecipeViewV2 } from '@/components/recipe';

//TODO: Fix this logic

// there's a bug where if we have 2 nodes of different types that resolve
// to the same slug, the find node by path may give incorrect results due to a type mismatch.

// Example: I have a folder and an item inside the collection where the slug
// resolves to "test" and the findNodeByPath maps the segments new-collection/test
// to the node of type "folder", because it is incapable of telling wether we want an item or folder.

export default function Page()
{
	const pathname = usePathname();

	const { findNodeByPath } = useInventory();

	const nodePathname = pathname.replace('/collections/', '');
	const node = useMemo(() => findNodeByPath(nodePathname.split('/')), [nodePathname, findNodeByPath]);

	if (!node)
	{
		return <p>Node not found</p>;
	}

	switch (node.type)
	{
		case 'item':
		{
			return <ItemView itemId={node.id} />;
		}
		case 'recipe':
		{
			return <RecipeViewV2 recipeId={node.id} />;
		}
		default:
			return <pre>{JSON.stringify(node, null, 2)}</pre>;
	}
}
