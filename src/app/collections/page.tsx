'use server';

import { auth } from '@/auth';
import { createCollection, getUserCollections } from '@/domain/collection';
import { getUserIdFromEmail } from '@/domain/user';
import { redirect } from 'next/navigation';

export default async function Page()
{
	const session = await auth();
	if (!session) redirect('/sign-in');

	const userId = await getUserIdFromEmail(session!.user!.email!);
	const collections = await getUserCollections(userId);

	const firstCollection = collections[0] ?? (await createCollection({ name: 'New Collection', userId }));
	redirect(`/collections/${firstCollection.slug}`);
}
