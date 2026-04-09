import { NodeOutputs, NodeType, defineEdge } from '@/domain/graph-v2';
import { ItemRate } from '@/domain/graph';

declare module '@/domain/graph-v2/edge-registry'
{
	interface EdgeRegistry
	{
		'item-flow': {
			canConnect: (source: NodeType, target: NodeType) => boolean;
			getRate: (output: NodeOutputs, sourceHandleId?: string | null) => ItemRate | null;
		};
	}
}

defineEdge({
	type: 'item-flow',
	canConnect: (source, target) =>
	{
		return ['item', 'producer', 'split'].includes(source) && ['producer', 'split'].includes(target);
	},
	getRate: (output, sourceHandleId) =>
	{
		if (output.type === 'item')
		{
			return output.itemRate ?? null;
		}

		if (output.type === 'producer')
		{
			return output.itemRates?.find((itemRate) => itemRate.itemId === sourceHandleId) ?? null;
		}

		if (output.type === 'split')
		{
			return output.itemRates?.[Number(sourceHandleId)] || null;
		}

		return null;
	},
});
