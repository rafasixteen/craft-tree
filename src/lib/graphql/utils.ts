if (!process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT)
{
	throw new Error("'NEXT_PUBLIC_GRAPHQL_ENDPOINT' is not defined in environment variables");
}

export const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export type Selection = {
	[field: string]: true | false | Selection;
};

export function buildSelection(selection: Selection, seen = new WeakSet()): string
{
	if (!selection || typeof selection !== 'object') return '';
	if (seen.has(selection)) return '';
	seen.add(selection);

	return Object.entries(selection)
		.map(([key, value]) =>
		{
			if (value === true) return key;
			if (value === false) return '';
			if (value && typeof value === 'object') return `${key} { ${buildSelection(value, seen)} }`;
			return '';
		})
		.filter(Boolean)
		.join(' ');
}
