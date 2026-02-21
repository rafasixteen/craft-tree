'use client';

import { ItemNodeData } from '@/components/production-graph';
import { Edge, useReactFlow, Node, Position } from '@xyflow/react';
import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { ItemCombobox } from '@/components/item';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';

interface ItemNodeProps
{
	id: string;
	data: ItemNodeData;
}

export function ItemNode({ id, data }: ItemNodeProps)
{
	const invetory = useActiveInventory();
	const { items } = useItems({ inventoryId: invetory.id });

	const { item } = data;

	const { updateNodeData } = useReactFlow<Node<ItemNodeData>, Edge>();

	function onComboboxChange(itemId: string | null)
	{
		const selectedItem = items.find((p) => p.id === itemId) ?? null;

		updateNodeData(id, {
			item: selectedItem,
		});
	}

	return (
		<BaseNode className="p-0">
			<BaseNodeHeader className="m-0 border-b">
				<ItemCombobox items={items} value={item?.id ?? null} onChange={onComboboxChange} className="nodrag" />
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<p>Change rate here</p>
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}
