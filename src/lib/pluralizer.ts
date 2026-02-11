export function pluralize(word: string, count: number): string
{
	// Rule: "Word(s) (Something)" → "Words (Something)"
	const match = word.match(/^([A-Za-z ]+)(\s*\(.*\))$/);

	if (count === 1)
	{
		return word;
	}

	if (match)
	{
		// Pluralize the main part (before parentheses)
		const main = match[1].trim();
		let pluralMain = main;

		// Apply pluralization rules to the main part
		if (/[^aeiou]y$/i.test(main))
		{
			pluralMain = main.replace(/y$/, 'ies');
		}
		else if (/(s|x|z|ch|sh)$/i.test(main))
		{
			pluralMain = main + 'es';
		}
		else
		{
			pluralMain = main + 's';
		}

		// Ensure a space before the parentheses
		const paren = match[2].startsWith(' ') ? match[2] : ' ' + match[2];
		return pluralMain + paren;
	}

	// Rule: ends with 'y' but not 'ay', 'ey', 'iy', 'oy', 'uy' → 'ies'
	if (/[^aeiou]y$/i.test(word))
	{
		return word.replace(/y$/, 'ies');
	}

	// Rule: ends with 's', 'x', 'z', 'ch', 'sh' → add 'es'
	if (/(s|x|z|ch|sh)$/i.test(word))
	{
		return word + 'es';
	}

	// Default: add 's'
	return word + 's';
}
