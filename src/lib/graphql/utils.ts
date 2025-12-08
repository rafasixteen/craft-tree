export function buildSelection<T>(fields: T[]): string
{
	return fields.join('\n');
}
