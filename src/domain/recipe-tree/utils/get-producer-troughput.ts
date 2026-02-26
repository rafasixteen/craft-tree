import { ProductionRate, TimeUnit, convertProductionRate } from '@/domain/production-graph';
import { Producer, ProducerOutput } from '@/domain/producer';

export function getProducerThroughput(producer: Producer, output: ProducerOutput, unit: TimeUnit): ProductionRate
{
	const quantityPerSecond = output.quantity / producer.time;
	const rate: ProductionRate = { amount: quantityPerSecond, per: 'second' };
	return convertProductionRate(rate, unit);
}
