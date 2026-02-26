import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBillOfMaterials, useRecipeTree } from '@/domain/recipe-tree';
import { Panel } from '@xyflow/react';

export function BillOfMaterialsOverlay()
{
	const { recipeTree } = useRecipeTree();

	if (!recipeTree)
	{
		return null;
	}

	const bom = getBillOfMaterials(recipeTree);

	return (
		<Panel position="top-right" className="min-w-40">
			<Card>
				<CardHeader className="border-b">
					<CardTitle>Bill of Materials</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-1">
						{bom.map(({ item, demand }) => (
							<li key={item.id} className="flex items-center gap-2">
								<p className="text-xs">
									<span className="font-semibold">{item.name}: &nbsp;</span>
									<span className="font-medium text-primary">
										{demand.amount}/{demand.per.charAt(0)}
									</span>
								</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</Panel>
	);
}
