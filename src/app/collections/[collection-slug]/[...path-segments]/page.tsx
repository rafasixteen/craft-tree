'use client';

import { useTreeNodes } from '@/providers';
import { notFound, useParams } from 'next/navigation';
import { findNodeByPath, getNodePath } from '@/domain/tree';

export default function Page()
{
	const { 'path-segments': pathSegments } = useParams();

	const { nodes, isLoading } = useTreeNodes();

	if (!Array.isArray(pathSegments))
	{
		return notFound();
	}

	const node = findNodeByPath(nodes, pathSegments);

	const nodePath = getNodePath(nodes, node!);

	if (isLoading)
	{
		return <p>Loading...</p>;
	}

	if (!node)
	{
		return (
			<div>
				<p>Node not found for path: {pathSegments.join('/')}</p>
			</div>
		);
	}

	return (
		<div>
			<p>Node found for path: {pathSegments.join('/')}</p>
			<br />
			<p>Path attempted: {nodePath.join('/')}</p>
		</div>
	);
}
