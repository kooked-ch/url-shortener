'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function signOutPage() {
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push('/');
	};

	return (
		<div className="flex items-center justify-center w-full sm:h-screen flex-col sm:p-5 p-2 py-5 mt-12 sm:mt-0 gap-2">
			<div className="flex gap-2 justify-center items-center">
				<h1 className="text-3xl font-black">Sign out</h1>
			</div>
			<p className="text-lg text-muted-foreground">Are you sure you want to sign out?</p>
			<Button onClick={handleSignOut} className="w-1/6">
				Sign out
			</Button>
		</div>
	);
}
