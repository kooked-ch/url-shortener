'use client';
import { Home, List, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Session } from 'next-auth';

const NAVIGATION_ITEMS = [
	{ name: 'Home', href: '/', icon: Home },
	{ name: 'URL List', href: '/urls', icon: List },
];

const UserAvatar = ({ session }: { session: Session | null }) => (
	<div className="flex items-center gap-3">
		<Avatar className="border shadow-sm w-8 h-8 lg:w-10 lg:h-10">
			<AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? 'Guest User'} />
			<AvatarFallback>
				{session?.user?.name
					?.split(' ')
					.map((word) => word.charAt(0).toUpperCase())
					.join('')}
			</AvatarFallback>
		</Avatar>
		<div>
			<p className="text-sm font-semibold text-left">{session?.user?.name ?? 'Guest User'}</p>
			<p className="text-sm text-muted-foreground w-44 truncate text-left">{session?.user?.email ?? ''}</p>
		</div>
	</div>
);

const NavigationMenu = ({ pathname, isCollapsed = false }: { pathname: string; isCollapsed?: boolean }) => (
	<nav className={cn(isCollapsed ? 'space-y-2 flex flex-col items-center' : 'flex flex-col gap-2')}>
		{NAVIGATION_ITEMS.map((item) => (
			<Link key={item.name} href={item.href}>
				<Button variant="ghost" className={cn(isCollapsed ? 'w-auto px-3' : 'w-full', 'justify-start gap-2', pathname === item.href && 'bg-muted')} size={isCollapsed ? 'icon' : 'default'}>
					<item.icon className="h-5 w-5" />
					{!isCollapsed && <span>{item.name}</span>}
				</Button>
			</Link>
		))}
	</nav>
);

export function Sidebar({ session }: { session: Session | null }) {
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		localStorage.setItem('isOpen', isOpen.toString());
	}, [isOpen]);

	return (
		<>
			{/* Mobile Sidebar */}
			<Sheet>
				<SheetTrigger asChild className="lg:hidden">
					<Button variant="ghost" size="icon" className="fixed top-4 left-4">
						<Menu className="h-6 w-6" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 p-0">
					<div className="flex flex-col h-full">
						<div className="flex-1 px-4 py-6 space-y-4">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold">URL Shortener</h2>
								<ThemeToggle />
							</div>
							<NavigationMenu pathname={pathname} />
						</div>
						<div className="p-4 border-t">
							<UserAvatar session={session} />
						</div>
					</div>
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<div className={cn('hidden lg:flex min-h-screen flex-col border-r bg-card relative', isOpen ? 'w-64' : 'w-20')}>
				<Button variant="ghost" size="icon" className="absolute top-4 -right-4 h-8 w-8 rounded-full border bg-background" onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
				</Button>
				<div className={cn('flex flex-col h-full', !isOpen && 'items-center')}>
					{isOpen ? (
						<div className="flex flex-col min-h-screen">
							<div className="flex-1 px-4 py-6 space-y-4">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-lg font-semibold">URL Shortener</h2>
									<ThemeToggle />
								</div>
								<NavigationMenu pathname={pathname} />
							</div>
							<div className="p-4 border-t">
								<UserAvatar session={session} />
							</div>
						</div>
					) : (
						<div className="py-6 flex flex-col items-center gap-4">
							<ThemeToggle />
							<NavigationMenu pathname={pathname} isCollapsed />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
