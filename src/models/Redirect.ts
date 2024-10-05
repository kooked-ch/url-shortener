import mongoose, { Document, now } from 'mongoose';

export interface IRedirect extends Document {
	_id: string;
	date: Date;
	slug: string;
	url: string;
}

const redirectsSchema = new mongoose.Schema<IRedirect>({
	date: { type: Date, required: true, default: now() },
	slug: { type: String, required: true },
	url: { type: String, required: true },
});

export const RedirectModel = mongoose.models.Redirect || mongoose.model<IRedirect>('Redirect', redirectsSchema);
