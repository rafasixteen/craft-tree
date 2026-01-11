import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: '404 - Page Not Found',
	description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound()
{
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<div className="flex min-h-screen flex-col items-center justify-center text-center">
						<h2 className="text-lg font-semibold">404 - Page Not Found</h2>
						<p className="text-muted-foreground">This page does not exist.</p>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
