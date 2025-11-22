import type { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';
import './globals.css';

export const metadata: Metadata = {
	title: 'Craft Tree',
};

export default function RootLayout({ children }: { children: React.ReactNode })
{
	return (
		<html lang="en">
			<body className="root-layout">
				<header className="header">
					<Header />
				</header>

				<main className="main">{children}</main>

				<footer className="footer">
					<Footer />
				</footer>
			</body>
		</html>
	);
}
