'use client';

import useSWR from 'swr';
import { getProducerById, getProducerInputs, getProducerOutputs, getProducerTags } from '@/domain/producer';

interface UseProducerParams extends Partial<Parameters<typeof getProducerById>[0]>
{
	include?: {
		inputs?: boolean;
		outputs?: boolean;
		tags?: boolean;
	};
}

export function useProducer({ producerId, include }: UseProducerParams)
{
	const withInputs = include?.inputs ?? false;
	const withOutputs = include?.outputs ?? false;
	const withTags = include?.tags ?? false;

	const swrKey = producerId ? ['producer', producerId, withInputs, withOutputs, withTags] : null;
	const fetcher = () =>
	{
		if (!producerId)
		{
			return null;
		}

		return Promise.all([
			getProducerById({ producerId }),
			withInputs ? getProducerInputs({ producerId }) : null,
			withOutputs ? getProducerOutputs({ producerId }) : null,
			withTags ? getProducerTags({ producerId }) : null,
		]);
	};

	const { data, isLoading, isValidating } = useSWR(swrKey, fetcher);

	return {
		producer: data?.[0],
		inputs: data?.[1],
		outputs: data?.[2],
		tags: data?.[3],
		isLoading,
		isValidating,
	};
}
