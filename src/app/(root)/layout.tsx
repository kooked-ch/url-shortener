import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { getServerSession, Session } from 'next-auth';
import React, { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session: Session | null = await getServerSession();
	return (
		<main className="bg-background">
			{session && <Sidebar session={session} />}
			{children}
		</main>
	);
}
