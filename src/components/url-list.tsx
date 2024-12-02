'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { urlsType } from '@/types/url';
import { cn } from '@/lib/utils';

export function UrlList({ urls }: { urls: urlsType[] }) {
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [loading, setLoading] = useState(true);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof (typeof urls)[0];
		direction: 'asc' | 'desc';
	} | null>(null);

	useEffect(() => {
		const calculateItemsPerPage = () => {
			const rowHeight = 75;

			const availableHeight = window.innerHeight - 250;
			const calculatedItemsPerPage = Math.max(5, Math.floor(availableHeight / rowHeight));
			setItemsPerPage(calculatedItemsPerPage);
		};

		calculateItemsPerPage();
		window.addEventListener('resize', calculateItemsPerPage);

		setLoading(false);

		return () => window.removeEventListener('resize', calculateItemsPerPage);
	}, []);

	const handleSort = (key: keyof (typeof urls)[0]) => {
		setSortConfig((current) => ({
			key,
			direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const sortedUrls = [...urls].sort((a, b) => {
		if (!sortConfig) return 0;

		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];

		if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
		return 0;
	});

	const filteredUrls = sortedUrls.filter((url) => url.shortUrl.toLowerCase().includes(search.toLowerCase()) || url.longUrl.toLowerCase().includes(search.toLowerCase()));

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentUrls = filteredUrls.slice(indexOfFirstItem, indexOfLastItem);

	const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
	};

	if (loading) {
		return (
			<div className="w-full flex justify-center items-center">
				<Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="w-full flex justify-end">
			<div className="w-full px-8 py-6 space-y-4">
				<h1 className="text-3xl font-bold">URL List</h1>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search URLs..."
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setCurrentPage(1);
						}}
						className="pl-10"
					/>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('shortUrl')}>
									Short URL
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('longUrl')}>
									Original URL
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('creationDate')}>
									Created
								</TableHead>
								<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('hits')}>
									Hits
								</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{currentUrls.map((url) => (
								<TableRow key={url.id}>
									<TableCell className="font-medium">{url.shortUrl}</TableCell>
									<TableCell className="max-w-md truncate">{url.longUrl}</TableCell>
									<TableCell>{formatDistanceToNow(url.creationDate, { addSuffix: true })}</TableCell>
									<TableCell>{url.hits}</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button variant="ghost" size="icon" onClick={() => copyToClipboard(url.shortUrl)}>
												<Copy className="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="icon" onClick={() => window.open(url.longUrl, '_blank')}>
												<ExternalLink className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Pagination Controls */}
				<div className="flex justify-center items-center space-x-2 mt-4">
					<Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="text-sm">
						Page {currentPage} of {totalPages}
					</span>
					<Button variant="outline" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
