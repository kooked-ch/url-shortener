import { ErrorType } from '@/types/error';
import db from './mongo';
import { RedirectModel } from '@/models/Redirect';

export async function createRedirect(longUrl: string, shortUrl: string): Promise<ErrorType> {
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

	// Create new redirect
	const redirect = await RedirectModel.create({
		slug: shortUrl,
		url: longUrl,
	});

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

	if (!redirect) {
		return {
			error: 'Redirect not found',
			status: 404,
		};
	}

	return redirect.url;
}
