import { ShortList } from '@/components/shortList';
import { getRedirects } from '@/lib/redirect';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function MyShortPage() {
	const session = await getServerSession();

	if (!session) {
		redirect('/login');
	}

	const redirects = await getRedirects(session?.user?.email || '');

	if (redirects.length === 0) {
		return (
			<div className="flex justify-center w-full mt-24">
				<h1 className="text-3xl font-black">URL Shortener</h1>
				There are no redirects
			</div>
		);
	}

	return (
		<div className="flex justify-center w-full">
			<ShortList items={redirects} />
		</div>
	);
}
