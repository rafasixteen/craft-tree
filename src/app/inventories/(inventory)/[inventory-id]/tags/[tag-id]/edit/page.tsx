'use client';

import { Header } from '@/components/sidebar';
import { TagForm, TagFormValues, tagFormSchema } from '@/components/tag';

import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { updateTag, useTag } from '@/domain/tag';

import { toast } from 'sonner';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

export default function TagEditPage()
{
	const router = useRouter();
	const params = useParams();

	const tagId = params['tag-id'] as string;
	const inventoryId = params['inventory-id'] as string;

	const { tag } = useTag({ tagId });

	if (!tag)
	{
		throw new Error('Tag is null.');
	}

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

				await updateTag({ id: tagId, name });

				toast.success(`Tag '${name}' updated`);

				router.push(`/inventories/${inventoryId}/tags`);
			}
			catch
			{
				toast.error('Failed to update tag');
			}
		},
		[tagId, inventoryId, router],
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
						<Button
							type="submit"
							form="edit-tag-form"
							disabled={!form.formState.isDirty || !form.formState.isValid}
							className="flex-1"
						>
							Save Changes
						</Button>
					</Field>
				</CardFooter>
			</Card>
		</div>
	);
}
