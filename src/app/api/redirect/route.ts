import { NextResponse } from 'next/server';
import { createRedirect } from '@/lib/redirect';
import { getServerSession } from 'next-auth';
import { UserModel } from '@/models/User';
import { cookies } from 'next/headers';
import db from '@/lib/mongo';
import rateLimit from '@/lib/rate-limit';

function generateRandomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
}

const limiter = rateLimit({
	interval: 60 * 1000, // 1-minute interval
	uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
	try {
		const { longUrl, shortUrl } = await req.json();

		if (!longUrl || !shortUrl) {
			return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
		}

		const { isRateLimited, headers } = limiter.check(5, 'CREATE_REDIRECT');
		if (isRateLimited) {
			return NextResponse.json({ error: 'Please wait a moment before creating another link' }, { status: 429, headers });
		}

		const session = await getServerSession();
		const cookieStore = cookies();

		await db.connect();

		let user = null;

		if (session?.user?.email) {
			user = await UserModel.findOne({ email: session.user.email });
		} else {
			const cookieData = cookieStore.get('__Secure-next-auth.temporary');
			const temporaryToken = cookieData?.value;

			if (temporaryToken) {
				user = await UserModel.findOne({ temporaryToken });
			} else {
				const token = generateRandomString(1024);
				user = await UserModel.create({
					email: null,
					username: null,
					temporaryToken: token,
				});

				cookieStore.set('__Secure-next-auth.temporary', token, {
					httpOnly: true,
					secure: true,
					sameSite: 'strict',
				});
			}
		}

		if (!user) {
			return NextResponse.json({ error: 'User not found or could not be created' }, { status: 404 });
		}

		const slug = encodeURIComponent(shortUrl);

		const redirect = await createRedirect(longUrl, slug, user._id);
		if (redirect.error) {
			return NextResponse.json({ error: redirect.error }, { status: redirect.status });
		}

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		console.error('Error in POST handler:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
