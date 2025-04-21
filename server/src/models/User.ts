import mongoose, { Document, Schema } from 'mongoose';

// Tipado del documento completo
export interface IUser extends Document {
  notion_access_token: string;
  notion_refresh_token?: string;
  notion_user_id?: string;
  notion_token_expires_at?: Date;

  google_access_token: string;
  google_refresh_token?: string;
  google_user_id?: string;
  google_token_expires_at?: Date;

  created_at: Date;
  updated_at: Date;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  notion_access_token: { type: String, required: true },
  notion_refresh_token: { type: String },
  notion_user_id: { type: String },
  notion_token_expires_at: { type: Date },

  google_access_token: { type: String, required: true },
  google_refresh_token: { type: String },
  google_user_id: { type: String },
  google_token_expires_at: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', userSchema);
