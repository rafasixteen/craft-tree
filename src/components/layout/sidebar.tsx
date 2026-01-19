import { Collections } from '@/components/collections';
import { ItemTree } from '@/components/tree';

export function Sidebar()
{
	return (
		<div className="flex flex-col p-2 gap-2">
			<Collections />
			<ItemTree />
		</div>
	);
}
