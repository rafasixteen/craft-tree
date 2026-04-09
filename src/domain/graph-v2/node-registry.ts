export interface NodeRegistry
{}

export type NodeType = keyof NodeRegistry;

export type NodeInput<T extends NodeType> = NodeRegistry[T] extends { input: infer I } ? I : never;

export type NodeOutput<T extends NodeType> = NodeRegistry[T] extends { output: infer O } ? O : never;

export type NodeConfig<T extends NodeType> = NodeRegistry[T] extends { config: infer C } ? C : never;

export type NodeInputs = {
	[K in keyof NodeRegistry]: { type: K } & (NodeRegistry[K] extends { input: infer I } ? I : never);
}[keyof NodeRegistry];

export type NodeOutputs = {
	[K in keyof NodeRegistry]: { type: K } & (NodeRegistry[K] extends { output: infer O } ? O : never);
}[keyof NodeRegistry];

export type NodeConfigs = {
	[K in keyof NodeRegistry]: { type: K } & (NodeRegistry[K] extends { config: infer C } ? C : never);
}[keyof NodeRegistry];

interface DefineNodeParams<TType extends NodeType>
{
	type: TType;
	getDefaultConfig: () => NodeConfig<TType>;
	parseInputs?: (upstreamOutputs: NodeOutputs[]) => NodeInput<TType>;
	executor: (input: NodeInput<TType>, config: NodeConfig<TType>) => Promise<NodeOutput<TType>> | NodeOutput<TType>;
}

export function defineNode<TType extends NodeType>(def: DefineNodeParams<TType>)
{
	_nodeRegistry.set(def.type, def);
	return def;
}

type AnyNodeDef = DefineNodeParams<any>;

const _nodeRegistry = new Map<string, AnyNodeDef>();

export function getNodeDefinition<TType extends NodeType>(type: TType): DefineNodeParams<TType> | undefined
{
	return _nodeRegistry.get(type) as DefineNodeParams<TType> | undefined;
}

export function getNodeDefinitions()
{
	return Array.from(_nodeRegistry.values());
}

export function isNodeType(type?: string | null): type is NodeType
{
	if (!type)
	{
		return false;
	}

	return _nodeRegistry.has(type);
}
