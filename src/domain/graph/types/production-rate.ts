export type TimeUnit = 'second' | 'minute' | 'hour';

export interface ProductionRate
{
	amount: number;
	per: TimeUnit;
}
