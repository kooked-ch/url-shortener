import { ErrorType } from '@/types/error';
import db from './mongo';
import { IRedirect, RedirectModel } from '@/models/Redirect';
import { LogModel } from '@/models/Logs';
import { UserModel } from '@/models/User';
import { alertNewRedirect } from './telegram';
import { urlsType } from '@/types/url';

export async function createRedirect(longUrl: string, shortUrl: string, userId: string): Promise<ErrorType> {
	await db.connect();

	const slug = encodeURIComponent(shortUrl);

	const existing = await RedirectModel.findOne({
		slug,
	});

	if (existing) {
		return {
			error: 'Short URL already exists',
			status: 400,
		};
	}

	let createObject: {
		slug: string;
		url: string;
		user: string;
		display?: string;
	} = {
		slug: slug,
		url: longUrl,
		user: userId,
	};

	if (shortUrl !== slug) {
		createObject.display = shortUrl;
	}

	const redirect = await RedirectModel.create(createObject);

	if (!redirect) {
		return {
			error: 'Error creating redirect',
			status: 500,
		};
	}

	alertNewRedirect(shortUrl, longUrl);

	return {
		error: '',
		status: 201,
	};
}

export async function getRedirect(slug: string): Promise<string | null> {
	try {
		await db.connect();

		const redirect = await RedirectModel.findOne({
			slug,
		});

		if (!redirect) {
			return null;
		}

		await LogModel.create({
			url: redirect._id.toString(),
		});

		if (!redirect) {
			return null;
		}

		return redirect.url;
	} catch (error) {
		console.error('Error getting redirect:', error);
		return null;
	}
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
			display: redirect?.display,
			hits: await LogModel.countDocuments({ url: redirect._id.toString() }),
		}))
	);

	return resolvedRedirects;
}

export async function getTemporaryUserRedirects(temporaryToken: string | null): Promise<string[]> {
	if (!temporaryToken) {
		return [];
	}

	await db.connect();

	const user = await UserModel.findOne({
		temporaryToken,
		verified: false,
	});

	if (!user) {
		return [];
	}

	const redirects = await RedirectModel.find({ user: user._id });

	return redirects.map((redirect: IRedirect) => new URL(process.env.NEXTAUTH_URL || '').host + '/' + (redirect.display ? redirect.display : redirect.slug));
}

export async function updateRedirect(id: string, longUrl: string, email: string): Promise<ErrorType> {
	try {
		await db.connect();

		const user = await UserModel.findOne({ email });

		if (!user) {
			return {
				error: 'User not found',
				status: 404,
			};
		}

		const query: Record<string, any> = { _id: id };
		if (user.role !== 'admin') {
			query.user = user._id;
		}

		const redirect = await RedirectModel.findOne(query);

		if (!redirect) {
			return {
				error: 'Redirect not found',
				status: 404,
			};
		}

		redirect.url = longUrl;
		await redirect.save();

		return {
			error: '',
			status: 200,
		};
	} catch (error) {
		console.error('Error updating redirect:', error);

		return {
			error: 'An internal error occurred',
			status: 500,
		};
	}
}

export async function deleteRedirect(id: string, email: string): Promise<ErrorType> {
	try {
		await db.connect();

		const user = await UserModel.findOne({ email });

		if (!user) {
			return {
				error: 'User not found',
				status: 404,
			};
		}

		const query: Record<string, any> = { _id: id };
		if (user.role !== 'admin') {
			query.user = user._id;
		}

		await RedirectModel.deleteOne(query);

		return {
			error: '',
			status: 200,
		};
	} catch (error) {
		console.error('Error delete redirect:', error);

		return {
			error: 'An internal error occurred',
			status: 500,
		};
	}
}
