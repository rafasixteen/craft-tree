import { Card, CardContent } from '@/components/ui/card';
import { Handle, Position } from '@xyflow/react';
import { useRecipeTree, TimeUnit } from '@/domain/recipe-tree';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { ButtonGroup } from '@/components/ui/button-group';
import { useCallback } from 'react';

// TODO: add preference buttons (“fastest”, “cheapest”, etc.)
// that will automatically pick recipes in the recipe tree,
// optimizing according to a criterion.

const UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
	{ value: 'second', label: 'Sec' },
	{ value: 'minute', label: 'Min' },
	{ value: 'hour', label: 'Hour' },
];

interface RateControlNodeProps
{
	id: string;
}

export function RateControlNode({ id }: RateControlNodeProps)
{
	const { recipeTree, setRate } = useRecipeTree();

	const rate = recipeTree?.rate;

	const onAmountChange = useCallback(
		function handleAmountChange(value: number)
		{
			if (!rate) return;
			setRate({ ...rate, amount: value });
		},
		[setRate, rate],
	);

	const onUnitChange = useCallback(
		function handleUnitChange(unit: TimeUnit)
		{
			if (!rate) return;
			setRate({ ...rate, per: unit });
		},
		[setRate, rate],
	);

	if (!rate)
	{
		return null;
	}

	return (
		<Card className="max-w-80 min-w-50">
			<CardContent className="text-xs text-muted-foreground">
				<div className="nopan space-y-1.5">
					<InputGroup>
						<InputGroupInput type="number" min={1} step={1} value={rate.amount} onChange={(e) => onAmountChange(Number(e.target.value))} className="w-20" />
						<InputGroupAddon align="inline-end">
							<InputGroupText>/ {rate.per}</InputGroupText>
						</InputGroupAddon>
					</InputGroup>

					<ButtonGroup className="grid w-full grid-cols-3 rounded-md border border-input bg-input/20 p-0.5 dark:bg-input/30">
						{UNIT_OPTIONS.map((unit) => (
							<Button key={unit.value} variant={rate.per === unit.value ? 'default' : 'ghost'} onClick={() => onUnitChange(unit.value)}>
								{unit.label}
							</Button>
						))}
					</ButtonGroup>
				</div>
			</CardContent>
			<Handle type="source" position={Position.Bottom} />
		</Card>
	);
}
