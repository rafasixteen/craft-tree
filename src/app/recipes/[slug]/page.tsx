export default async function RecipePage({ params }: { params: { slug: string } })
{
	return <div>Recipe Page for {params.slug}</div>;
}
