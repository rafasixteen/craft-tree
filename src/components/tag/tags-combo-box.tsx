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

interface TagsComboboxProps extends Omit<React.ComponentPropsWithoutRef<typeof ComboboxChips>, 'children' | 'value' | 'onValueChange' | 'multiple' | 'autoHighlight'>
{
	className?: string;
	value: Tag['id'][];
	onIdsChange: (value: Tag['id'][]) => void;
}

export function TagsCombobox({ className, value, onIdsChange }: TagsComboboxProps)
{
	const anchor = useComboboxAnchor();
	const inventory = useActiveInventory();
	const { tags } = useTags(inventory.id);

	// Maps for fast lookup
	const idToTag = new Map(tags.map((t) => [t.id, t]));
	const tagIdsSet = new Set(tags.map((t) => t.id));

	// Convert external ID array -> internal Tag[] for Combobox
	const selectedTags = value.map((id) => idToTag.get(id)).filter(Boolean) as Tag[];

	// Handle selection change from Combobox
	const handleValueChange = (newTags: Tag[]) =>
	{
		const newIds = newTags.map((t) => t.id).filter((id) => tagIdsSet.has(id)); // safety
		onIdsChange(newIds);
	};

	return (
		<Combobox items={tags} itemToStringValue={(tag: Tag) => tag.name} value={selectedTags} onValueChange={handleValueChange} multiple autoHighlight>
			<ComboboxChips ref={anchor} className={className}>
				<ComboboxValue>{(selected: Tag[]) => selected.map((tag) => <ComboboxChip key={tag.id}>{tag.name}</ComboboxChip>)}</ComboboxValue>
				<ComboboxChipsInput />
			</ComboboxChips>

			<ComboboxContent anchor={anchor}>
				<ComboboxEmpty>No tags found.</ComboboxEmpty>
				<ComboboxList>
					{(tag: Tag) => (
						<ComboboxItem key={tag.id} value={tag}>
							{tag.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
