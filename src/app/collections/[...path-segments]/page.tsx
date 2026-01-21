import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getUserId } from '@/domain/user';
import { getUserCollections } from '@/domain/collection';
import { findNodeByPath, getNodeMap } from '@/domain/tree';
import { getRecipeById } from '@/domain/recipe';
import { getFolderById } from '@/domain/folder';
import { getItemById } from '@/domain/item';
import { FolderView } from '@/components/folder';
import { ItemView } from '@/components/item';
import { RecipeView } from '@/components/recipe';
import { CollectionView } from '@/components';

//TODO: Fix this logic

// there's a bug where if we have 2 nodes of different types that resolve
// to the same slug, the find node by path may give incorrect results due to a type mismatch.

// Example: I have a folder and an item inside the collection where the slug
// resolves to "test" and the findNodeByPath maps the segments new-collection/test
// to the node of type "folder", because it is incapable of telling wether we want an item or folder.

interface PageProps
{
	params: Promise<{ 'path-segments': string[] }>;
}

export default async function Page({ params }: PageProps)
{
	const { 'path-segments': pathSegments } = await params;
	if (!Array.isArray(pathSegments)) return notFound();

	const session = await auth();
	if (!session?.user?.email) return notFound();

	const userId = await getUserId(session.user.email);
	const collections = await getUserCollections(userId);

	const collectionSlug = pathSegments[0];
	const activeCollection = collections.find((collection) => collection.slug === collectionSlug);
	if (!activeCollection) return notFound();

	const nodes = await getNodeMap(activeCollection);
	const node = findNodeByPath(nodes, pathSegments);

	if (!node) return <p>Node not found</p>;

	switch (node.type)
	{
		case 'collection':
			return <CollectionView collection={activeCollection} />;
		case 'folder':
		{
			const folder = await getFolderById(node.id);
			if (!folder) return notFound();
			return <FolderView folder={folder} />;
		}
		case 'item':
		{
			const item = await getItemById(node.id);
			if (!item) return notFound();
			return <ItemView item={item} />;
		}
		case 'recipe':
		{
			const recipe = await getRecipeById(node.id);
			if (!recipe) return notFound();
			return <RecipeView recipe={recipe} />;
		}
		default:
			return notFound();
	}
}
