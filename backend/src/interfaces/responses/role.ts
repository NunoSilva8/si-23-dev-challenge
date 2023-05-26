import { Types } from "mongoose";
import { ApplicantWithoutRoles } from "./applicant";
import { Status } from "../../models/Applicant";

export interface RoleWithoutApplicants {
  role: {
    _id: Types.ObjectId;
    name: string;
  };
  status: Status;
}

export interface RoleResponse {
  _id: Types.ObjectId;
  name: string;
  applicants: ApplicantWithoutRoles[];
}
