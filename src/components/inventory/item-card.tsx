import { Card } from '@/components/ui/card';
import { Item } from '@/domain/item';
import { Checkbox } from '@/components/ui/checkbox';
import { useItemSelection } from './hooks/use-item-selection';

interface ItemCardProps extends React.ComponentProps<typeof Card> {
	item: Item;
	selected?: boolean;
}

export function ItemCard({ item, selected, ...props }: ItemCardProps) {
       const { selectedIds, toggleSelection } = useItemSelection();
       const anySelected = selectedIds.length > 0;
       return (
	       <Card
		       {...props}
		       style={{
			       outline: selected ? '2px solid var(--primary)' : undefined,
			       ...props.style,
		       }}
		       tabIndex={0}
		       aria-pressed={selected}
	       >
		       <div className="flex items-center gap-2">
			       {anySelected && (
				       <Checkbox
					       checked={selected}
					       onCheckedChange={() => toggleSelection(item.id)}
					       tabIndex={-1}
					       onClick={e => e.stopPropagation()}
				       />
			       )}
			       <p className="select-none">{item.name}</p>
		       </div>
	       </Card>
       );
}
