'use server';

import { getServerSession, Session } from 'next-auth';
import { Link2 } from 'lucide-react';
import { Sidebar } from './sidebar';

export async function Header() {
	const session: Session | null = await getServerSession();
	return (
		<header className="text-center space-y-4">
			<div className="flex items-center justify-center gap-2">
				<Link2 className="h-12 w-12 text-emerald-500" />
				<h1 className="text-4xl font-bold text-gray-900 dark:text-white">Url Shortener</h1>
			</div>
			<p className="text-xl text-gray-600 max-w-2xl mx-auto">Easily transform long URLs into short, elegant, and shareable links.</p>
		</header>
	);
}
