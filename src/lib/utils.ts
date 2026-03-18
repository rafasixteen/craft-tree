import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[])
{
	return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 2): string
{
	return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(decimals)).toString();
}
