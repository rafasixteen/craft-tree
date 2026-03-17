'use client';

import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/sidebar';
import { useTag } from '@/domain/tag';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { toast } from 'sonner';
import { useCallback } from 'react';
import { TagForm, TagFormValues, tagFormSchema } from '@/components/tag';

export default function TagEditPage()
{
	const router = useRouter();

	const params = useParams();
	const tagId = params['tag-id'] as string;

	const { tag, updateTag } = useTag(tagId);

	const form = useForm<TagFormValues>({
		resolver: zodResolver(tagFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: tag.name,
		},
	});

	const onSubmit = useCallback(
		async function onSubmit(values: TagFormValues)
		{
			try
			{
				const { name } = values;

				updateTag({ name });

				toast.success(`Tag '${name}' updated`);

				router.push(`/inventories/${tag.inventoryId}/tags`);
			}
			catch
			{
				toast.error('Failed to update tag');
			}
		},
		[updateTag, tag.inventoryId, router],
	);

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<Card className="flex min-h-0 flex-1 flex-col bg-transparent ring-0">
				<CardHeader>
					<CardTitle>Edit Tag</CardTitle>
					<CardDescription>Edit an existing tag.</CardDescription>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 flex-col">
					<TagForm id="edit-tag-form" form={form} onSubmit={onSubmit} />
				</CardContent>
				<CardFooter>
					<Field orientation="horizontal" className="flex w-full flex-row items-center justify-end gap-2">
						<Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
							Cancel
						</Button>
						<Button type="submit" form="edit-tag-form" disabled={!form.formState.isDirty || !form.formState.isValid} className="flex-1">
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
