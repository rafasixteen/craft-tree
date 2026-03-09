'use client';

import { useNodes, ViewportPortal, useReactFlow } from '@xyflow/react';
import React from 'react';

export function NodeInspector()
{
	const { getInternalNode } = useReactFlow();
	const nodes = useNodes();

	return (
		<ViewportPortal>
			{nodes.map((node, index) =>
			{
				const internalNode = getInternalNode(node.id);

				if (!internalNode)
				{
					return null;
				}

				const absPosition = internalNode.internals.positionAbsolute;
				const height = node.measured?.height ?? 0;

				const style: React.CSSProperties = {
					position: 'absolute',
					transform: `translate(${absPosition.x}px, ${absPosition.y + height}px)`,
				};

				const info = {
					id: node.id,
					type: node.type,
					data: node.data,
				};

				return (
					<div key={index} style={style}>
						<pre>{JSON.stringify(info, null, 2)}</pre>
					</div>
				);
			})}
		</ViewportPortal>
	);
}
