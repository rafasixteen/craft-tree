import { EdgeStatus } from '@/components/production-graph/types';
import { convertProductionRate } from '@/domain/production-graph';
import { useDemand, useSupply } from '@/components/production-graph/hooks';

type UseEdgeStatusParams = Parameters<typeof useSupply>[0] & Parameters<typeof useDemand>[0];

export function useEdgeStatus({ sourceNodeId, targetNodeId, sourceHandleId, targetHandleId }: UseEdgeStatusParams): EdgeStatus
{
	const source = useSupply({ sourceNodeId, sourceHandleId });
	const required = useDemand({ targetNodeId, targetHandleId });

	if (!source || !required)
	{
		return 'invalid';
	}

	if (source.itemId !== required.itemId)
	{
		return 'invalid';
	}

	const supply = convertProductionRate(source.rate, 'second');
	const demand = convertProductionRate(required.rate, 'second');

	if (supply.amount < demand.amount)
	{
		return 'insufficient';
	}

	return 'valid';
}
