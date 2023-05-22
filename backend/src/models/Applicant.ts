import { model, Schema, Types } from "mongoose";
import { Role } from "./Role";

export enum Status {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  UNDER_ANALYSIS = "UNDER ANALYSIS",
}

export interface Applicant {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
  email: string;
  avatar?: { buffer: Buffer; mimetype: string };
  status: Status;
  roles: Role[];
  softDeleted?: boolean;
}

const ApplicantDatabaseSchema = new Schema<Applicant>(
  {
    name: { type: String, required: true, index: "text" },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, index: "text", unique: true },
    avatar: { buffer: { type: Buffer }, mimetype: { type: String } },
    status: {
      type: String,
      enum: Status,
      default: Status.UNDER_ANALYSIS,
      index: "text",
    },
    roles: { type: [Types.ObjectId], default: [], ref: "RolesCollection" },
    softDeleted: { type: Boolean, default: false, index: true },
  },
  { collection: "ApplicantsCollection" }
);

export const ApplicantsModel = model(
  "ApplicantsCollection",
  ApplicantDatabaseSchema
);
