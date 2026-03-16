'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUser(): User | null
{
	const [user, setUser] = useState<User | null>(null);

	const supabase = createClient();

	useEffect(() =>
	{
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
