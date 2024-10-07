import mongoose, { Document, now } from 'mongoose';

export interface IRedirect extends Document {
	_id: string;
	creationDate: Date;
	updateDate: Date;
	slug: string;
	url: string;
	user?: string;
}

const redirectsSchema = new mongoose.Schema<IRedirect>({
	creationDate: { type: Date, required: true, default: now },
	updateDate: { type: Date, required: true, default: now },
	slug: { type: String, required: true },
	url: { type: String, required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

redirectsSchema.pre('save', function (next) {
	if (this.isModified()) {
		this.updateDate = now();
	}
	next();
});

export const RedirectModel = mongoose.models.Redirect || mongoose.model<IRedirect>('Redirect', redirectsSchema);
