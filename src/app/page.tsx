'use server';

import ShortForm from '@/components/shortForm';
import { getServerSession } from 'next-auth';

export default async function MainPage() {
	const session = await getServerSession();
	const baseUrl = process.env.NEXTAUTH_URL || '';
	return <ShortForm baseUrl={new URL(baseUrl).host} session={session} />;
}
