'use client';

import { BaseNode, BaseNodeHeader, BaseNodeContent } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { Button } from '@/components/ui/button';
import { NodeProps, Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { SplitGraphNode } from '@/components/production-graph/types';
import { PlusIcon, XIcon } from 'lucide-react';
import { ProductionRate } from '@/domain/production-graph';
import { ProductionRateComponent } from '@/components/production-graph/production-rate';

export function SplitNode({ id, data }: NodeProps<SplitGraphNode>)
{
	const { updateNodeData } = useReactFlow<SplitGraphNode>();
	const updateNodeInternals = useUpdateNodeInternals();

	const { outputs } = data;

	function addOutput()
	{
		const newRate: ProductionRate = {
			amount: 1,
			per: 'second',
		};

		const newOutputs = outputs ? [...outputs, newRate] : [newRate];

		updateNodeData(id, { outputs: newOutputs });
		updateNodeInternals(id);
	}

	function updateOutput(index: number, rate: ProductionRate)
	{
		if (!outputs)
		{
			return;
		}

		const newOutputs = [...outputs];
		newOutputs[index] = rate;

		updateNodeData(id, { outputs: newOutputs });
	}

	function removeOutput(index: number)
	{
		if (!outputs)
		{
			return;
		}

		const newOutputs = outputs.filter((_, i) => i !== index);

		updateNodeData(id, { outputs: newOutputs });
		updateNodeInternals(id);
	}

	return (
		<BaseNode className="flex flex-col p-0">
			<BaseNodeHeader className="flex flex-col border-b">
				<div className="flex w-full items-center justify-between gap-2">
					<span>Split Node</span>
					<Button variant="ghost" size="icon-xs" onClick={addOutput} className="nodrag">
						<PlusIcon className="size-3" />
					</Button>
				</div>
			</BaseNodeHeader>
			{outputs.length > 0 && (
				<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
					<LabeledHandle type="source" position={Position.Left} title="" />

					<div className="flex flex-col justify-center gap-3">
						{outputs.map((output, index) => (
							<div key={index} className="flex items-center gap-2">
								<Button variant="destructive" size="icon-xs" onClick={() => removeOutput(index)} className="nodrag" disabled={outputs.length <= 1}>
									<XIcon className="size-3" />
								</Button>
								<ProductionRateComponent value={output} onChange={(newRate) => updateOutput(index, newRate)} className="nodrag w-full" />
								<LabeledHandle id={String(index)} type="target" position={Position.Right} title="" />
							</div>
						))}
					</div>
				</BaseNodeContent>
			)}
		</BaseNode>
	);
}
