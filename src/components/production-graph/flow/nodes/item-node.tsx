'use client';

import { ItemGraphNode, ItemNodeData } from '@/components/production-graph/flow/types';
import { ProductionRateComponent } from '@/components/production-graph/flow/production-rate';
import { Edge, useReactFlow, Node, Position, NodeProps } from '@xyflow/react';
import { useCurrentInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { ItemCombobox } from '@/components/item';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { ProductionRate } from '@/domain/production-graph';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

export function ItemNode({ id, data, selected }: NodeProps<ItemGraphNode>)
{
	const { updateNodeData } = useReactFlow<Node<ItemNodeData>, Edge>();

	const invetory = useCurrentInventory();
	const { items } = useItems({ inventoryId: invetory.id });

	const { itemId, rate } = data;

	const onComboboxChange = useCallback(
		function onComboboxChange(itemId: string | null)
		{
			const selectedItem = items.find((p) => p.id === itemId) ?? null;

			updateNodeData(id, {
				itemId: selectedItem?.id ?? null,
			});
		},
		[id, items, updateNodeData],
	);

	const onRateChange = useCallback(
		function onRateChange(newRate: ProductionRate)
		{
			updateNodeData(id, {
				rate: newRate,
			});
		},
		[id, updateNodeData],
	);

	return (
		<BaseNode className={cn('p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="m-0 border-b">
				<ItemCombobox items={items} value={itemId} onChange={onComboboxChange} className="nodrag w-full" />
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<LabeledHandle type="target" position={Position.Left} title="" className="opacity-0" isConnectable={false} />
				<ProductionRateComponent value={rate} onChange={onRateChange} className="nodrag w-full" />
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}
