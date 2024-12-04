'use server';

import { UrlShortener } from '@/components/url-shortener';
import { Header } from '@/components/header';
import { Features } from '@/components/features';
import { cookies } from 'next/headers';
import { getTemporaryUserRedirects } from '@/lib/redirect';

export default async function MainPage(req: Request) {
	const baseUrl = process.env.NEXTAUTH_URL || '';
	const cookieStore = await cookies();
	console.log(cookieStore);
	console.log(cookieStore.get('__Secure-next-auth.temporary'));
	const baseUrls: string[] = await getTemporaryUserRedirects(cookieStore.get('__Secure-next-auth.temporary')?.value || null);

	return (
		<div className="w-full px-4 py-12 space-y-16">
			<Header />
			<UrlShortener baseUrl={new URL(baseUrl).host} baseUrls={baseUrls} />
			<Features />
		</div>
	);
}
