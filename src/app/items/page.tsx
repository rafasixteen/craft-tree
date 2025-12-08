import { ItemTree } from '@/components/Items';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function ItemsPage()
{
	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel minSize={25} defaultSize={25}>
				<ItemTree />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel minSize={40} defaultSize={75}>
				<div className="flex h-full items-center justify-center p-6">
					<span className="font-semibold">2</span>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
