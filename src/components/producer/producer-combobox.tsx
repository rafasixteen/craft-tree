import { useCallback } from 'react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Producer } from '@/domain/producer';

interface ProducerComboboxProps extends Omit<React.ComponentProps<typeof Combobox<Producer>>, 'items' | 'value' | 'onValueChange' | 'itemToStringValue' | 'itemToStringLabel'>
{
	producers: Producer[];
	value: Producer['id'] | null;
	onChange: (producerId: Producer['id'] | null) => void;
	className?: string;
	'aria-invalid'?: boolean;
}

export function ProducerCombobox({ producers, value, onChange, ...props }: ProducerComboboxProps)
{
	const selectedProducer = producers.find((producer) => producer.id === value) ?? null;

	const { 'aria-invalid': ariaInvalid, className, ...restProps } = props;

	const onValueChange = useCallback(
		function onValueChange(producer: Producer | null)
		{
			onChange(producer ? producer.id : null);
		},
		[onChange],
	);

	return (
		<Combobox<Producer>
			items={producers}
			value={selectedProducer}
			onValueChange={onValueChange}
			itemToStringValue={(producer) => producer.id}
			itemToStringLabel={(producer) => producer.name}
			{...restProps}
		>
			<ComboboxInput placeholder="Search producer..." className={className} aria-invalid={ariaInvalid} />
			<ComboboxContent>
				<ComboboxEmpty>No producers found.</ComboboxEmpty>
				<ComboboxList>
					{(producer) => (
						<ComboboxItem key={producer.id} value={producer}>
							{producer.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
