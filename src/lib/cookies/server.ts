import { cookies } from 'next/headers';

export async function getServerCookie(name: string)
{
	const cookieStore = await cookies();
	return cookieStore.get(name);
}

export async function setServerCookie(name: string, value: string, options?: { path?: string })
{
	const cookieStore = await cookies();

	cookieStore.set(name, value, {
		path: options?.path ?? '/',
		httpOnly: false,
		sameSite: 'lax',
	});
}

export async function deleteServerCookie(name: string)
{
	const cookieStore = await cookies();
	cookieStore.delete(name);
}
