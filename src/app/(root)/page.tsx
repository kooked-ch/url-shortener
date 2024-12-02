'use server';

import { Link } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { UrlShortener } from '@/components/url-shortener';
import { Header } from '@/components/header';
import { Features } from '@/components/features';

export default async function MainPage() {
	const session = await getServerSession();
	const baseUrl = process.env.NEXTAUTH_URL || '';

	return (
		<div className="w-full px-4 py-12 space-y-16">
			<Header />
			<UrlShortener baseUrl={new URL(baseUrl).host} />
			<Features />
		</div>
	);
}
