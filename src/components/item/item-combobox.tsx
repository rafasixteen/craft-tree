import { useCallback } from 'react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '../ui/combobox';
import { Item } from '@/domain/item';

interface ItemComboboxProps extends Omit<React.ComponentProps<typeof Combobox<Item>>, 'items' | 'value' | 'onValueChange' | 'itemToStringValue' | 'itemToStringLabel'>
{
	availableItems: Item[];
	value: Item['id'] | null;
	onChange: (itemId: Item['id'] | null) => void;
	'aria-invalid'?: boolean;
}

export function ItemCombobox({ availableItems, value, onChange, ...props }: ItemComboboxProps)
{
	const selectedItem = availableItems.find((item) => item.id === value) ?? null;

	const { 'aria-invalid': ariaInvalid, ...restProps } = props;

	const onValueChange = useCallback(
		function onValueChange(item: Item | null)
		{
			onChange(item ? item.id : null);
		},
		[onChange],
	);

	return (
		<Combobox<Item>
			items={availableItems}
			value={selectedItem}
			onValueChange={onValueChange}
			itemToStringValue={(item) => item.id}
			itemToStringLabel={(item) => item.name}
			{...restProps}
		>
			<ComboboxInput placeholder="Search item..." className="w-full" aria-invalid={ariaInvalid} />
			<ComboboxContent>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item.id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
