import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ApolloProviderWrapper } from '@/components/ApolloProviderWrapper';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
