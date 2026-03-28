'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GraphData, runGraph } from '@/domain/graph-v2';

type GraphOutputs = Map<string, Record<string, unknown>>;

const GraphExecutionContext = createContext<GraphOutputs>(new Map());

interface GraphExecutionProviderProps
{
	graph: GraphData;
	children: React.ReactNode;
}

export function GraphExecutionProvider({ graph, children }: GraphExecutionProviderProps)
{
	const [outputs, setOutputs] = useState<GraphOutputs>(new Map());

	useEffect(() =>
	{
		runGraph(graph).then(setOutputs).catch(console.error);
	}, [graph]);

	return <GraphExecutionContext.Provider value={outputs}>{children}</GraphExecutionContext.Provider>;
}

export function useNodeOutput(nodeId: string): Record<string, unknown> | undefined
{
	return useContext(GraphExecutionContext).get(nodeId);
}
