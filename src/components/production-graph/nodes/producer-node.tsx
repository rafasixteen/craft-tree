'use client';

import { ProducerNodeData } from '@/components/production-graph/types';
import { Edge, useReactFlow, Node, Position, useUpdateNodeInternals } from '@xyflow/react';
import { getProducerInputs, getProducerOutputs, useProducers } from '@/domain/producer';
import { useActiveInventory } from '@/components/inventory';
import { ProducerCombobox } from '@/components/producer';
import { useItems } from '@/domain/item';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';

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
			<BaseNodeHeader className="m-0 flex-col border-b">
				<p className="text-xs">{id}</p>
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
