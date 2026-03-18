'use client';

import { Tag, useTags } from '@/domain/tag';
import { useCurrentInventory } from '@/components/inventory';
import { useEffect, useState } from 'react';
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

interface TagsComboboxProps extends Omit<
	React.ComponentPropsWithoutRef<typeof ComboboxChips>,
	'children' | 'value' | 'onValueChange' | 'multiple' | 'autoHighlight'
>
{
	value: Tag['id'][];
	onIdsChange: (value: Tag['id'][]) => void;
	className?: string;
	maxChips?: number;
}

export function TagsCombobox({
	className,
	value,
	onIdsChange,
	maxChips,
}: TagsComboboxProps)
{
	const anchor = useComboboxAnchor();

	const inventory = useCurrentInventory();
	const { tags } = useTags({ inventoryId: inventory.id });

	const [expanded, setExpanded] = useState(false);

	// Maps for fast lookup
	const idToTag = new Map(tags.map((t) => [t.id, t]));
	const tagIdsSet = new Set(tags.map((t) => t.id));

	// Convert external ID array -> internal Tag[] for Combobox
	const selectedTags = value
		.map((id) => idToTag.get(id))
		.filter(Boolean) as Tag[];

	function onValueChange(newTags: Tag[])
	{
		const newTagIds = newTags
			.map((t) => t.id)
			.filter((id) => tagIdsSet.has(id));
		onIdsChange(newTagIds);
	}

	// If selection shrinks below maxChips, auto-collapse
	useEffect(() =>
	{
		if (maxChips && selectedTags.length <= maxChips)
		{
			setExpanded(false);
		}
	}, [selectedTags.length, maxChips]);

	const isLimited = typeof maxChips === 'number';
	const shouldCollapse =
		isLimited && !expanded && selectedTags.length > maxChips;

	return (
		<Combobox
			items={tags}
			itemToStringValue={(tag: Tag) => tag.name}
			value={selectedTags}
			onValueChange={onValueChange}
			multiple
			autoHighlight
		>
			<ComboboxChips ref={anchor} className={className}>
				<ComboboxValue>
					{(selected: Tag[]) =>
					{
						if (!isLimited)
						{
							// No limit → render everything
							return selected.map((tag) => (
								<ComboboxChip key={tag.id}>
									{tag.name}
								</ComboboxChip>
							));
						}

						const displayTags = shouldCollapse
							? selected.slice(0, maxChips)
							: selected;

						const extraCount = selected.length - maxChips!;

						return (
							<>
								{displayTags.map((tag) => (
									<ComboboxChip key={tag.id}>
										{tag.name}
									</ComboboxChip>
								))}

								{selected.length > maxChips! && (
									<ComboboxChip
										onClick={() =>
											setExpanded((prev) => !prev)
										}
										style={{ cursor: 'pointer' }}
										showRemove={false}
									>
										{expanded
											? 'Show less'
											: `+${extraCount} more`}
									</ComboboxChip>
								)}
							</>
						);
					}}
				</ComboboxValue>

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
