import { TagCell } from '@/components/tag';
import { useGrid } from '@/components/grid';
import { Tag } from '@/domain/tag';

export function TagGrid()
{
	const { cells: tags, getGridProps, getCellProps } = useGrid<Tag>();

	return (
		<div className="grid auto-rows-min grid-cols-2 gap-4 md:grid-cols-6" {...getGridProps()}>
			{tags.map((tag, index) => (
				<TagCell key={tag.id} {...getCellProps(tag.id, index)} />
			))}
		</div>
	);
}
