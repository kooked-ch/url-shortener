import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

const fontHeading = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-heading',
});

const fontBody = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-body',
});

type RootLayoutProps = {
	children: React.ReactNode;
	session: Session | null;
};

export default function RootLayout(props: RootLayoutProps) {
	const { children, session } = props;
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
