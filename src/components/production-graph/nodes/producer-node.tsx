'use client';

import { ItemNodeData, ProducerNodeData } from '@/components/production-graph';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals, useNodeConnections, useNodesData } from '@xyflow/react';
import { getProducerInputs, getProducerOutputs, useProducers } from '@/domain/producer';
import { useActiveInventory } from '@/components/inventory';
import { ProducerCombobox } from '@/components/producer';
import { useItems } from '@/domain/item';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { ItemRate, ProductionRate } from '@/domain/production-graph';
import { useEffect } from 'react';

interface ProducerNodeProps
{
	id: string;
	data: ProducerNodeData;
}

export function ProducerNode({ id, data }: ProducerNodeProps)
{
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useActiveInventory();

	const { producers } = useProducers({ inventoryId: invetory.id });
	const { items } = useItems({ inventoryId: invetory.id });

	const { producer, inputs, outputs } = data;

	const { updateNodeData, getEdges, setEdges } = useReactFlow<Node<ProducerNodeData>, Edge>();

	function onComboboxChange(producerId: string | null)
	{
		const selectedProducer = producers.find((p) => p.id === producerId) ?? null;

		// Remove edges connected to this node
		const edges = getEdges();
		const filtered = edges.filter((e) => e.source !== id && e.target !== id);

		setEdges(filtered);

		if (!selectedProducer)
		{
			updateNodeData(id, {
				producer: null,
				inputs: null,
				outputs: null,
			});

			return;
		}

		const inputs = getProducerInputs(selectedProducer.id);
		const outputs = getProducerOutputs(selectedProducer.id);

		Promise.all([inputs, outputs]).then(([inputs, outputs]) =>
		{
			updateNodeData(id, {
				producer: selectedProducer,
				inputs: inputs,
				outputs: outputs,
			});

			updateNodeInternals(id);
		});
	}

	function getItemName(itemId: string)
	{
		const item = items.find((i) => i.id === itemId);
		return item ? item.name : 'Unknown Item';
	}

	return (
		<BaseNode className="flex flex-col p-0">
			<BaseNodeHeader className="m-0 border-b">
				<ProducerCombobox producers={producers} value={producer?.id ?? null} onChange={onComboboxChange} className="nodrag w-full" />
			</BaseNodeHeader>

			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				{/* Inputs */}
				<div className="flex flex-col justify-center gap-3">
					{inputs?.map((input) => (
						<LabeledHandle
							key={input.id}
							id={input.id}
							type="target"
							position={Position.Left}
							title={`x${input.quantity} ${getItemName(input.itemId)}`}
							labelClassName="text-xs"
						/>
					))}
				</div>

				{/* Outputs */}
				<div className="flex flex-col justify-center gap-3">
					{outputs?.map((output) => (
						<LabeledHandle
							key={output.id}
							id={output.id}
							type="source"
							position={Position.Right}
							title={`x${output.quantity} ${getItemName(output.itemId)}`}
							labelClassName="text-xs"
						/>
					))}
				</div>
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

	const node = useNodesData<Node<ProducerNodeData> | Node<ItemNodeData>>(connections?.[0]?.source);
	const nodeData = node?.data;

	let itemRate: ItemRate | null = null;

	if (nodeData && 'outputs' in nodeData)
	{
	}
	else if (nodeData && 'item' in nodeData && 'rate' in nodeData)
	{
	}

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
