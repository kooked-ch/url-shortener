'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 md:px-6 py-12 md:py-24 lg:py-32 text-center">
			<div className="max-w-md space-y-4">
				<h1 className="text-8xl font-bold">404</h1>
				<p className="text-lg text-muted-foreground">Oops, the page you were looking for doesn't exist.</p>
				<Button>
					<Link href="/">Return Home</Link>
				</Button>
			</div>
		</div>
	);
}
