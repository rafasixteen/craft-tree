import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

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
			<body className={cn(geistSans.variable, geistMono.variable, 'antialiased flex h-screen')}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<SidebarProvider defaultOpen={true}>
						<AppSidebar side="left" variant="sidebar" collapsible="offExamples" />
						<div className="flex flex-col flex-1 ">
							<Header />
							<main className="flex-1 overflow-y-auto">{children}</main>
							<Footer />
						</div>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}

function Header()
{
	return (
		<header className="flex items-center px-4 py-2 border-b justify-between h-16">
			<SidebarTrigger />
			<ThemeToggle />
		</header>
	);
}

function Footer()
{
	return <footer className="flex items-center justify-center px-4 py-2 border-t h-16">&copy; {new Date().getFullYear()} Craft Tree. All rights reserved.</footer>;
}
