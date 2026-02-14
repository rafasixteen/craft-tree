'use client';

import { Tag, useTags } from '@/domain/tag';
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

interface TagsComboboxProps extends React.Component<typeof Combobox>
{
	value: Tag[];
	onChange: (tags: Tag[]) => void;
}

export function TagsCombobox({ value, onChange, ...props }: TagsComboboxProps)
{
	const anchor = useComboboxAnchor();

	const inventory = useActiveInventory()!;
	const { tags } = useTags(inventory.id!);

	return (
		<Combobox multiple autoHighlight items={tags.map((t) => t.name)} {...props}>
			<ComboboxChips ref={anchor} className="w-full max-w-xs">
				<ComboboxValue>
					{(values) => (
						<>
							{values.map((value: string) => (
								<ComboboxChip key={value}>{value}</ComboboxChip>
							))}
							<ComboboxChipsInput disabled={values.length >= 3} />
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
