import { EdgeStatus } from '@/components/production-graph/flow/types';
import {
	convertProductionRate,
	ProductionRate,
} from '@/domain/production-graph';
import { useDemand, useSupply } from '@/components/production-graph/flow/hooks';

type UseEdgeStatusParams = Parameters<typeof useSupply>[0] &
	Parameters<typeof useDemand>[0];

export function useEdgeStatus({
	sourceNodeId,
	targetNodeId,
	sourceHandleId,
	targetHandleId,
}: UseEdgeStatusParams): EdgeStatus
{
	const supply = useSupply({ sourceNodeId, sourceHandleId });
	const demand = useDemand({ targetNodeId, targetHandleId });

	if (!supply || !demand)
	{
		return 'invalid';
	}

	if (supply.itemId !== demand.itemId)
	{
		return 'invalid';
	}

	const supplyRate: ProductionRate = {
		amount: supply.amount,
		per: supply.per,
	};

	const demandRate: ProductionRate = {
		amount: demand.amount,
		per: demand.per,
	};

	const supplyRateSec = convertProductionRate(supplyRate, 'second');
	const demandRateSec = convertProductionRate(demandRate, 'second');

	if (supplyRateSec.amount < demandRateSec.amount)
	{
		return 'insufficient';
	}

	return 'valid';
}
