import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	name: string;
	username?: string;
	image?: string;
	email: string;
	password?: string;
	role: string;
	verified?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
	name: { type: String, required: false },
	username: { type: String, required: true },
	image: { type: String, required: false },
	email: { type: String, required: true },
	password: { type: String, required: false },
	role: { type: String, required: false, default: 'member' },
	verified: { type: Boolean, required: true, default: false },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
