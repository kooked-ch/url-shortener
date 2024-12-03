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
	temporaryToken?: string;
}

const userSchema = new mongoose.Schema<IUser>({
	name: { type: String, required: false },
	username: { type: String, required: false },
	image: { type: String, required: false },
	email: { type: String, required: false },
	password: { type: String, required: false },
	role: { type: String, required: false, default: 'member' },
	verified: { type: Boolean, required: true, default: false },
	temporaryToken: { type: String, required: false },
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
