'use client';
import React, { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

function LoginForm() {
	return (
		<div className="flex flex-col items-center justify-center w-full sm:h-screen sm:p-8 p-4">
			<Link href="/" className="flex gap-2 justify-center items-center mb-6">
				<h1 className="text-4xl font-extrabold ">URL Shortener</h1>
			</Link>
			<Card className="w-full sm:w-96 shadow-lg rounded-lg p-6">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-semibold">Sign In</CardTitle>
					<CardDescription className="text-center text-sm  mt-1">Sign in with your account to continue.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="outline" className="w-full flex items-center justify-center mt-4 py-3" onClick={() => signIn('github', { callbackUrl: '/' })}>
						<Github className="mr-2 h-5 w-5" />
						Sign in with GitHub
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SignInPage() {
	return (
		<Suspense fallback={<div className="flex justify-center items-center w-full h-screen text-gray-600">Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}
