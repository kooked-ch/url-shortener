'use server';
import { getRedirect } from '@/lib/redirect';
import { NextResponse, NextRequest } from 'next/server';
import NotFound from '../not-found';

export async function GET(req: NextRequest) {
	if (req.url.includes(process.env.NEXTAUTH_URL as string)) {
		return NextResponse.redirect(process.env.NEXTAUTH_URL + '/not-found');
	}

	const url = new URL(req.url).pathname.replace('/', '');
	const redirect = await getRedirect(url);

	if (!redirect || typeof redirect !== 'string') {
		return NextResponse.redirect(process.env.NEXTAUTH_URL + '/not-found');
	}

	return NextResponse.redirect(redirect, { status: 302 });
}
