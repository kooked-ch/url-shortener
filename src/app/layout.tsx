import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
