import { RowRendererProps } from 'react-arborist';
import { Node } from '@/graphql/generated/graphql';

export default function RowRenderer({ node, innerRef, attrs, children }: RowRendererProps<Node>)
{
	return (
		<div ref={innerRef} {...attrs}>
			<div>{children}</div>
		</div>
	);
}
