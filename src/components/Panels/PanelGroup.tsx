import React, { ReactNode } from 'react';

interface PanelGroupProps
{
	children: ReactNode;
	direction?: 'horizontal' | 'vertical';
	className?: string;
}

export default function PanelGroup({ children, direction = 'horizontal', className = '' }: PanelGroupProps)
{
	const style: React.CSSProperties = {
		display: 'flex',
		flexDirection: direction === 'horizontal' ? 'row' : 'column',
		flexGrow: 1,
	};

	return (
		<div className={className} style={style}>
			{children}
		</div>
	);
}
