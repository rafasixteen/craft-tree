export function uploadJson<T>(file: File): Promise<T>
{
	return new Promise((resolve, reject) =>
	{
		const reader = new FileReader();

		reader.onload = (e) =>
		{
			try
			{
				const parsed = JSON.parse(e.target?.result as string);
				resolve(parsed as T);
			}
			catch
			{
				reject(new Error('Invalid JSON file'));
			}
		};

		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsText(file);
	});
}
