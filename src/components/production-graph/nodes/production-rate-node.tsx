'use client';

import { ProductionRateNodeData } from '@/components/production-graph';
import { Edge, useReactFlow, Node, Position } from '@xyflow/react';
import { BaseNode, BaseNodeContent, BaseNodeHeader } from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { useCallback } from 'react';
import { ProductionRate, TimeUnit } from '@/domain/production-graph';
import { cn } from '@/lib/utils';

const UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
	{ value: 'second', label: 'Sec' },
	{ value: 'minute', label: 'Min' },
	{ value: 'hour', label: 'Hour' },
];

interface ProductionRateNodeProps
{
	id: string;
	data: ProductionRateNodeData;
}

export function ProductionRateNode({ id, data }: ProductionRateNodeProps)
{
	const { rate, readonly } = data;

	const { updateNodeData } = useReactFlow<Node<ProductionRateNodeData>, Edge>();

	const onRateChange = useCallback(
		function onRateChange(value: ProductionRate)
		{
			updateNodeData(id, {
				rate: value,
			});
		},
		[updateNodeData, id],
	);

	return (
		<BaseNode className="p-0">
			<BaseNodeHeader className="m-0 border-b">
				<ProductionRateComponent value={rate} onChange={onRateChange} className="nodrag m-0" readonly={readonly} />
			</BaseNodeHeader>
			<BaseNodeContent className="flex flex-row justify-between p-0 py-3">
				<LabeledHandle type="target" position={Position.Left} title="" />
				<p className="text-xs">Iron Worker</p>
				<LabeledHandle type="source" position={Position.Right} title="" />
			</BaseNodeContent>
		</BaseNode>
	);
}

interface ProductionRateComponentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>
{
	value: ProductionRate;
	onChange: (value: ProductionRate) => void;
	readonly?: boolean;
}

function ProductionRateComponent({ value, onChange, readonly, className, ...props }: ProductionRateComponentProps)
{
	const onAmountChange = useCallback(
		function handleAmountChange(amount: number)
		{
			onChange({
				...value,
				amount: amount,
			});
		},
		[onChange, value],
	);

	const onUnitChange = useCallback(
		function handleUnitChange(unit: TimeUnit)
		{
			onChange({
				...value,
				per: unit,
			});
		},
		[onChange, value],
	);

	return (
		<div className={cn('space-y-1.5', className)} {...props}>
			<InputGroup>
				<InputGroupInput
					type="number"
					min={1}
					step={1}
					value={value.amount}
					onChange={(e) => onAmountChange(Number(e.target.value))}
					className="w-20"
					readOnly={readonly}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupText>/ {value.per}</InputGroupText>
				</InputGroupAddon>
			</InputGroup>

			<ButtonGroup className="grid w-full grid-cols-3 rounded-md border border-input bg-input/20 p-0.5 dark:bg-input/30">
				{UNIT_OPTIONS.map((unit) => (
					<Button key={unit.value} variant={value.per === unit.value ? 'default' : 'ghost'} onClick={() => onUnitChange(unit.value)} disabled={readonly}>
						{unit.label}
					</Button>
				))}
			</ButtonGroup>
		</div>
	);
}
