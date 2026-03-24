import { Card } from '@/components/ui/card';

import React from 'react';

interface NodeContextMenuProps extends React.HTMLAttributes<HTMLDivElement>
{
	id: string;
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}

export function NodeContextMenu({ id, top, left, right, bottom, ...props }: NodeContextMenuProps)
{
	const style: React.CSSProperties = {
		top,
		left,
		right,
		bottom,
		position: 'absolute',
		zIndex: 10,
	};

	return (
		<Card className="p-2" style={style} {...props}>
			<p>Node Context Menu - {id}</p>
		</Card>
	);
}
