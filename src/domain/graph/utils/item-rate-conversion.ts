import { convertProductionRate, ItemRate, TimeUnit } from '@/domain/graph';

export function convertItemRate(rate: ItemRate, to: TimeUnit): ItemRate
{
	const convertedRate = convertProductionRate({ amount: rate.amount, per: rate.per }, to);
	return { itemId: rate.itemId, amount: convertedRate.amount, per: convertedRate.per };
}
