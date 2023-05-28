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
  roles: { role: Role; status: Status }[];
  softDeleted?: boolean;
}

const ApplicantDatabaseSchema = new Schema<Applicant>(
  {
    name: { type: String, required: true, index: "text" },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, index: "text", unique: true },
    avatar: {
      type: { buffer: { type: Buffer }, mimetype: { type: String } },
      unique: false,
    },
    roles: {
      type: [
        {
          role: { type: Types.ObjectId, ref: "RolesCollection" },
          status: {
            type: String,
            enum: Status,
          },
        },
      ],
      default: [],
    },
    softDeleted: { type: Boolean, default: false, index: true },
  },
  { collection: "ApplicantsCollection" }
);

export const ApplicantsModel = model(
  "ApplicantsCollection",
  ApplicantDatabaseSchema
);
