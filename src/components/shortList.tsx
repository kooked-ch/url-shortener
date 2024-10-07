export function ShortList({ items }: { items: { url: string; slug: string; count: number }[] }) {
	return (
		<div className="flex flex-col gap-3 mt-16 w-1/5">
			<h1 className="text-3xl font-black text-center mb-2">Shorted URL</h1>
			{items.map((item, index) => (
				<div className="bg-muted rounded-md p-4 px-7 flex items-center justify-between" key={'short' + index}>
					<div>
						<div className="text-foreground font-medium">{item.slug}</div>
						<div className="text-muted-foreground text-sm">{item.url}</div>
					</div>
					<div className="flex items-center gap-2 text-lg">{item.count}</div>
				</div>
			))}
		</div>
	);
}
