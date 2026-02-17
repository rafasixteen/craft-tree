'use client';

export default function ExportInventoryPage()
{
	return (
		<div className="p-5">
			<h1 className="text-2xl font-bold">Export Inventory</h1>
			<p className="mt-2 text-muted-foreground">Export your inventory data as a JSON file.</p>
			<div className="mt-4">
				<button className="btn" onClick={() => alert('Export functionality not implemented yet.')}>
					Export Inventory
				</button>
			</div>
		</div>
	);
}
