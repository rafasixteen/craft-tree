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

export function formatNumber(num: number, decimals: number = 2): string
{
	return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(decimals)).toString();
}
