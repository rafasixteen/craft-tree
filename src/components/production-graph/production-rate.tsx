import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCallback } from 'react';
import { ProductionRate, TimeUnit } from '@/domain/production-graph';

const UNIT_OPTIONS: { value: TimeUnit; label: string }[] = [
	{ value: 'second', label: 'Second' },
	{ value: 'minute', label: 'Minute' },
	{ value: 'hour', label: 'Hour' },
];

interface ProductionRateComponentProps extends Omit<React.ComponentProps<typeof InputGroup>, 'onChange'>
{
	value: ProductionRate;
	onChange: (value: ProductionRate) => void;
}

export function ProductionRateComponent({ value, onChange, ...props }: ProductionRateComponentProps)
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
		<InputGroup {...props}>
			<InputGroupInput type="number" min={0} step={1} value={value.amount} onChange={(e) => onAmountChange(Number(e.target.value))} />
			<InputGroupAddon align="inline-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<InputGroupButton variant="secondary">/ {value.per}</InputGroupButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="[--radius:0.95rem]">
						<DropdownMenuGroup>
							{UNIT_OPTIONS.map((unit) => (
								<DropdownMenuItem key={unit.value} onSelect={() => onUnitChange(unit.value)}>
									{unit.value}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</InputGroupAddon>
		</InputGroup>
	);
}
