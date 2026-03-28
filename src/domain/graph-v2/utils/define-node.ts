import { SchemaMap, NodeDefinition } from '@/domain/graph-v2';

export function defineNode<
	TInputs extends SchemaMap | undefined,
	TOutputs extends SchemaMap | undefined,
	TConfig extends SchemaMap | undefined,
>(def: NodeDefinition<TInputs, TOutputs, TConfig>)
{
	return def;
}
