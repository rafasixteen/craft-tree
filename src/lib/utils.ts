import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugifyLib from 'slugify';

export function cn(...inputs: ClassValue[])
{
	return twMerge(clsx(inputs));
}

export function slugify(text: string): string
{
	return slugifyLib(text, { lower: true, strict: true });
}

export function deslugify(slug: string): string
{
	return slug
		.split('-')
		.map((word) =>
		{
			// Keep pure numbers as-is (e.g. "2")
			if (/^\d+$/.test(word)) return word;

			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
}
