import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Copy, Share, UserRound } from 'lucide-react';

export default function MainPage() {
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
							<Copy className="w-5 h-5" />
							<span className="sr-only">Copy</span>
						</Button>
						<Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50">
							<Share className="w-5 h-5" />
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
			<div className="absolute justify-center w-full flex bottom-1 text-muted-foreground opacity-50">
				<Link href="/login" className="flex items-center gap-1">
					<UserRound className="w-4 h-4" />
					<p>Login</p>
				</Link>
			</div>
		</div>
	);
}
