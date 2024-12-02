import { ErrorType } from '@/types/error';
import db from './mongo';
import { IRedirect, RedirectModel } from '@/models/Redirect';
import { LogModel } from '@/models/Logs';
import { UserModel } from '@/models/User';
import { alertNewRedirect } from './telegram';
import { urlsType } from '@/types/url';

export async function createRedirect(longUrl: string, shortUrl: string, email: string): Promise<ErrorType> {
	await db.connect();

	// Check if short URL already exists
	const existing = await RedirectModel.findOne({
		slug: shortUrl,
	});

	if (existing) {
		return {
			error: 'Short URL already exists',
			status: 400,
		};
	}

	const user = await UserModel.findOne({
		email,
	});

	let createObject: {
		slug: string;
		url: string;
		user?: string;
	} = {
		slug: shortUrl,
		url: longUrl,
	};

	if (user) {
		createObject = {
			...createObject,
			user: user._id,
		};
	}

	// Create new redirect
	const redirect = await RedirectModel.create(createObject);

	if (!redirect) {
		return {
			error: 'Error creating redirect',
			status: 500,
		};
	}

	alertNewRedirect(shortUrl, longUrl, user);

	return {
		error: '',
		status: 201,
	};
}

export async function getRedirect(slug: string): Promise<string | ErrorType> {
	await db.connect();

	const redirect = await RedirectModel.findOne({
		slug,
	});

	await LogModel.create({
		url: redirect._id.toString(),
	});

	if (!redirect) {
		return {
			error: 'Redirect not found',
			status: 404,
		};
	}

	return redirect.url;
}

export async function getRedirects(email: string): Promise<urlsType[]> {
	await db.connect();

	const user = await UserModel.findOne({ email });

	if (!user) {
		return [];
	}

	const redirects = user.role === 'admin' ? await RedirectModel.find() : await RedirectModel.find({ user: user._id });

	const resolvedRedirects = await Promise.all(
		redirects.map(async (redirect: IRedirect) => ({
			id: redirect._id.toString(),
			longUrl: redirect.url,
			shortUrl: redirect.slug,
			creationDate: redirect.creationDate,
			hits: await LogModel.countDocuments({ url: redirect._id.toString() }),
		}))
	);

	return resolvedRedirects;
}
