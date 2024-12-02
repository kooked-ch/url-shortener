import { Header } from '@/components/header';
import React, { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			<main className="bg-background">{children}</main>;
		</>
	);
}
