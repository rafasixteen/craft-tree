import { ProductionRate, TimeUnit } from '@/domain/production-graph';

const SECONDS_PER_UNIT: Record<TimeUnit, number> = {
	second: 1,
	minute: 60,
	hour: 3600,
};

export function convertProductionRate(rate: ProductionRate, to: TimeUnit): ProductionRate
{
	// No conversion needed
	if (rate.per === to)
	{
		return rate;
	}

	// Convert between time units
	const perSecond = rate.amount / SECONDS_PER_UNIT[rate.per];
	const convertedAmount = perSecond * SECONDS_PER_UNIT[to];

	return { amount: convertedAmount, per: to };
}
