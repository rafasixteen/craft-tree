import type { TimeUnit, ProductionRate } from '@/domain/recipe-tree';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { ButtonGroup } from '@/components/ui/button-group';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

const UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
	{ value: 'second', label: 'Sec' },
	{ value: 'minute', label: 'Min' },
	{ value: 'hour', label: 'Hour' },
];

interface ProductionRateControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>
{
	rate: ProductionRate;
	onChange: (rate: ProductionRate) => void;
}

export function ProductionRateControl({ rate, onChange, ...props }: ProductionRateControlProps)
{
	const { className, ...otherProps } = props;

	const onAmountChange = useCallback(
		function handleAmountChange(value: number)
		{
			onChange({ ...rate, amount: value });
		},
		[onChange, rate],
	);

	const onUnitChange = useCallback(
		function handleUnitChange(unit: TimeUnit)
		{
			onChange({ ...rate, per: unit });
		},
		[onChange, rate],
	);

	return (
		<div className={cn('space-y-1.5', className)} {...otherProps}>
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
	);
}
