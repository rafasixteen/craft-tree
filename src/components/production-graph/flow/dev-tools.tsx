'use client';

import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { NodeInspector } from '@/components/production-graph';
import { Button } from '@/components/ui/button';

export function DevTools()
{
	const [nodeInspectorActive, setNodeInspectorActive] = useState<boolean>(false);

	return (
		<div>
			<Panel position="top-left">
				<Button onClick={() => setNodeInspectorActive((a) => !a)}>Node Inspector</Button>
			</Panel>
			{nodeInspectorActive && <NodeInspector />}
		</div>
	);
}
