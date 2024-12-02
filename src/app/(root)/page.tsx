'use server';

import ShortForm from '@/components/forms/shortForm';
import { Link } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function MainPage() {
	const session = await getServerSession();
	const baseUrl = process.env.NEXTAUTH_URL || '';

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 text-center space-y-4">
				<div className="flex items-center justify-center space-x-3">
					<Link className="h-12 w-12 text-primary" />
					<h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 text-transparent bg-clip-text">Url Shortener</h1>
				</div>
				<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Easily transform long URLs into short, elegant, and shareable links.</p>
			</div>
			<ShortForm baseUrl={new URL(baseUrl).host} />;
		</div>
	);
}
