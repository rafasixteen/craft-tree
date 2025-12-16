import { createNode, getRootNodes } from '@/lib/graphql/nodes';

export default async function CollectionsLoader()
{
	let roots = await getRootNodes({ id: true, name: true });

	if (roots.length === 0)
	{
		const defaultNode = await createNode(
			{
				data: {
					name: 'New Collection',
					type: 'folder',
				},
			},
			{
				id: true,
				name: true,
			},
		);

		roots.push(defaultNode);
	}

	return roots.map((node) => ({
		id: node.id,
		name: node.name,
	}));
}
