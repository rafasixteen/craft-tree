'use client';

import { ItemNodeData } from '@/components/production-graph/types';
import { ProductionRateComponent } from '@/components/production-graph/production-rate';
import { Edge, useReactFlow, Node, Position } from '@xyflow/react';
import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { ItemCombobox } from '@/components/item';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { ProductionRate } from '@/domain/production-graph';

interface ItemNodeProps
{
	id: string;
	data: ItemNodeData;
}

export function ItemNode({ id, data }: ItemNodeProps)
{
	const { updateNodeData } = useReactFlow<Node<ItemNodeData>, Edge>();

	const invetory = useActiveInventory();

	const { items } = useItems({ inventoryId: invetory.id });

	const { item, rate } = data;

	function onComboboxChange(itemId: string | null)
	{
		const selectedItem = items.find((p) => p.id === itemId) ?? null;

		updateNodeData(id, {
			item: selectedItem,
		});
	}

	function onRateChange(newRate: ProductionRate)
	{
		updateNodeData(id, {
			rate: newRate,
		});
	}

	return (
		<BaseNode className="p-0">
			<BaseNodeHeader className="m-0 border-b">
				<ItemCombobox items={items} value={item?.id ?? null} onChange={onComboboxChange} className="nodrag" />
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<ProductionRateComponent value={rate} onChange={onRateChange} readonly={false} className="nodrag w-full" />
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}
