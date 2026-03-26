export type NodeExecutor<Input, Output, Config> = (input: Input, config: Config) => Promise<Output> | Output;
