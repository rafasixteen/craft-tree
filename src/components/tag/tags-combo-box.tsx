'use client';

import { useTags } from '@/domain/tag';
import { useActiveInventory } from '@/components/inventory';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxValue,
	useComboboxAnchor,
} from '@/components/ui/combobox';

interface TagsComboboxProps extends React.ComponentProps<typeof Combobox>
{
	className?: string;
	maxSelected?: number;
}

export function TagsCombobox({ className, ...props }: TagsComboboxProps)
{
	const anchor = useComboboxAnchor();

	const inventory = useActiveInventory()!;
	const { tags } = useTags(inventory.id!);

	return (
		<Combobox multiple autoHighlight items={tags.map((t) => t.name)} {...props}>
			<ComboboxChips ref={anchor} className={className}>
				<ComboboxValue>
					{(values) => (
						<>
							{values.map((value: string) => (
								<ComboboxChip key={value}>{value}</ComboboxChip>
							))}
							<ComboboxChipsInput disabled={values.length >= (props.maxSelected ?? Infinity)} />
						</>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No tags found.</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
