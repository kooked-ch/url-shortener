'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Nav() {
	const pathname = usePathname();
	const isActive = (href: string) => (pathname === href ? 'underline' : '');

	return (
		<nav className="flex items-center gap-4">
			<Link href="/">
				<Button className={cn(isActive('/'), 'text-gray-500 hover:text-gray-600')} variant="link">
					Short Url
				</Button>
			</Link>
			<Link href="/my-short">
				<Button className={cn(isActive('/my-short'), 'text-gray-500 hover:text-gray-600')} variant="link">
					My Short
				</Button>
			</Link>
		</nav>
	);
}
