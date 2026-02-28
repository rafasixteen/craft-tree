import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/auth';

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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>)
{
	const session = await auth();

	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body className={cn(geistSans.variable, geistMono.variable, 'flex h-screen')}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SessionProvider session={session}>
						<TooltipProvider>{children}</TooltipProvider>
						<Toaster />
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
