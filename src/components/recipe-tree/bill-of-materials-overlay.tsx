import { Panel } from '@xyflow/react';
import { useBillOfMaterials } from '@/domain/recipe-tree';
import { pluralize } from '@/lib/pluralizer';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function BillOfMaterialsOverlay()
{
	const billOfMaterials = useBillOfMaterials();

	if (billOfMaterials.length === 0)
	{
		return null;
	}

	return (
		<Panel position="top-right">
			<Card>
				<CardHeader>
					<span className="text-center text-lg font-semibold">Bill Of Materials</span>
				</CardHeader>
				<Separator />
				<CardContent>
					<ul className="space-y-1">
						{billOfMaterials.map(({ item, demand }) => (
							<li key={item.id} className="flex items-center gap-2">
								<span className="font-mono font-medium text-primary">{demand.amount}x</span>
								<span className="font-semibold">{pluralize(item.name, demand.amount)}</span>
								<span className="text-sm text-muted-foreground">per {demand.per}</span>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</Panel>
	);
}
