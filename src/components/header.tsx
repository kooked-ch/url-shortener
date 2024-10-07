'use server';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function Header() {
	const session = await getServerSession();
	const headerList = headers();
	const pathname = headerList.get('x-current-path');

	const isActive = (href: string) => (pathname === href ? 'underline' : '');

	if (!session) {
		return <></>;
	}

	return (
		<header className="absolute top-2 w-full flex justify-center">
			<nav className="flex items-center gap-4">
				<Link href="/">
					<Button className={isActive('/')} variant="link">
						Short Url
					</Button>
				</Link>
				<Link href="/my-short">
					<Button className={isActive('/my-short')} variant="link">
						My Short
					</Button>
				</Link>
			</nav>
		</header>
	);
}
