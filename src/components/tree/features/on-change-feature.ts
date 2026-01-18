import { FeatureImplementation } from '@headless-tree/core';

declare module '@headless-tree/core'
{
	export interface TreeConfig<T>
	{
		onChange?: () => void;
	}
}

export const onChangeFeature: FeatureImplementation = {};
