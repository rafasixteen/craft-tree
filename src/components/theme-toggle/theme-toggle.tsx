'use client';

import { Button } from '@/components/ui/button';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle(props: React.ComponentPropsWithoutRef<typeof Button>)
{
	const { theme, setTheme } = useTheme();

	const isDark = theme === 'dark';
	const next = isDark ? 'light' : 'dark';

	function toggleTheme()
	{
		setTheme(next);
		setThemeCookie(next);
	}

	return (
		<Button onClick={toggleTheme} {...props}>
			<Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}

function setThemeCookie(value: 'light' | 'dark')
{
	document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`;
}
