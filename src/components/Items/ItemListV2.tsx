'use client';

import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Folder } from '@components/Folder';

export default function ItemListV2()
{
	const tree = useTree<string>({
		initialState: { expandedItems: ['folder-1'] },
		rootItemId: 'folder',
		getItemName: (item) => item.getItemData(),
		isItemFolder: (item) => !item.getItemData().endsWith('item'),
		dataLoader: {
			getItem: (itemId) => itemId,
			getChildren: (itemId) => [`${itemId}-1`, `${itemId}-2`, `${itemId}-3`, `${itemId}-1item`, `${itemId}-2item`],
		},
		indent: 20,
		features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
	});

	return (
		<div {...tree.getContainerProps()}>
			{tree.getItems().map((item) => (
				<Folder key={item.getId()} item={item} />
			))}
		</div>
	);
}
