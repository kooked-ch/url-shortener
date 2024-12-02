'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Copy, LogOut, Share, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Session } from 'next-auth';

export default function ShortForm({ baseUrl, session }: { baseUrl: string; session: Session | null }) {
	const [longUrl, setLongUrl] = useState<string>('');
	const [shortUrl, setShortUrl] = useState<string>('');
	const [shortenedUrls, setShortenedUrls] = useState<string[]>([]);
	const [longUrlError, setLongUrlError] = useState<string>('');
	const [shortUrlError, setShortUrlError] = useState<string>('');

	const handleLongUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLongUrl(e.target.value);
		if (longUrlError) {
			setLongUrlError('');
		}

		if (/^(http|https):\/\/[^ "]+$/.test(e.target.value)) {
			setLongUrlError('');
		}
	};

	const handleShortUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShortUrl(e.target.value);
		if (shortUrlError && e.target.value) {
			setShortUrlError('');
		}
	};

	const createRedirect = async () => {
		if (!longUrl) {
			setLongUrlError('Please enter a long URL');
			return;
		}

		if (!shortUrl) {
			setShortUrlError('Please enter a short URL');
			return;
		}

		if (!/^(http|https):\/\/[^ "]+$/.test(longUrl)) {
			setLongUrlError('Please enter a valid URL');
			return;
		}

		if (longUrl.includes(baseUrl)) {
			setLongUrlError('Cannot shorten this URL');
			return;
		}

		const response = await fetch('/api/redirect', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ longUrl, shortUrl }),
		});

		if (response.ok) {
			const data = await response.json();
			setShortenedUrls([...shortenedUrls, baseUrl + '/' + shortUrl]);
			setLongUrl('');
			setShortUrl('');
		} else {
			const data = await response.json();
			if (data.error === 'Short URL already exists') {
				setShortUrlError('Short URL already exists');
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<div className="max-w-md w-full space-y-6 px-4">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">URL Shortener</h1>
					<p className="mt-2 text-muted-foreground">Shorten your long URLs with our sleek and modern tool.</p>
				</div>
				<div className="grid gap-4">
					<div>
						<Input value={longUrl} onChange={handleLongUrlChange} type="text" placeholder="Enter your long URL" className={`px-4 py-3 rounded-md border ${longUrlError ? 'border-red-500' : 'border-input'} bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary-foreground flex-grow`} />
						{longUrlError && <span className="text-red-500 text-sm">{longUrlError}</span>}
					</div>
					<div>
						<div className="flex items-center">
							<p className="mr-2">{baseUrl}/</p>
							<Input value={shortUrl} onChange={handleShortUrlChange} type="text" className={`px-4 py-3 bg-background rounded-md border ${shortUrlError ? 'border-red-500' : 'border-input'} text-foreground focus:border-primary focus:ring-1 focus:ring-primary-foreground`} />
						</div>
						{shortUrlError && <span className="text-red-500 text-sm">{shortUrlError}</span>}
					</div>
					<Button onClick={createRedirect} className="px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary-foreground">
						Shorten URL
					</Button>
				</div>
				{shortenedUrls.length > 0 && (
					<div className="space-y-2">
						{shortenedUrls.map((url, index) => (
							<div className="bg-muted rounded-md p-4 flex items-center justify-between" key={'short' + index}>
								<div className="text-foreground font-medium">{url}</div>
								<div className="flex items-center gap-2">
									<Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
										<Copy className="w-5 h-5" />
										<span className="sr-only">Copy</span>
									</Button>
									<Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
										<Share className="w-5 h-5" />
										<span className="sr-only">Share</span>
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
