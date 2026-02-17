'use client';

export default function ImportInventoryPage()
{
	return (
		<div className="p-5">
			<h1 className="text-2xl font-bold">Import Inventory</h1>
			<p className="mt-2 text-muted-foreground">Import your inventory data as a JSON file.</p>
			<div className="mt-4">
				<button className="btn" onClick={() => alert('Import functionality not implemented yet.')}>
					Import Inventory
				</button>
			</div>
		</div>
	);
}
