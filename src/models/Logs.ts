import mongoose, { Document, now } from 'mongoose';

export interface ILog extends Document {
	_id: string;
	date: Date;
	url: String;
}

const logsSchema = new mongoose.Schema<ILog>({
	date: { type: Date, required: true, default: now() },
	url: { type: mongoose.Schema.Types.ObjectId, ref: 'Redirect', required: true },
});

export const LogModel = mongoose.models.Log || mongoose.model<ILog>('Log', logsSchema);
