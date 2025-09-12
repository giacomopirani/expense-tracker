import { Document, Schema, Types, model } from "mongoose";

export interface IGroupMember {
  userId: Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  currency: string;
  members: IGroupMember[];
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const MemberSchema = new Schema<IGroupMember>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  joinedAt: { type: Date, default: Date.now },
});

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  currency: { type: String, default: "EUR" },
  members: { type: [MemberSchema], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

GroupSchema.index({ createdBy: 1 });
GroupSchema.index({ "members.userId": 1 });

export const Group = model<IGroup>("Group", GroupSchema);
