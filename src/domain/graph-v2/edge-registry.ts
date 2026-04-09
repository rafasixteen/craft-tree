import { NodeType } from '@/domain/graph-v2';

export interface EdgeRegistry
{}

export type EdgeType = keyof EdgeRegistry;

type AnyEdgeDef = EdgeRegistry[keyof EdgeRegistry];

const _edgeRegistry = new Map<string, AnyEdgeDef>();

export function defineEdge<TType extends EdgeType>(def: EdgeRegistry[TType] & { type: TType })
{
	_edgeRegistry.set(def.type, def);
	return def;
}

export function getEdgeDefinition<TType extends EdgeType>(type: TType): EdgeRegistry[TType] | undefined
{
	return _edgeRegistry.get(type) as EdgeRegistry[TType] | undefined;
}

export function getEdgeDefinitions()
{
	return Array.from(_edgeRegistry.values());
}

export function resolveEdgeType(sourceType: NodeType, targetType: NodeType): EdgeType | null
{
	for (const [type, def] of _edgeRegistry)
	{
		if (def.canConnect(sourceType, targetType))
		{
			return type as EdgeType;
		}
	}

	return null;
}
