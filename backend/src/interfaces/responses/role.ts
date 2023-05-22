import { Types } from "mongoose";
import { ApplicantWithoutRoles } from "./applicant";

export interface RoleWithoutApplicants {
  _id: Types.ObjectId;
  name: string;
}

export interface RoleResponse {
  _id: Types.ObjectId;
  name: string;
  applicants: ApplicantWithoutRoles[];
}
