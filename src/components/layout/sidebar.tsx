import { Collections } from '@/components/collections';
import { ItemTree } from '@/components/tree';

export function Sidebar()
{
	return (
		<div className="flex h-full flex-col gap-2 p-2">
			<Collections />
			<ItemTree />
		</div>
	);
}
