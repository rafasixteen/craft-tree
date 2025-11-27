export function setCookie(name: string, value: string | number | boolean, options?: { days?: number; path?: string })
{
	let cookieStr = `${name}=${encodeURIComponent(value)};`;

	if (options?.days !== undefined)
	{
		const expires = new Date(Date.now() + options.days * 86400000).toUTCString();
		cookieStr += ` expires=${expires};`;
	}

	cookieStr += ` path=${options?.path ?? '/'}`;
	document.cookie = cookieStr;
}

export function getCookie(name: string): string | null
{
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
}

export function deleteCookie(name: string)
{
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
