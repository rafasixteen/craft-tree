import { useCallback, useState } from 'react';
import { TimeUnit, ProductionRate, convertProductionRate } from '@/domain/recipe-tree';

export function useProductionRate(initial: ProductionRate = { amount: 1, per: 'second' })
{
	const [rate, setRate] = useState<ProductionRate>(initial);

	const setAmount = useCallback((amount: number) =>
	{
		setRate((prev) => ({ ...prev, amount }));
	}, []);

	const setUnit = useCallback((nextUnit: TimeUnit) =>
	{
		setRate((prev) =>
		{
			return convertProductionRate(prev, nextUnit);
		});
	}, []);

	return {
		rate,
		setAmount,
		setUnit,
		setRate,
	};
}
