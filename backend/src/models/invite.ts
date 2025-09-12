import { Document, Schema, Types, model } from "mongoose";

export interface IInvite extends Document {
  groupId: Types.ObjectId;
  email: string;
  token: string;
  inviterId: Types.ObjectId;
  expiresAt: Date;
  accepted: boolean;
}

const InviteSchema = new Schema<IInvite>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  email: { type: String, required: true },
  token: { type: String, required: true },
  inviterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
  accepted: { type: Boolean, default: false },
});

InviteSchema.index({ token: 1 });

export const Invite = model<IInvite>("Invite", InviteSchema);
