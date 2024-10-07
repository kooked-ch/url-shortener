import { ErrorType } from '@/types/error';
import db from './mongo';
import { RedirectModel } from '@/models/Redirect';
import { LogModel } from '@/models/Logs';
import { UserModel } from '@/models/User';

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
