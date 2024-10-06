import { getRedirect } from '@/lib/redirect';
import { NextResponse } from 'next/server';

export default async function RedirectPage(req: { params: { slug: string } }) {
	const { slug } = req.params;

	const redirect = await getRedirect(slug);

	if (!redirect || typeof redirect !== 'string') {
		return NextResponse.redirect('/404');
	}

	return NextResponse.redirect(redirect);
}
