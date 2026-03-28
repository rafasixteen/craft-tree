import { Node, useReactFlow } from '@xyflow/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';

export interface NodeContextMenuProps
{
	type: 'node';
	nodeId: Node['id'];
	position: { x: number; y: number };
	close: () => void;
}

export function NodeContextMenu({ nodeId, position, close }: NodeContextMenuProps)
{
	const { deleteElements, getNode } = useReactFlow();

	const onOpenChange = useCallback(
		function onOpenChange(open: boolean)
		{
			if (!open)
			{
				close();
			}
		},
		[close],
	);

	const deleteNode = useCallback(
		function deleteNode()
		{
			const node = getNode(nodeId);
			if (node)
			{
				deleteElements({ nodes: [node] });
			}
		},
		[nodeId, getNode, deleteElements],
	);

	const style: React.CSSProperties = {
		position: 'absolute',
		left: position.x,
		top: position.y,
	};

	return (
		<DropdownMenu open onOpenChange={onOpenChange}>
			<DropdownMenuContent style={style} className="w-48" onContextMenu={(e) => e.preventDefault()}>
				<DropdownMenuItem variant="destructive" onClick={deleteNode}>
					<Trash2 className="size-3" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
