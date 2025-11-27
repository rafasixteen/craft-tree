import type { Metadata } from 'next';
import { ApolloProviderWrapper } from '@/components/ApolloProviderWrapper';
import Header from '@components/Header';
import Footer from '@components/Footer';
import './globals.css';

export const metadata: Metadata = {
	title: 'Craft Tree',
};

export default function RootLayout({ children }: { children: React.ReactNode })
{
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</head>
			<body className="root-layout">
				<ApolloProviderWrapper>
					<header className="header">
						<Header />
					</header>

					<main className="main">{children}</main>

					<footer className="footer">
						<Footer />
					</footer>
				</ApolloProviderWrapper>
			</body>
		</html>
	);
}
