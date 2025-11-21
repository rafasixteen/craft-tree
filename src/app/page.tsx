import { Panel, PanelGroup } from 'react-resizable-panels';
import styles from './page.module.css';

export default function Home()
{
	return (
		<main className={styles.main}>
			<PanelGroup direction="horizontal">
				<Panel defaultSize={30}>
					<div style={{ padding: '20px', background: '#f0f0f0' }}>Left Pane</div>
				</Panel>
				<Panel>
					<div style={{ padding: '20px', background: '#fff', borderLeft: '1px solid #ccc' }}>Right Pane</div>
				</Panel>
			</PanelGroup>
		</main>
	);
}
