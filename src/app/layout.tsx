import './globals.css';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Craft Tree',
};

export default async function RootLayout({ children }: LayoutProps<'/'>)
{
	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body className={cn(geistSans.variable, geistMono.variable, 'flex h-screen')}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
