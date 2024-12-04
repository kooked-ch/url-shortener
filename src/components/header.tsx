'use server';

import { getServerSession, Session } from 'next-auth';
import { Link2 } from 'lucide-react';
import Link from 'next/link';

export async function Header() {
	const session: Session | null = await getServerSession();
	return (
		<header className="text-center space-y-4">
			<div className="flex items-center justify-center gap-2">
				<Link2 className="h-12 w-12 text-emerald-500" />
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white">URL Shortener</h1>
			</div>
			<p className="text-xl text-gray-600 max-w-2xl mx-auto">
				Transform long URLs into short, shareable links.{' '}
				{!session && (
					<>
						<Link href="/login" className="text-emerald-500 hover:underline">
							Sign in
						</Link>
						to update your links and access more details.
					</>
				)}
			</p>
		</header>
	);
}
