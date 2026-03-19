export interface ResourceReference
{
	type: string;
	label: string;
	count: number;
	critical?: boolean; // Marks cascades that destroy data permanently
}
