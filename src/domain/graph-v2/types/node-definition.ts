import { NodeExecutor } from '@/domain/graph-v2';
import { z } from 'zod';

export type SchemaMap = Record<string, z.ZodTypeAny>;

type IsAny<T> = 0 extends 1 & T ? true : false;

type Infer<T extends SchemaMap | undefined> =
	IsAny<T> extends true ? any : T extends SchemaMap ? { [K in keyof T]: z.infer<T[K]> } : undefined;

export type AnyNodeDefinition = NodeDefinition<any, any, any>;

export type InferNodeInputs<T extends AnyNodeDefinition> = Infer<T['inputs']>;

export type InferNodeOutputs<T extends AnyNodeDefinition> = Infer<T['outputs']>;

export type InferNodeConfig<T extends AnyNodeDefinition> = Infer<T['config']>;

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
