import { NavigationMenu } from 'radix-ui';
import styles from './navbar.module.css';

export default function Navbar()
{
	return (
		<NavigationMenu.Root className={styles.navbar} orientation="horizontal" dir="ltr">
			<NavigationMenu.List className={styles.list}>
				<NavigationMenu.Item>
					<NavigationMenu.Link asChild href="/items">
						<a className={styles.button}>Items</a>
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link asChild href="/about">
						<a className={styles.button}>About</a>
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	);
}
