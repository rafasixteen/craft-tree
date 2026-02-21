export type TimeUnit = 'second' | 'minute' | 'hour';

export type ProductionRate = {
	amount: number;
	per: TimeUnit;
};
