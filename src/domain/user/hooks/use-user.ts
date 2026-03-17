'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUser(): User | null
{
	const [user, setUser] = useState<User | null>(null);

	useEffect(() =>
	{
		const supabase = createClient();

		supabase.auth.getSession().then(({ data: { session } }) =>
		{
			setUser(session?.user ?? null);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_, session) =>
		{
			setUser(session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, []);

	return user;
}
