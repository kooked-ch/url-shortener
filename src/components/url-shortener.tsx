'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Share } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function UrlShortener({ baseUrl }: { baseUrl: string }) {
	const [longUrl, setLongUrl] = useState<string>('');
	const [shortUrl, setShortUrl] = useState<string>('');
	const [shortenedUrls, setShortenedUrls] = useState<string[]>([]);
	const [longUrlError, setLongUrlError] = useState<string>('');
	const [shortUrlError, setShortUrlError] = useState<string>('');

	const handleLongUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLongUrl(e.target.value);
		if (longUrlError) setLongUrlError('');
	};

	const handleShortUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShortUrl(e.target.value);
		if (shortUrlError) setShortUrlError('');
	};

	const createRedirect = async () => {
		if (!longUrl) return setLongUrlError('Please enter a long URL');
		if (!shortUrl) return setShortUrlError('Please enter a short URL');
		if (!/^(http|https):\/\/[^ "]+$/.test(longUrl)) return setLongUrlError('Please enter a valid URL');
		if (longUrl.includes(baseUrl)) return setLongUrlError('Cannot shorten this URL');

		const response = await fetch('/api/redirect', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ longUrl, shortUrl }),
		});

		if (response.ok) {
			setShortenedUrls([...shortenedUrls, `${baseUrl}/${shortUrl}`]);
			setLongUrl('');
			setShortUrl('');
		} else {
			const { error } = await response.json();
			if (error === 'Short URL already exists') {
				setShortUrlError('Short URL already exists');
			}
		}
	};

	return (
		<div className="flex items-center justify-center">
			<Card className="w-full max-w-2xl mx-auto">
				<CardContent className="p-6 space-y-6">
					<div className="space-y-4">
						<div>
							<Input value={longUrl} onChange={handleLongUrlChange} placeholder="Enter your long URL" className={`${longUrlError ? 'border-red-500' : 'border-input'}`} />
							{longUrlError && <p className="text-red-500 text-sm mt-1">{longUrlError}</p>}
						</div>
						<div>
							<div className="flex items-center">
								<span className="mr-2 text-sm text-muted-foreground">{baseUrl}/</span>
								<Input value={shortUrl} onChange={handleShortUrlChange} placeholder="Short URL" className={`${shortUrlError ? 'border-red-500' : 'border-input'}`} />
							</div>
							{shortUrlError && <p className="text-red-500 text-sm mt-1">{shortUrlError}</p>}
						</div>
						<Button onClick={createRedirect} className="w-full bg-primary text-primary-foreground h-12">
							Shorten URL
						</Button>
					</div>
				</CardContent>
			</Card>
			{/* Shortened URLs */}
			{shortenedUrls.length > 0 && (
				<div className="mt-6 space-y-3">
					{shortenedUrls.map((url, index) => (
						<div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
							<span className="text-sm font-medium">{url}</span>
							<div className="flex gap-2">
								<Button variant="ghost" size="icon">
									<Copy className="w-5 h-5" />
								</Button>
								<Button variant="ghost" size="icon">
									<Share className="w-5 h-5" />
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
