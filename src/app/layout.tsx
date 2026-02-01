import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { Footer, Header, ThemeProvider } from '@/components/layout';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>)
{
	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<body className={cn(geistSans.variable, geistMono.variable, 'flex h-screen antialiased')}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SessionProvider>
						<div className="flex flex-1 flex-col">
							<Header />
							<main className="min-h-0 flex-1">{children}</main>
							<Footer />
						</div>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
