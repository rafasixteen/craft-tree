'use client';

import { Node, NodeProps, Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { InferNodeConfig, splitNodeDefinition } from '@/domain/graph-v2';
import { LabeledHandle } from '@/components/labeled-handle';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { ProductionRateComponent } from '@/components/graph/flow/production-rate';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusIcon, XIcon } from 'lucide-react';
import { ProductionRate } from '@/domain/graph';
import { useCallback } from 'react';

type Config = NonNullable<InferNodeConfig<typeof splitNodeDefinition>>;

export function SplitNode({ id, data, selected }: NodeProps<Node<Config>>)
{
	const { updateNodeData, getEdges, deleteElements } = useReactFlow<Node<Config>>();
	const updateNodeInternals = useUpdateNodeInternals();

	const { productionRates } = data;

	const addRate = useCallback(
		function addRate()
		{
			const newRate: ProductionRate = {
				amount: 1,
				per: 'second',
			};

			const newRates = [...productionRates, newRate];

			updateNodeData(id, {
				productionRates: newRates,
			});

			updateNodeInternals(id);
		},
		[id, productionRates, updateNodeData, updateNodeInternals],
	);

	const removeRate = useCallback(
		function removeRate(index: number)
		{
			const newRates = [...productionRates];
			newRates.splice(index, 1);

			updateNodeData(id, {
				productionRates: newRates,
			});

			updateNodeInternals(id);

			const edges = getEdges();
			const handleId = String(index);
			const edgesToRemove = edges.filter((edge) => edge.source === id && edge.sourceHandle === handleId);

			if (edgesToRemove.length > 0)
			{
				deleteElements({ edges: edgesToRemove });
			}
		},
		[id, productionRates, updateNodeData, updateNodeInternals, getEdges, deleteElements],
	);

	const onProductionRateChange = useCallback(
		function onProductionRateChange(index: number, value: ProductionRate)
		{
			const newRates = [...productionRates];
			newRates[index] = value;

			updateNodeData(id, {
				productionRates: newRates,
			});
		},
		[id, productionRates, updateNodeData],
	);

	return (
		<BaseNode className={cn('flex flex-col p-0', selected && 'ring-2 ring-primary')}>
			<BaseNodeHeader className="flex flex-col border-b">
				<div className="flex w-full items-center justify-between gap-2">
					<span>Split Node</span>
					<Button variant="ghost" size="icon-xs" onClick={addRate} className="nodrag">
						<PlusIcon className="size-3" />
					</Button>
				</div>
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<LabeledHandle type="target" position={Position.Left} title="" />
				<div className="flex flex-col justify-center gap-3">
					{productionRates.map((rate, index) =>
					{
						const edges = getEdges();
						const handleId = String(index);
						const hasConnection = edges.some((e) => e.source === id && e.sourceHandle === handleId);

						return (
							<div key={index} className="flex items-center gap-2">
								<Button
									variant="destructive"
									size="icon-xs"
									onClick={() => removeRate(index)}
									className="nodrag size-6"
									disabled={productionRates.length <= 1}
								>
									<XIcon className="size-3" />
								</Button>
								<ProductionRateComponent
									value={rate}
									onChange={(newRate) => onProductionRateChange(index, newRate)}
									className="nodrag h-6 w-full"
								/>
								<LabeledHandle
									id={handleId}
									type="source"
									position={Position.Right}
									title=""
									isConnectable={!hasConnection}
								/>
							</div>
						);
					})}
				</div>
			</BaseNodeContent>
		</BaseNode>
	);
}
