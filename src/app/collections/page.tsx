'use server';

import { auth } from '@/auth';
import { getUserCollections } from '@/domain/collection';
import { getUserIdFromEmail } from '@/domain/user';
import { redirect } from 'next/navigation';

export default async function Page()
{
	const session = await auth();

	const userId = await getUserIdFromEmail(session!.user!.email!);
	const collections = await getUserCollections(userId);

	redirect(`/collections/${collections[0].slug}`);
}
