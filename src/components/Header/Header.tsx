import Link from 'next/link';
import { Navbar } from '@components/Navbar';

export default function Header()
{
	return (
		<>
			<h1>
				<Link href="/">Craft Tree</Link>
			</h1>
			<Navbar />
		</>
	);
}
