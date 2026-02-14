import { z } from 'zod';
import { nameSchema } from '@/domain/shared';
import { Tag } from '@/domain/tag';

export const addTagFormSchema = (existingTags: Tag[]) =>
	z.object({
		name: nameSchema.refine((val) => !existingTags.some((t) => t.name.toLowerCase() === val.trim().toLowerCase()), {
			message: 'A tag with this name already exists.',
		}),
	});

export type AddTagFormValues = z.infer<ReturnType<typeof addTagFormSchema>>;
