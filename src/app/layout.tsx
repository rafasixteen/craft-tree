import { Metadata } from 'next';
import { ApolloProviderWrapper } from '@/components/ApolloProviderWrapper';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import './globals.css';

export const metadata: Metadata = {
	title: 'Craft Tree',
};

export default function RootLayout({ children }: { children: React.ReactNode })
{
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex h-screen">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ApolloProviderWrapper>
						<SidebarProvider defaultOpen={true}>
							<div className="flex flex-1 min-h-0">
								<AppSidebar side="left" variant="sidebar" collapsible="offcanvas" />

								<div className="flex flex-col flex-1 min-h-0">
									<Header />
									<main className="flex-1 min-h-0">{children}</main>
									<Footer />
								</div>
							</div>
						</SidebarProvider>
					</ApolloProviderWrapper>
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
