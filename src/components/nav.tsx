'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Nav() {
	const pathname = usePathname();
	const isActive = (href: string) => (pathname === href ? 'underline' : '');

	return (
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
	);
}
