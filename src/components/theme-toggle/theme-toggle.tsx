'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle(props: React.ComponentPropsWithoutRef<typeof Button>)
{
	const { theme, setTheme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<Button onClick={() => setTheme(isDark ? 'light' : 'dark')} {...props}>
			<Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
