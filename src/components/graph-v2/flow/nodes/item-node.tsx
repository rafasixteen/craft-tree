'use client';

import { Edge, Node, NodeProps, Position, useReactFlow } from '@xyflow/react';
import { InferNodeConfig, itemNodeDefinition } from '@/domain/graph-v2';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { cn } from '@/lib/utils';
import { LabeledHandle } from '@/components/labeled-handle';
import { ItemCombobox } from '@/components/item';
import { ProductionRateComponent } from '@/components/graph';
import { useParams } from 'next/navigation';
import { useItems } from '@/domain/inventory';
import { ProductionRate } from '@/domain';
import { useCallback } from 'react';

type Config = NonNullable<InferNodeConfig<typeof itemNodeDefinition>>;

export function ItemNode({ id, data, selected }: NodeProps<Node<Config>>)
{
	const params = useParams();

	const inventoryId = params['inventory-id'] as string;
	const { itemId, rate } = data;

	const { updateNodeData } = useReactFlow<Node, Edge>();

	const { items } = useItems({ inventoryId });

	const onComboboxChange = useCallback(
		function onComboboxChange(itemId: string | null)
		{
			const selectedItem = items?.find((p) => p.id === itemId);

			updateNodeData(id, {
				itemId: selectedItem?.id,
			});
		},
		[updateNodeData, id, items],
	);

	const onRateChange = useCallback(
		function onRateChange(newRate: ProductionRate)
		{
			updateNodeData(id, {
				rate: newRate,
			});
		},
		[updateNodeData, id],
	);

	return (
		<BaseNode className={cn('p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="m-0 border-b">
				<ItemCombobox
					items={items ?? []}
					value={itemId}
					onChange={onComboboxChange}
					className="nodrag w-full"
				/>
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<LabeledHandle
					type="target"
					position={Position.Left}
					title=""
					className="opacity-0"
					isConnectable={false}
				/>
				<ProductionRateComponent value={rate} onChange={onRateChange} className="nodrag w-full" />
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}
