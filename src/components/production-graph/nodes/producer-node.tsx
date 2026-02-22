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
	const { updateNodeData, getEdges, setEdges } = useReactFlow<Node<ProducerNodeData>, Edge>();
	const updateNodeInternals = useUpdateNodeInternals();

	const invetory = useActiveInventory();

	const { producers } = useProducers({ inventoryId: invetory.id });
	const { items } = useItems({ inventoryId: invetory.id });

	// TODO: Add a use producer inputs and outputs so we can rehydrate with db state.
	// This is to prevent the stale data when the db changes, which currently arent reflected
	// in node data.

	const { producer, inputs, outputs } = data;

	function onComboboxChange(producerId: string | null)
	{
		// Remove only edges whose handle id (itemId) is no longer present in the new producer's inputs/outputs.
		const edges = getEdges();

		// If no producer is selected, remove all edges connected to this node.
		if (!producerId)
		{
			const filtered = edges.filter((e) => e.source !== id && e.target !== id);

			setEdges(filtered);

			updateNodeData(id, {
				producer: null,
				inputs: null,
				outputs: null,
			});

			return;
		}

		// Get new input/output itemIds for the selected producer
		const inputsPromise = getProducerInputs(producerId);
		const outputsPromise = getProducerOutputs(producerId);

		Promise.all([inputsPromise, outputsPromise]).then(([inputs, outputs]) =>
		{
			const inputItemIds = new Set(inputs.map((input) => input.itemId));
			const outputItemIds = new Set(outputs.map((output) => output.itemId));

			// Only keep edges that refer to itemIds still present in the new producer's inputs/outputs
			const filtered = edges.filter((e) =>
			{
				// If this node is the source, check if the sourceHandleId is still a valid output itemId
				if (e.source === id && e.sourceHandle)
				{
					return outputItemIds.has(e.sourceHandle);
				}

				// If this node is the target, check if the targetHandleId is still a valid input itemId
				if (e.target === id && e.targetHandle)
				{
					return inputItemIds.has(e.targetHandle);
				}

				// Otherwise, keep the edge
				return true;
			});

			setEdges(filtered);

			updateNodeData(id, {
				producer: producers.find((p) => p.id === producerId) ?? null,
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
					{inputs?.map((input, index) => (
						<LabeledHandle
							key={index}
							id={input.itemId}
							type="target"
							position={Position.Left}
							title={`x${input.quantity} ${getItemName(input.itemId)}`}
							labelClassName="text-xs"
						/>
					))}
				</div>

				{/* Outputs */}
				<div className="flex flex-col justify-center gap-3">
					{outputs?.map((output, index) => (
						<LabeledHandle
							key={index}
							id={output.itemId}
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
