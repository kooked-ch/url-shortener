'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Loader2, Search, ChevronLeft, ChevronRight, Trash2, Edit, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { urlsType } from '@/types/url';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function UrlList({ urls, onDelete, onEdit }: { urls: urlsType[]; onDelete?: (id: string) => void; onEdit?: (id: string, newLongUrl: string) => void }) {
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [editError, setEditError] = useState('');
	const [loading, setLoading] = useState(true);
	const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
	const [sortConfig, setSortConfig] = useState<{
		key: keyof (typeof urls)[0];
		direction: 'asc' | 'desc';
	} | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedUrl, setSelectedUrl] = useState<urlsType | null>(null);
	const [editedLongUrl, setEditedLongUrl] = useState('');

	const router = useRouter();

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

	const copyToClipboard = (text: string, index: string) => {
		setCopiedIndex(index);
		setTimeout(() => setCopiedIndex(null), 3000);
		navigator.clipboard.writeText(text);
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
	};

	const openDeleteModal = (url: urlsType) => {
		setSelectedUrl(url);
		setDeleteModalOpen(true);
	};

	const handleDelete = () => {
		if (!selectedUrl) return;

		fetch(`/api/redirect/${selectedUrl.id}`, {
			method: 'DELETE',
		}).then((res) => {
			if (res.ok) {
				router.refresh();
				onDelete && onDelete(selectedUrl.id);
				setDeleteModalOpen(false);
			}
		});
	};

	const openEditModal = (url: urlsType) => {
		setSelectedUrl(url);
		setEditedLongUrl(url.longUrl);
		setEditModalOpen(true);
	};

	const handleEdit = () => {
		console.log(editedLongUrl);
		if (!editedLongUrl) return setEditError('Please enter a URL');
		if (!/^(http|https):\/\/[^ "]+$/.test(editedLongUrl)) return setEditError('Please enter a valid URL');

		fetch(`/api/redirect/${selectedUrl?.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ longUrl: editedLongUrl }),
		}).then((res) => {
			if (res.ok) {
				router.refresh();
				setEditModalOpen(false);
				setEditError('');
			} else {
				setEditError('Error updating URL');
			}
		});
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
				<h1 className="text-3xl font-bold">URLs List</h1>
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
									<TableCell className="flex gap-2 w-60">
										{copiedIndex === url.id ? (
											<Button variant="ghost" size="icon" className="disabled:opacity-100" disabled>
												<Check className="text-green-500 w-4 h-4" />
											</Button>
										) : (
											<Button variant="ghost" size="icon" className="hover:bg-secondary/50" onClick={() => copyToClipboard(url.shortUrl, url.id)}>
												<Copy className="w-4 h-4" />
											</Button>
										)}
										<Button variant="ghost" size="icon" className="hover:bg-secondary/50" onClick={() => window.open(url.longUrl, '_blank')}>
											<ExternalLink className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="icon" className="hover:bg-secondary/50" onClick={() => openEditModal(url)}>
											<Edit className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="icon" className="hover:bg-secondary/50" onClick={() => openDeleteModal(url)}>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
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

				{/* Delete Confirmation Modal */}
				<Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete URL</DialogTitle>
							<DialogDescription>Are you sure you want to delete the short URL {selectedUrl?.shortUrl}?</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={handleDelete}>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Edit URL Modal */}
				<Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Edit URL</DialogTitle>
							<DialogDescription>
								Edit the original long URL for <strong>{selectedUrl?.shortUrl}</strong>
							</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<Input className={cn(editError && 'border-red-500 focus-visible:ring-0 ring-offset-0')} value={editedLongUrl} onChange={(e) => setEditedLongUrl(e.target.value)} placeholder="Enter new long URL" />
							{editError && <p className="text-red-500 text-sm mt-1">{editError}</p>}
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setEditModalOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleEdit}>Save Changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
