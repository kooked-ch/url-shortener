import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Component() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<div className="max-w-md w-full space-y-6 px-4">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">URL Shortener</h1>
					<p className="mt-2 text-muted-foreground">Shorten your long URLs with our sleek and modern tool.</p>
				</div>
				<form className="grid gap-4">
					<Input type="text" placeholder="Enter your long URL" className="px-4 py-3 rounded-md border border-input bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary-foreground" />
					<Button type="submit" className="px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary-foreground">
						Shorten URL
					</Button>
				</form>
				<div className="bg-muted rounded-md p-4 flex items-center justify-between">
					<div className="text-foreground font-medium">https://example.com/abcd1234</div>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
							<CopyIcon className="w-5 h-5" />
							<span className="sr-only">Copy</span>
						</Button>
						<Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
							<ShareIcon className="w-5 h-5" />
							<span className="sr-only">Share</span>
						</Button>
					</div>
				</div>
				<div className="text-center text-sm text-muted-foreground">
					<Link href="#" className="hover:underline" prefetch={false}>
						View Analytics
					</Link>
				</div>
			</div>
		</div>
	);
}

function CopyIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
}

function ShareIcon(props) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<polyline points="16 6 12 2 8 6" />
			<line x1="12" x2="12" y1="2" y2="15" />
		</svg>
	);
}
