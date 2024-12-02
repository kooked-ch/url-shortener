'use server';
import { UrlList } from '@/components/url-list';
import { authOptions } from '@/lib/auth';
import { getRedirects } from '@/lib/redirect';
import { getServerSession, Session } from 'next-auth';

export default async function DeploymentsPage() {
	const session: Session | null = await getServerSession(authOptions);

	const urls = await getRedirects(session?.user?.email as string);

	return <UrlList urls={urls} />;
}
