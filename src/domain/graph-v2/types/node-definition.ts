import { NodeExecutor } from '@/domain/graph-v2';
import { z } from 'zod';

type SchemaMap = Record<string, z.ZodTypeAny>;

type Infer<T extends SchemaMap | undefined> = T extends SchemaMap ? { [K in keyof T]: z.infer<T[K]> } : undefined;

export type NodeDefinition<
	TInputs extends SchemaMap | undefined,
	TOutputs extends SchemaMap | undefined,
	TConfig extends SchemaMap | undefined,
> = {
	inputs?: TInputs;
	outputs?: TOutputs;
	config?: TConfig;
	executor: NodeExecutor<Infer<TInputs>, Infer<TOutputs>, Infer<TConfig>>;
};

export function defineNode<
	TInputs extends SchemaMap | undefined = undefined,
	TOutputs extends SchemaMap | undefined = undefined,
	TConfig extends SchemaMap | undefined = undefined,
>(def: NodeDefinition<TInputs, TOutputs, TConfig>)
{
	return def;
}
