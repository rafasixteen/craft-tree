'use client';

import { ItemNodeData, ProducerNodeData, ProductionRateComponent } from '@/components/production-graph';
import { Edge, useReactFlow, Node, Position, useNodeConnections, useNodesData } from '@xyflow/react';
import { useActiveInventory } from '@/components/inventory';
import { useItems } from '@/domain/item';
import { ItemCombobox } from '@/components/item';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { ItemRate, ProductionRate } from '@/domain/production-graph';
import { useEffect } from 'react';

interface ItemNodeProps
{
	id: string;
	data: ItemNodeData;
}

export function ItemNode({ id, data }: ItemNodeProps)
{
	const invetory = useActiveInventory();
	const { items } = useItems({ inventoryId: invetory.id });

	const { item, rate, readonly } = data;

	const { updateNodeData } = useReactFlow<Node<ItemNodeData>, Edge>();

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

	function onInputChange(newInput: ItemRate | null)
	{
		const newItem = items.find((i) => i.id === newInput?.itemId) ?? null;

		// TODO: Can we remove this check? It was added to prevent the node from losing its item when the inputs change while the items are still loading. (21/02/2026)
		// Skip setting the newItem if there are no items in the inventory, because that likely means the items are still loading,
		// and setting it to null would cause the node to lose its input item.
		// The node will already have the correct data on the first render since we are loading the graph data from storage.
		if (items.length === 0)
		{
			return;
		}

		updateNodeData(id, {
			item: newItem,
			rate: newInput?.rate ?? { amount: 0, per: 'second' },
			readonly: newItem !== null,
		});
	}

	return (
		<BaseNode className="p-0">
			<BaseNodeHeader className="m-0 border-b">
				<ItemCombobox items={items} value={item?.id ?? null} onChange={onComboboxChange} disabled={readonly} className="nodrag" />
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<InputHandle onChange={onInputChange} />
				<ProductionRateComponent value={rate} onChange={onRateChange} readonly={readonly} className="nodrag w-full" />
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}

interface InputHandleProps
{
	onChange: (rate: ItemRate | null) => void;
}

function InputHandle({ onChange }: InputHandleProps)
{
	const connections = useNodeConnections({
		handleType: 'target',
	});

	const node = useNodesData<Node<ProducerNodeData>>(connections?.[0]?.source);
	const nodeData = node?.data;

	const producer = nodeData?.producer;
	const outputs = nodeData?.outputs;

	const output = outputs?.find((o) => o.id === connections?.[0]?.sourceHandle);

	let troughput: number = 1;

	if (output && producer)
	{
		troughput = output.quantity / producer.time;
	}

	const rate: ProductionRate = {
		amount: troughput,
		per: 'second',
	};

	let itemRate: ItemRate | null = null;

	if (output)
	{
		itemRate = {
			itemId: output.itemId,
			rate: rate,
		};
	}

	useEffect(() =>
	{
		onChange(itemRate);
	}, [nodeData]);

	return <LabeledHandle type="target" position={Position.Left} title="" />;
}
