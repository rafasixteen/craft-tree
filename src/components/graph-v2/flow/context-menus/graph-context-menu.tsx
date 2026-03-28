import { nodeRegistry, NodeType } from '@/domain/graph-v2';
import { Node, useReactFlow } from '@xyflow/react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Plus, LayoutGrid } from 'lucide-react';
import { useCallback } from 'react';
import { getDefaultConfig } from '@/domain/graph-v2';
import { useLayoutGraph } from '@/components/graph-v2';

export interface GraphContextMenuProps
{
	type: 'graph';
	position: { x: number; y: number };
	close: () => void;
}

export function GraphContextMenu({ position, close }: GraphContextMenuProps)
{
	const { screenToFlowPosition, addNodes } = useReactFlow();
	const { layout } = useLayoutGraph();

	const onOpenChange = useCallback(
		function onOpenChange(open: boolean)
		{
			if (!open) close();
		},
		[close],
	);

	const addNode = useCallback(
		function addNode(type: NodeType)
		{
			const id = crypto.randomUUID();
			const nodeDef = nodeRegistry[type];
			const data = getDefaultConfig(nodeDef);

			const node: Node = {
				id: `${type}-${id}`,
				type,
				position: screenToFlowPosition(position),
				data,
			};

			addNodes([node]);
		},
		[position, screenToFlowPosition, addNodes],
	);

	const style: React.CSSProperties = {
		position: 'absolute',
		left: position.x,
		top: position.y,
	};

	return (
		<DropdownMenu open onOpenChange={onOpenChange}>
			<DropdownMenuContent style={style} className="w-48" onContextMenu={(e) => e.preventDefault()}>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Plus className="size-3 text-muted-foreground" />
						Add Node
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{Object.keys(nodeRegistry).map((type) => (
							<DropdownMenuItem key={type} onClick={() => addNode(type as NodeType)}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={layout}>
					<LayoutGrid className="size-3 text-muted-foreground" />
					Layout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
