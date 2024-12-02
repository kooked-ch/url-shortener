import { NextResponse } from 'next/server';
import { deleteRedirect, updateRedirect } from '@/lib/redirect';
import { getServerSession, Session } from 'next-auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	const { longUrl } = await req.json();

	if (!longUrl) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
	}

	if (!/^(https?:\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(longUrl)) {
		return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
	}

	console.log(params.id);

	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const redirect = await updateRedirect(params.id, longUrl, session?.user?.email || '');

	if (redirect.error) {
		return NextResponse.json({ error: redirect.error }, { status: redirect.status });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	const session: Session | null = await getServerSession();

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const redirect = await deleteRedirect(params.id, session?.user?.email || '');

	if (redirect.error) {
		return NextResponse.json({ error: redirect.error }, { status: redirect.status });
	}

	return NextResponse.json({ success: true }, { status: 201 });
}
