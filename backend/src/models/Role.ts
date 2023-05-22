import { model, Schema, Types } from "mongoose";
import { Applicant } from "./Applicant";

export interface Role {
  _id: Types.ObjectId;
  name: string;
  applicants: Applicant[];
  softDeleted?: boolean;
}

const RoleDatabaseSchema = new Schema<Role>(
  {
    name: { type: String, required: true, index: "text", unique: true },
    applicants: {
      type: [Types.ObjectId],
      default: [],
      ref: "ApplicantsCollection",
    },
    softDeleted: { type: Boolean, default: false, index: true },
  },
  { collection: "RolesCollection" }
);

export const RolesModel = model("RolesCollection", RoleDatabaseSchema);
