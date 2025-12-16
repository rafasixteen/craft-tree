import z from 'zod';

export const nameSchema = z
	.string()
	.trim()
	.transform((val) => val.split(' ').filter(Boolean).join(' '))
	.pipe(z.string().min(1, 'Name cannot be empty').max(200, 'Name is too long'));
