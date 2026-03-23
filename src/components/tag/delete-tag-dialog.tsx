'use client';

import { Button } from '@/components/ui/button';
import {
	buildTagReferences,
	DeleteConfirmationDialog,
	DeleteTarget,
	ResourceMetaInfo,
} from '@/components/confirmation-dialog';
import { Tag, deleteTag, useTagUsage } from '@/domain/tag';
import { TrashIcon } from 'lucide-react';

interface DeleteTagDialogProps
{
	tag: Tag;
}

export function DeleteTagDialog({ tag }: DeleteTagDialogProps)
{
	const { data } = useTagUsage({ tagId: tag.id });

	const { itemsCount, producersCount } = data ?? { itemsCount: 0, producersCount: 0 };

	const target: DeleteTarget = {
		resourceType: 'tag',
		resourceName: tag.name,
		references: buildTagReferences({
			itemsCount: itemsCount,
			producersCount: producersCount,
		}),
	};

	async function onConfirm()
	{
		await deleteTag(tag.id);
	}

	const meta: ResourceMetaInfo = {
		icon: '⬙',
		color: '#8b6cf7',
		description: (name) => `Tag "${name}" may be used by items and producers.`,
		warningThreshold: 1,
	};

	return (
		<DeleteConfirmationDialog
			trigger={
				<Button variant="destructive" size="icon-sm">
					<TrashIcon className="size-3" />
				</Button>
			}
			meta={meta}
			target={target}
			onConfirm={onConfirm}
		/>
	);
}
