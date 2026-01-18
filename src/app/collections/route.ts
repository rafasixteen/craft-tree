import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserIdFromEmail } from '@/domain/user';
import { getUserCollections, createCollection } from '@/domain/collection';

export async function GET()
{
	const session = await auth();

	if (!session?.user?.email)
	{
		return NextResponse.redirect(new URL('/sign-in', process.env.NEXT_PUBLIC_APP_URL));
	}

	const userId = await getUserIdFromEmail(session.user.email);
	const collections = await getUserCollections(userId);

	const firstCollection = collections[0] ?? (await createCollection({ name: 'New Collection', userId }));

	return NextResponse.redirect(new URL(`/collections/${firstCollection.slug}`, process.env.NEXT_PUBLIC_APP_URL));
}
