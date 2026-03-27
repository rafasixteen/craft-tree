import { nodeRegistry, NodeType } from '@/domain/graph-v2';

interface GraphContextMenuProps
{
	position: { x: number; y: number };
	onAdd: (type: NodeType, position: { x: number; y: number }) => void;
	onClose: () => void;
}

export function GraphContextMenu({ position, onAdd, onClose }: GraphContextMenuProps)
{
	return (
		<div style={{ left: position.x, top: position.y }}>
			{Object.keys(nodeRegistry).map((type) => (
				<button
					key={type}
					onClick={() =>
					{
						onAdd(type as NodeType, position);
						onClose();
					}}
				>
					Add {type}
				</button>
			))}
		</div>
	);
}
