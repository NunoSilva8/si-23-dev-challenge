import { Types } from "mongoose";
import { Status } from "../../models/Applicant";

export interface NewRoleRequestBody {
  name: string;
  applicants?: { applicant: Types.ObjectId; status: Status }[];
}

export interface UpdateRoleRequestBody {
  name?: string;
  applicants?: { applicant: Types.ObjectId; status: Status }[];
}
