import type { Metadata } from 'next';
import { ApolloProviderWrapper } from '@/components/ApolloProviderWrapper';
import { ThemeProvider } from '@/components/ThemeProvider';
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
			<head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</head>
			<body className="flex flex-col h-screen">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ApolloProviderWrapper>
						<Header />
						{children}
						<Footer />
					</ApolloProviderWrapper>
				</ThemeProvider>
			</body>
		</html>
	);
}
