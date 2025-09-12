import { Document, Schema, Types, model } from "mongoose";

export interface IGroupMember {
  userId: Types.ObjectId;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
}

export interface IGroupInvite {
  userId: Types.ObjectId;
  invitedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  createdBy: Types.ObjectId;
  members: IGroupMember[];
  invites: IGroupInvite[]; // 👈 aggiunto
}

const GroupMemberSchema = new Schema<IGroupMember>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
  joinedAt: { type: Date, default: Date.now },
});

const GroupInviteSchema = new Schema<IGroupInvite>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  invitedAt: { type: Date, default: Date.now },
});

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [GroupMemberSchema],
  invites: [GroupInviteSchema], // 👈 aggiunto
});

export const Group = model<IGroup>("Group", GroupSchema);
