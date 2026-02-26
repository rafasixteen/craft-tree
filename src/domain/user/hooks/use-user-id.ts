'use client';

import { findUserIdByEmail } from '@/domain/user';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export function useUserId()
{
	const { data: session } = useSession();

	if (!session)
	{
		throw new Error('User is not authenticated');
	}

	const email = session.user!.email!;

	if (!email)
	{
		throw new Error('User email is not available');
	}

	const swrKey = ['userId', email];

	const { data: userId, isLoading } = useSWR(swrKey, () => findUserIdByEmail(email), {
		revalidateOnMount: false,
	});

	return {
		userId,
		isLoading,
	};
}
