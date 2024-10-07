import { NextResponse } from 'next/server';
import { createRedirect } from '@/lib/redirect';
import { getServerSession, Session } from 'next-auth';

export async function POST(req: Request) {
	const { longUrl, shortUrl } = await req.json();

	if (!longUrl || !shortUrl) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	const session: Session | null = await getServerSession();

	const redirect = await createRedirect(longUrl, shortUrl, session?.user?.email || '');

	if (redirect.error) {
		return NextResponse.json({ error: redirect.error }, { status: redirect.status });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
