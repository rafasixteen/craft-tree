import { z } from 'zod';
import { AnyNodeDefinition } from '@/domain/graph-v2';

export function getDefaultConfig(def: AnyNodeDefinition): Record<string, unknown>
{
	if (!def.config)
	{
		return {};
	}

	const configShape = def.config as Record<string, z.ZodTypeAny>;
	const defaultConfig: Record<string, unknown> = {};

	for (const [key, schema] of Object.entries(configShape))
	{
		defaultConfig[key] = getDefaultForSchema(schema);
	}

	return defaultConfig;
}

function getDefaultForSchema(schema: z.ZodType): unknown
{
	// If the schema has a default, use it
	if (schema instanceof z.ZodDefault)
	{
		return schema.def.defaultValue;
	}

	// Unwrap optional/nullable and recurse
	if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable)
	{
		return undefined;
	}

	// Primitives
	if (schema instanceof z.ZodString) return '';
	if (schema instanceof z.ZodNumber) return 0;
	if (schema instanceof z.ZodBoolean) return false;

	// Arrays — empty by default
	if (schema instanceof z.ZodArray) return [];

	// Objects — recurse into shape
	if (schema instanceof z.ZodObject)
	{
		return Object.fromEntries(
			Object.entries(schema.shape).map(([k, v]) => [k, getDefaultForSchema(v as z.ZodTypeAny)]),
		);
	}

	return undefined;
}
