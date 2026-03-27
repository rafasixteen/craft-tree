import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from '@/components/ui/combobox';

import { Item } from '@/domain/item';

import { useCallback } from 'react';

interface ItemComboboxProps extends Omit<
	React.ComponentProps<typeof Combobox<Item>>,
	'items' | 'value' | 'onValueChange' | 'itemToStringValue' | 'itemToStringLabel'
>
{
	items: Item[];
	value?: Item['id'] | null;
	onChange: (itemId: Item['id'] | null) => void;
	className?: string;
	'aria-invalid'?: boolean;
}

export function ItemCombobox({ items, value, onChange, ...props }: ItemComboboxProps)
{
	const selectedItem = items.find((item) => item.id === value) ?? null;

	const { 'aria-invalid': ariaInvalid, disabled, className, ...restProps } = props;

	const onValueChange = useCallback(
		function onValueChange(item: Item | null)
		{
			onChange(item ? item.id : null);
		},
		[onChange],
	);

	return (
		<Combobox<Item>
			items={items}
			value={selectedItem}
			onValueChange={onValueChange}
			itemToStringValue={(item) => item.id}
			itemToStringLabel={(item) => item.name}
			{...restProps}
		>
			<ComboboxInput
				placeholder="Search item..."
				className={className}
				aria-invalid={ariaInvalid}
				disabled={disabled}
			/>
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
