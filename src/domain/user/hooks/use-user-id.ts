'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function useUserId()
{
	const supabase = createClient();

	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() =>
	{
		supabase.auth.getClaims().then(({ data }) =>
		{
			setUserId(data?.claims?.id ?? null);
		});
	}, []);

	return { userId };
}
