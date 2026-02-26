import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[])
{
	return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals: number = 2): string
{
	return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(decimals)).toString();
}
