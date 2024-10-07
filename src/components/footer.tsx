import { getServerSession } from 'next-auth';
import { UserRound, LogOut } from 'lucide-react';
import Link from 'next/link';

export async function Footer() {
	const session = await getServerSession();

	return (
		<footer className="absolute justify-center w-full flex bottom-1 text-muted-foreground opacity-50 select-none">
			{session ? (
				<div className="flex items-center gap-1 capitalize">
					<UserRound className="w-4 h-4" />
					<p>{session?.user?.name || ''}</p>·
					<Link href="/logout" className="flex items-center gap-1">
						<LogOut className="w-4 h-4" />
						Sign out
					</Link>
				</div>
			) : (
				<Link href="/login" className="flex items-center gap-1">
					<UserRound className="w-4 h-4" />
					<p>Login</p>
				</Link>
			)}
		</footer>
	);
}
