'use client';

import { useTags } from '@/domain/tag';
import { useActiveInventory } from '@/components/inventory';
import { useState, useEffect } from 'react';

interface TagsSelectProps
{
	value?: string[];
	onChange?: (tags: string[]) => void;
	className?: string;
	maxSelected?: number;
}

export function TagsSelect({ value = [], onChange, className, maxSelected = 10 }: TagsSelectProps)
{
	const inventory = useActiveInventory()!;
	const { tags } = useTags(inventory.id!);

	const [selectedTags, setSelectedTags] = useState<string[]>(value);

	useEffect(() =>
	{
		if (JSON.stringify(value) !== JSON.stringify(selectedTags))
		{
			setSelectedTags(value);
		}
	}, [value]);

	useEffect(() =>
	{
		onChange?.(selectedTags);
	}, [selectedTags, onChange]);

	const toggleTag = (tag: string) =>
	{
		setSelectedTags((prev) =>
		{
			if (prev.includes(tag))
			{
				return prev.filter((t) => t !== tag);
			}
			else if (prev.length < maxSelected)
			{
				return [...prev, tag];
			}
			return prev;
		});
	};

	// Theme-aware classes (using shadcn/ui or tailwind global theme tokens)
	// Selected tags: bg-primary/80 text-primary-foreground border border-primary
	// Available tags: bg-muted text-muted-foreground border border-muted-foreground hover:bg-accent hover:text-accent-foreground
	// Remove button: hover:bg-destructive/80 hover:text-destructive-foreground

	// Layout: Selected tags in a row, available tags below, both scrollable if needed
	return (
		<div className={`flex flex-col gap-2 ${className ?? ''}`}>
			<div className="flex min-h-8 flex-wrap gap-2">
				{selectedTags.length === 0 && <span className="text-sm text-muted-foreground opacity-70">No tags selected</span>}
				{selectedTags.map((tag) => (
					<span
						key={tag}
						className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-primary/80 px-2 py-1 text-xs text-primary-foreground transition-colors hover:bg-primary/60"
						onClick={() => toggleTag(tag)}
						title="Remove tag"
					>
						{tag}
						<span className="ml-1 text-xs font-bold opacity-70">×</span>
					</span>
				))}
			</div>
			<div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-md border bg-background/80 p-2">
				{tags
					.filter((tag) => !selectedTags.includes(tag.name))
					.map((tag) => (
						<button
							key={tag.name}
							type="button"
							className="cursor-pointer rounded-full border border-muted-foreground bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
							onClick={() => toggleTag(tag.name)}
							disabled={selectedTags.length >= maxSelected}
						>
							{tag.name}
						</button>
					))}
				{tags.filter((tag) => !selectedTags.includes(tag.name)).length === 0 && <span className="text-xs text-muted-foreground opacity-60">No more tags available</span>}
			</div>
		</div>
	);
}
