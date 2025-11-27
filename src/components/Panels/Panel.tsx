import { ReactNode } from 'react';

interface PanelProps
{
	children: ReactNode;
	size?: number;
	className?: string;
}

export default function Panel({ children, size = 50, className = '' }: PanelProps)
{
	const style: React.CSSProperties = {
		flexBasis: `${size}%`,
		flexGrow: 0,
		flexShrink: 0,
		display: 'flex',
	};

	return (
		<div className={className} style={style}>
			{children}
		</div>
	);
}
