import { getServerSession } from 'next-auth';
import { UserRound, LogOut } from 'lucide-react';
import Link from 'next/link';

export async function Footer() {
	const session = await getServerSession();

	return (
		<footer className="absolute justify-center w-[calc(100%-2rem)] flex bottom-1 text-muted-foreground opacity-50 select-none">
			{!session && (
				<Link href="/login" className="flex items-center gap-1">
					<UserRound className="w-4 h-4" />
					<p>Login</p>
				</Link>
			)}
		</footer>
	);
}
