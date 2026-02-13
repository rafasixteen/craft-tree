import { useInventory } from '@/domain/inventory';
import { ItemCard } from '@/components/inventory';
import { Card } from '@/components/ui/card';

export function ItemGrid()
{
	const { items } = useInventory();

	const style: React.CSSProperties = {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(256px, 1fr))',
	};

	return (
		<Card className="p-4" style={style}>
			{items.map((item) => (
				<ItemCard key={item.id} item={item} />
			))}
		</Card>
	);
}
